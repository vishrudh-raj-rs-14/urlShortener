import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { alertError, alertSuccess } from "../utils/alertHelper";
import { setUser } from "../redux/user";

const Login = () => {
  const { user } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => {
      return axios
        .post(
          "http://localhost:5500/api/user/login",
          { email, password },
          {
            withCredentials: true,
          }
        )
        .then((res) => res.data)
        .then((data) => {
          dispatch(setUser(data.user));
        });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      return alertError("Enter a email");
    }
    if (!password) {
      return alertError("Enter a password");
    }
    loginMutation
      .mutateAsync({
        email,
        password,
      })
      .then((data) => {
        alertSuccess("Logged in successfully");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        alertError(
          err?.response?.data?.message
            ? err?.response?.data.message
            : "Something went wrong"
        );
      });
  };

  return (
    <div className="login-c">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div>
        <div className="header">Login</div>
        <div className="input">
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="input">
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="link">
          New Here?
          <Link className="linkTo" to="/signup">
            {" "}
            Register
          </Link>
        </div>

        <div className="submit">
          <button
            className="btn"
            onClick={handleSubmit}
            disabled={loginMutation.isLoading}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
