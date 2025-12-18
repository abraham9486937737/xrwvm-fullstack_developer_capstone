import React, { useState } from "react";
import "./Register.css";
import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import close_icon from "../assets/close.png";

const Register = () => {
  // State variables for form inputs
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");

  // Redirect to home
  const gohome = () => {
    window.location.href = window.location.origin;
  };

  // Handle form submission
  const register = async (e) => {
    e.preventDefault();

    let register_url = window.location.origin + "/djangoapp/register";

    // Send POST request to register endpoint
    const res = await fetch(register_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
      }),
    });

    const json = await res.json();

    if (json.status) {
      // Save username in session and reload home
      sessionStorage.setItem("username", json.userName);
      window.location.href = window.location.origin;
    } else if (json.error === "Already Registered") {
      alert("The user with same username is already registered");
      window.location.href = window.location.origin;
    }
  };

  return (
    <div
      className="register_container"
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #e0f7fa, #80deea)",
        padding: "20px",
      }}
    >
      <div
        className="form_card"
        style={{
          width: "480px",
          padding: "30px",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <div
          className="header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>Sign Up</h2>

          <a href="/" onClick={gohome}>
            <img
              src={close_icon}
              alt="Close"
              style={{ width: "26px", cursor: "pointer" }}
            />
          </a>
        </div>

        <hr style={{ marginTop: "15px" }} />

        <form onSubmit={register}>
          <div className="inputs" style={{ marginTop: "20px" }}>
            <div className="input" style={{ marginBottom: "15px" }}>
              <img src={user_icon} className="img_icon" alt="Username" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="input_field"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="input" style={{ marginBottom: "15px" }}>
              <img src={user_icon} className="img_icon" alt="First Name" />
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                className="input_field"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="input" style={{ marginBottom: "15px" }}>
              <img src={user_icon} className="img_icon" alt="Last Name" />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                className="input_field"
                onChange={(e) => setlastName(e.target.value)}
              />
            </div>

            <div className="input" style={{ marginBottom: "15px" }}>
              <img src={email_icon} className="img_icon" alt="Email" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input_field"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input" style={{ marginBottom: "15px" }}>
              <img src={password_icon} className="img_icon" alt="Password" />
              <input
                name="psw"
                type="password"
                placeholder="Password"
                className="input_field"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="submit_panel" style={{ marginTop: "25px" }}>
            <input
              className="submit"
              type="submit"
              value="Register"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#00acc1",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "18px",
                cursor: "pointer",
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
