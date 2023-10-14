import React, { useState, useContext } from "react";
import "../Login/login.scss";
import { Link, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { server, Context } from "../../main";
import Spinner from "../Spinner";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated, isLoading, setIsLoading } =
    useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const { data } = await axios.post(
        `${server}/user/login`,
        {
          email,
          password,
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
      setIsAuthenticated(true);
    } catch (error) {
      toast.error(error.response.data.message);
      setIsLoading(false);
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated) return <Navigate to={"/"} />;

  return (
    <main>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="login_form">
          <form onSubmit={handleLogin}>
            <h2>To-Do App Login</h2>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input type="submit" value="Login" />
          </form>
          <p>
            Don't have account?
            <Link to="/signup">
              <strong>SignUp</strong>
            </Link>
          </p>
        </div>
      )}
    </main>
  );
};

export default Login;
