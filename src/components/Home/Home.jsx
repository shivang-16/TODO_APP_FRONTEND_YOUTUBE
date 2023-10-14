import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Home/home.scss";
import axios from "axios";
import toast from "react-hot-toast";
import { server, Context } from "../../main";
import Spinner from "../Spinner";

const Home = () => {
  const { isAuthenticated, setIsAuthenticated, isLoading, setIsLoading } =
    useContext(Context);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [description, setDescription] = useState("");
  const [task, setTask] = useState("");
  const [refresh, setRefresh] = useState("");
  const [editTask, setEditTask] = useState({
    _id: "",
    title: "",
    description: "",
    tag: "",
  });
  const [user, setUser] = useState("");

  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${server}/user/profile`, {
        withCredentials: true,
      });
      setUser(data.user);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const confirm = window.confirm("Are you sure want to logout");
    if (confirm) {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${server}/user/logout`, {
          withCredentials: true,
        });

        toast.success(data.message);
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate("/login");
      } catch (error) {
        toast.error(error.response.data.message);
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${server}/task/create`,
        {
          title,
          description,
          tag,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      setRefresh((prev) => !prev);
      setIsLoading(false);
      setTitle("");
      setDescription("");
      setTag("");
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      setIsLoading(false);
      setRefresh((prev) => !prev);
    }
  };

  const getTask = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${server}/task/my`, {
        withCredentials: true,
      });
      setTask(data.tasks);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };

  const handleDelete = async (_id) => {
    const confirm = window.confirm("Are you sure want to delete task");
    if (confirm) {
      try {
        setIsLoading(true);
        let { data } = await axios.delete(`${server}/task/${_id}`, {
          withCredentials: true,
        });
        toast.success(data.message);
        setRefresh((prev) => !prev);
        setIsLoading(false);
      } catch (error) {
        toast.error(error.response.data.message);
        setIsLoading(false);
        setRefresh((prev) => !prev);
      }
    }
  };

  const handleEdit = (_id) => {
    const taskToEdit = task.find((task) => task._id === _id);
    if (taskToEdit) {
      setEditTask({
        _id: taskToEdit._id,
        title: taskToEdit.title,
        tag: taskToEdit.tag,
        description: taskToEdit.description,
      });
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await axios.patch(
        `${server}/task/${editTask._id}`,
        {
          title: editTask.title,
          description: editTask.description,
          tag: editTask.tag,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      toast.success(data.message);
      setIsLoading(false);
      setRefresh((prev) => !prev);
      setEditTask({ title: "", description: "", tag: "" });
    } catch (error) {
      toast.error(error.response.data.message);
      setIsLoading(false);
      setRefresh((prev) => !prev);
    }
  };

  const handleCancel = () => {
    setEditTask({ _id: "", title: "", description: "", tag: "" });
  };

  const handleDeleteProfile = async () => {
    let confirm = window.confirm("Are you sure want to delete you profile");
    if (confirm) {
      try {
        let { data } = await axios.delete(`${server}/user/delete`, {
          withCredentials: true,
        });
        toast.success(data.message);
        navigate("/login");
        setIsLoading(false);
        setIsAuthenticated(false);
      } catch (error) {
        toast.error(error.response.data.message);
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getProfile();
    getTask();
  }, [refresh]);

  return (
    <div id="mainbody">
      <div className="navbar">
        <div className="name">
          <h2>ToDo_App</h2>
          <div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        </div>
        <div className="function">
          { isAuthenticated? <button onClick={handleDeleteProfile}>Delete Profile</button> : ""}
          {isAuthenticated ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">
              <button>Login</button>
            </Link>
          )}
        </div>
      </div>
      <div className="content-section">
        <form className="todo-form" onSubmit={createTask}>
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </div>
          <textarea
            placeholder="Enter the description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input type="submit" value="Create Task" />
        </form>
        {isLoading ? (
          <Spinner />
        ) : isAuthenticated === true && task ? (
          task.map((element, index) => {
            const { title, description, tag, _id } = element;
            return (
              <div className="todos" key={index}>
                <div className="todo-content">
                  <h3>{title}</h3>
                  <p>{description}</p>

                  <div className="tag">{tag}</div>
                </div>
                <div className="todo-check function">
                  <button onClick={() => handleEdit(_id)}>Edit</button>
                  <button onClick={() => handleDelete(_id)}>Delete</button>
                </div>
              </div>
            );
          })
        ) : (
          "No data found"
        )}
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        editTask._id && (
          <div className="modal-container">
            <div className="modal-content">
              <span className="modal-close" onClick={handleCancel}>
                &times;
              </span>
              <h2>Edit Note</h2>
              <div>
                <form className="todo-form" onSubmit={handleEditSave}>
                  <div>
                    <input
                      type="text"
                      placeholder="Edit Title"
                      value={editTask.title}
                      onChange={(e) =>
                        setEditTask({ ...editTask, title: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Edit Tag"
                      value={editTask.tag}
                      onChange={(e) =>
                        setEditTask({ ...editTask, tag: e.target.value })
                      }
                    />
                  </div>
                  <textarea
                    placeholder="Edit Description"
                    value={editTask.description}
                    onChange={(e) =>
                      setEditTask({ ...editTask, description: e.target.value })
                    }
                  />
                  <div className="function">
                    <button type="submit">Update</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Home;
