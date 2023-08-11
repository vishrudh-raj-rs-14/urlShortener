import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alertError, alertSuccess } from "../utils/alertHelper";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "../redux/user";
import FileSaver from "file-saver";

const Urls = () => {
  const [url, setUrl] = useState("");
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);
  const [shortenedUrl, setShortenedUrl] = useState("");
  const myUrls = useQuery({
    queryKey: [user?.id, "url"],
    queryFn: () =>
      axios
        .get("http://localhost:5500/api/url", { withCredentials: true })
        .then((res) => res.data),
  });
  const urlMutation = useMutation({
    mutationFn: () => {
      return axios
        .post(
          "http://localhost:5500/api/url/",
          { url, shortenedUrl },
          {
            withCredentials: true,
          }
        )
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([user?.id, "url"]);
    },
  });
  const logoutMutation = useMutation({
    mutationFn: () => {
      return axios
        .get("http://localhost:5500/api/user/logout", {
          withCredentials: true,
        })
        .then((res) => res.data)
        .then((data) => {
          dispatch(logout(data.user));
        });
    },
  });
  const handleLogout = (e) => {
    e.preventDefault();
    logoutMutation
      .mutateAsync()
      .then((data) => {
        alertSuccess("Logged out successfully");
        navigate("/login");
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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url) {
      return alertError("Enter a full url");
    }
    if (!shortenedUrl) {
      return alertError("Enter a shortend vrsion required");
    }
    urlMutation
      .mutateAsync()
      .then((data) => {
        alertSuccess("Copied to clipboard successfully");
        navigator.clipboard.writeText(
          `http://localhost:3000/url/${data.newUrl.newUrl}`
        );
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
  if (myUrls.isLoading) {
    return (
      <div>
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
        <div className="nav-bar">
          <button
            className="profile"
            onClick={handleLogout}
            disabled={logoutMutation.isLoading}
          >
            {user?.name[0]?.toUpperCase()}
          </button>
        </div>
        <div className="cointainer">
          <div>
            <div className="header">URL Shortener</div>
            <div className="inputs">
              <div className="input url">
                <input
                  placeholder="Enter Original Url"
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                  }}
                />
              </div>
              <div className="input url">
                <input
                  placeholder="Enter new Url"
                  type="text"
                  value={shortenedUrl}
                  onChange={(e) => {
                    setShortenedUrl(e.target.value);
                  }}
                />
              </div>
              <div className="submit">
                <button
                  onClick={handleSubmit}
                  disabled={urlMutation.isLoading}
                  className="btn"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div className="urls">
            <div className="heading">My URLS</div>
            <div className="table">Loading...</div>
          </div>
        </div>
      </div>
    );
  }
  if (myUrls.isError) {
    return (
      <div>
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
        <div className="nav-bar">
          <button
            className="profile"
            onClick={handleLogout}
            disabled={logoutMutation.isLoading}
          >
            {user?.name[0]?.toUpperCase()}
          </button>
        </div>
        <div className="cointainer">
          <div>
            <div className="header">URL Shortener</div>
            <div className="inputs">
              <div className="input url">
                <input
                  placeholder="Enter Original Url"
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                  }}
                />
              </div>
              <div className="input url">
                <input
                  placeholder="Enter new Url"
                  type="text"
                  value={shortenedUrl}
                  onChange={(e) => {
                    setShortenedUrl(e.target.value);
                  }}
                />
              </div>
              <div className="submit">
                <button
                  onClick={handleSubmit}
                  disabled={urlMutation.isLoading}
                  className="btn"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div className="urls">
            <div className="heading">My URLS</div>
            <div className="table">Something went wrong</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
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
      <div className="nav-bar">
        <button
          className="profile"
          onClick={handleLogout}
          disabled={logoutMutation.isLoading}
        >
          {user?.name[0]?.toUpperCase()}
        </button>
      </div>
      <div className="cointainer">
        <div>
          <div className="header">URL Shortener</div>
          <div className="inputs">
            <div className="input url">
              <input
                placeholder="Enter Original Url"
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
              />
            </div>
            <div className="input url">
              <input
                placeholder="Enter new Url"
                type="text"
                value={shortenedUrl}
                onChange={(e) => {
                  setShortenedUrl(e.target.value);
                }}
              />
            </div>
            <div className="submit">
              <button
                onClick={handleSubmit}
                disabled={urlMutation.isLoading}
                className="btn"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="urls">
          <div className="heading">My URLS</div>
          <div className="table">
            {myUrls.data.myUrls.map((ele, i) => {
              return (
                <div key={i} className="data">
                  <Link to={ele.oldUrl}>
                    <div className="org-url side-line">{ele.oldUrl}</div>
                  </Link>
                  <Link to={`http://localhost:3000/url/${ele.newUrl}`}>
                    <div className="new-url side-line">
                      localhost:3000/url/{ele.newUrl}
                    </div>
                  </Link>
                  <div
                    className="new-url stats-button"
                    onClick={(e) => {
                      console.log(JSON.stringify(ele.location));
                      let blob;
                      if (ele.location) {
                        blob = new Blob([JSON.stringify(ele.location)], {
                          type: "text/plain;charset=utf-8",
                        });
                      } else {
                        blob = new Blob(["No data"], {
                          type: "text/plain;charset=utf-32",
                        });
                      }
                      FileSaver.saveAs(
                        blob,
                        `stats-${Date.now()}-${ele.id}.txt`
                      );
                    }}
                  >
                    Get Usage Stats
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Urls;
