import { useState } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://127.0.0.1:3000';


const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const loginRequest = (e) => {
console.log(API_BASE_URL, "API")
    e.preventDefault();
    const data = { username, password };
    axios
      .post(`${API_BASE_URL}/login`, data)
      .then((data) => {
        console.log("+.....", data.data);
        localStorage.setItem("token", data.data.token);
        props.setIsLoggedIn(data.data.login);
        props.setIsAdmin(data.data.admin);
        props.setAdminId(data.data.user_id);
      })
      .catch((e) => {
        console.log("-----", e.response.data.error);
        if (e.response.data.error == "username not found") {
          setError("Incorrect Username");
        } else if (e.response.data.error == "incorect password") {
          setError("Incorrect Password");
        } else {
          console.log("error while logging in");
          return;
        }
      });
  };
  return (
    <form style={{ backgroundColor: "white" }}>
      <h1>Login</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label className="form-label">Username</label>
        <input className="form-control" onChange={handleUsername} />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          onChange={handlePassword}
        />
      </div>

      <button type="submit" className="btn btn-dark" onClick={loginRequest}>
        Submit
      </button>
    </form>
  );
};

export default Login;
