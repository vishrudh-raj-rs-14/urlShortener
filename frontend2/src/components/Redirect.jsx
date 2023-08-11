import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { alertError } from "../utils/alertHelper";

const Redirect = () => {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`http://localhost:5500/api/url/${id}`, {
        withCredentials: true,
      })
      .then((data) => {
        location.href = data.data.url.oldUrl;
      })
      .catch((err) => {
        console.log(err);
        alertError("Something went wrong");
        navigate("/");
      });
  }, []);
  return (
    <div className="login-c">
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Redirect;
