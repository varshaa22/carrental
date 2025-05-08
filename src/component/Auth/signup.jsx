import React, { useState } from "react";
import "./signup.css"; // Reuse your login styles
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("RENTER"); // Default role, adjust as needed
  const [msgUsername, setMsgUsername] = useState(null);
  const [msgPassword, setMsgPassword] = useState(null);
  const [signupError, setSignupError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(null);

  const navigate = useNavigate();

  const signup = () => {
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
      role: role,
    };

    axios
      .post("http://localhost:8081/api/userLogin/signup", body)
      .then((response) => {
        setSignupSuccess("Signup successful! You can now log in.");
        setSignupError(null);
        
        setTimeout(() => navigate("/login"), 1500);
      })
      .catch((error) => {
        setSignupError(
          error.response?.data?.message ||
            "Signup failed. Username may already be taken."
        );
        setSignupSuccess(null);
      });
  };

  return (
    <div className="login-wrapper d-flex justify-content-center align-items-center vh-100">
      <div className="login-card text-center p-4">
        <h2 className="mb-2 text-white">Sign Up</h2>
        <p className="text-muted mb-4">Create your account.</p>
        <div className="card-body text-white small">
          {msgUsername && <div className="mb-4">{msgUsername}</div>}
          {msgPassword && <div className="mb-4">{msgPassword}</div>}
          {signupError && <div className="mb-4 text-danger">{signupError}</div>}
          {signupSuccess && <div className="mb-4 text-success">{signupSuccess}</div>}

          <div className="text-start mb-3">
            <label className="form-label text-success small">Username</label>
            <input
              type="text"
              className="form-control custom-input"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setMsgUsername(null);
                setSignupError(null);
              }}
            />
          </div>

          <div className="text-start mb-4">
            <label className="form-label text-success small">Password</label>
            <input
              type="password"
              className="form-control custom-input"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setMsgPassword(null);
                setSignupError(null);
              }}
            />
          </div>

          <div className="text-start mb-4">
            <label className="form-label text-success small">Role</label>
            <select
              className="form-control custom-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="RENTER">Renter</option>
              <option value="MANAGER">Manager</option>
              {/* Add more roles if needed */}
            </select>
          </div>

          <button className="btn btn-success w-100 mb-3" onClick={signup}>
            Sign Up
          </button>
        </div>

        <div className="mb-3">
          <a href="/login" className="small text-success text-decoration-none">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
