import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msgUsername, setMsgUsername] = useState(null);
  const [msgPassword, setMsgPassword] = useState(null);
  const [loginError, setLoginError] = useState(null);

  const navigate = useNavigate();

  const login = () => {
    if (!username || username.trim() === "") {
      setMsgUsername("Username cannot be blank!");
      return;
    } else {
      setMsgUsername(null);
    }

    if (!password || password.trim() === "") {
      setMsgPassword("Password cannot be blank!");
      return;
    } else {
      setMsgPassword(null);
    }

    const body = {
      username: username,
      password: password,
    };

    axios
      .post("http://localhost:8081/api/userLogin/token/generate", body)
      .then((response) => {
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);

        axios
          .get("http://localhost:8081/api/userLogin/userDetails", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((resp) => {
            // Redirect based on role
            const userId = resp.data.userId;
            localStorage.setItem("userId", userId);
            
            const role = resp.data.role;
            localStorage.setItem("role", role);
            switch (role) {
              case "MANAGER":
                navigate("/bookingapproval");
                break;
              case "RENTER":
                navigate("/carlist");
                break;
              default:
                navigate("/carlist");
                break;
            }
          })
          .catch((err) => {
            setLoginError("Failed to fetch user details.");
          });
      })
      .catch((error) => {
        setLoginError("Login failed. Please check your credentials.");
      });
  };

  return (
    <div className="login-wrapper d-flex justify-content-center align-items-center vh-100">
      <div className="login-card text-center p-4">
        <h2 className="mb-2 text-white">Login</h2>
        <p className="text-muted mb-4">Please enter your name and password.</p>
        <div className="card-body text-white small">
          {msgUsername && <div className="mb-4">{msgUsername}</div>}
          {msgPassword && <div className="mb-4">{msgPassword}</div>}
          {loginError && <div className="mb-4 text-danger">{loginError}</div>}

          <div className="text-start mb-3">
            <label className="form-label text-success small">Enter Your Username</label>
            <input
              type="text"
              className="form-control custom-input"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setMsgUsername(null);
                setLoginError(null);
              }}
            />
          </div>

          <div className="text-start mb-4">
            <label className="form-label text-success small">Enter your password</label>
            <input
              type="password"
              className="form-control custom-input"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setMsgPassword(null);
                setLoginError(null);
              }}
            />
          </div>

          <button className="btn btn-success w-100 mb-3" onClick={login}>
            Login
          </button>
        </div>

        <div className="mb-3">
          <a href="#" className="small text-success text-decoration-none">Forget password</a>
        </div>

        <div className="d-flex align-items-center mb-3">
          <hr className="flex-grow-1 text-secondary" />
          <span className="mx-2 text-secondary small">or</span>
          <hr className="flex-grow-1 text-secondary" />
        </div>

        <Link to="/signup" className="btn btn-outline-success w-100">
            Sign up
        </Link>

      </div>
    </div>
  );
}

export default LoginPage;
