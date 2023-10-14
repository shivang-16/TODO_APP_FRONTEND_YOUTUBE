import React, { useState, useContext } from "react";
import "../Login/login.scss";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { server, Context } from "../../main";
import toast from "react-hot-toast";
import Spinner from "../Spinner";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isAuthenticated, setIsAuthenticated, isLoading, setIsLoading } =
    useContext(Context);

  const handleSignUp = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const { data } = await axios.post(
        `${server}/user/register`,
        {
          name,
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
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  if (isAuthenticated) return <Navigate to={"/"} />;

  return (
    <main>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="login_form">
          <form onSubmit={handleSignUp}>
            <h2>To-Do App Login</h2>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
            <input type="submit" value="SignUp" />
          </form>
          <p>
            Don't have account?
            <Link to="/">
              <strong>Login</strong>
            </Link>
          </p>
        </div>
      )}
    </main>
  );
};

export default SignUp;
