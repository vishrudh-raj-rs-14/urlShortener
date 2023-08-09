import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { setUser } from "../redux/user";
import axios from "axios";
import { alertError, alertSuccess } from "../utils/alertHelper";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signUpMutation = useMutation({
    mutationFn: ({ email, password }) => {
      return axios
        .post(
          "http://localhost:5500/api/user/signup",
          { name, email, password, confirmPassword: cpassword },
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
    if (!name) {
      return alertError("Enter a Name");
    }
    if (!email) {
      return alertError("Enter a email");
    }
    if (!password) {
      return alertError("Enter a password");
    }
    signUpMutation
      .mutateAsync({ name, email, password })
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
        <div className="header">Sign Up</div>
        <div className="input">
          <input
            placeholder="Name"
            value={name}
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
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
        <div className="input">
          <input
            placeholder="Confirm Password"
            type="password"
            value={cpassword}
            onChange={(e) => {
              setCPassword(e.target.value);
            }}
          />
        </div>
        <div className="link">
          Already a user?
          <Link className="linkTo" to="/login">
            Login
          </Link>
        </div>

        <div className="submit">
          <button
            onClick={handleSubmit}
            disabled={signUpMutation.isLoading}
            className="btn"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
