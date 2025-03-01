import React, { useState } from "react";
import "../components/LoginForm.css"; // Ensure your CSS is correctly linked
import loginImg from "../assets/login1.jpg"; // Adjust the image path as needed
import logo from "../assets/logo.jpg"; // Import your logo image
import { FaSyncAlt } from "react-icons/fa"; // Import refresh icon

const generateCaptcha = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += chars[Math.floor(Math.random() * chars.length)];
  }
  return captcha;
};

const LoginForm = () => {
  const [isActive, setIsActive] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [inputCaptcha, setInputCaptcha] = useState("");
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState(""); // State for message class
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State to toggle forgot password form
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  const [email, setEmail] = useState(""); // State for email in forgot password form

  // Toggle Login Form
  const handleToggle = () => {
    setIsActive(!isActive);
  };

  // Handle CAPTCHA Refresh
  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setInputCaptcha("");
    setMessage(""); // Clear any messages
    setMessageClass(""); // Clear message class
  };

  // Handle Login Click
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate CAPTCHA
    if (inputCaptcha !== captcha) {
      setMessage("❌ CAPTCHA is incorrect. Try again.");
      setMessageClass("error");
      return;
    }

    // Prepare the login data
    const loginData = {
      username: username,
      password: password,
    };

    try {
      // Make the API call
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("✅ Login successful!");
        setMessageClass("success");
        setCaptcha(generateCaptcha()); // Refresh CAPTCHA after login
        setInputCaptcha("");
        setUsername("");
        setPassword("");

        // Open a new blank page in a new tab
        window.open("about:blank", "_blank");
      } else {
        const errorData = await response.json();
        setMessage(`❌ ${errorData.message || "Login failed. Please try again."}`);
        setMessageClass("error");
      }
    } catch (error) {
      setMessage("❌ An error occurred. Please try again.");
      setMessageClass("error");
      console.error("Login error:", error);
    }
  };

  // Handle Forgot Password Click
  const handleForgotPassword = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setShowForgotPassword(true); // Show the forgot password form
  };

  // Handle Forgot Password Form Submission
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match. Try again.");
      setMessageClass("error");
      return;
    }

    // Prepare the password reset data
    const resetData = {
      email: email,
      newPassword: newPassword,
    };

    try {
      // Make the API call
      const response = await fetch("http://localhost:8080/api/passwordReset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("✅ Password reset successfully!");
        setMessageClass("success");
        setShowForgotPassword(false); // Hide the forgot password form after submission
        setEmail("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await response.json();
        setMessage(`❌ ${errorData.message || "Password reset failed. Please try again."}`);
        setMessageClass("error");
      }
    } catch (error) {
      setMessage("❌ An error occurred. Please try again.");
      setMessageClass("error");
      console.error("Password reset error:", error);
    }
  };

  return (
    <div className={`container ${isActive ? "active" : ""}`}>
      {/* Left Side Image */}
      <div className="form-box image">
        <img src={loginImg} alt="Login" style={{ marginLeft: "-110px", marginTop: "70px" }} />
      </div>

      {/* Login Form */}
      <div className="form-box login">
        {!showForgotPassword ? (
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className="bx bxs-lock-alt"></i>
            </div>

            {/* CAPTCHA with Refresh */}
            <div className="captcha-container">
              <div className="captcha">{captcha}</div>
              <FaSyncAlt className="refresh-icon" onClick={refreshCaptcha} />
            </div>
            <input
              type="text"
              id="captchaInput"
              placeholder="Enter CAPTCHA"
              value={inputCaptcha}
              onChange={(e) => setInputCaptcha(e.target.value)}
              required
            />

            {/* Message after Login Attempt */}
            <p id="message" className={messageClass}>{message}</p>

            {/* Login Button */}
            <button type="submit" className="btn">Login</button>

            <div className="forget-link">
              <a href="#" onClick={handleForgotPassword}>Forgot password?</a>
            </div>
          </form>
        ) : (
          // Forgot Password Form
          <form onSubmit={handleForgotPasswordSubmit}>
            <h1>Forgot Password</h1>
            <div className="input-box">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="bx bxs-envelope"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i className="bx bxs-lock-alt"></i>
            </div>

            {/* Message after Forgot Password Attempt */}
            <p id="message" className={messageClass}>{message}</p>

            {/* Submit Button */}
            <button type="submit" className="btn">Reset Password</button>

            {/* Back to Login Link */}
            <div className="forget-link">
              <a href="#" onClick={() => setShowForgotPassword(false)}>Back to Login</a>
            </div>
          </form>
        )}
      </div>

      {/* Toggle Panels */}
      <div className="toggle-box">
        <div className="toggle-pannel toggle-left">
          {/* Logo on the "Login Here" page */}
          <img src={logo} alt="Logo" className="logo" />
          <h1>Hello, Welcome!</h1>
          <p>Clothes for best movements</p>
          <button className="btn login-btn" onClick={handleToggle}>Login here!</button>
        </div>
        <div className="toggle-pannel toggle-right">
          {/* Logo on the "Red Pluto" page */}
          <img src={logo} alt="Logo" className="logo" />
          <h1>Red Pluto!</h1>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;