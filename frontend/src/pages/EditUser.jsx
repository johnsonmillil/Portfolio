import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://127.0.0.1:3000';


const EditUser = (props) => {
  console.log("PROPS", props);
  const { userId } = useParams();

  const [dUsername, setDUserName] = useState("");
  const [dHourlyPay, setDHourlyPay] = useState("");
  const [dRole, setDRole] = useState("");

  const navigate = useNavigate();

  console.log("EDIT USER PROPS =>", userId);
  const [username, setUserName] = useState("");
  const [hourly_pay, setHourlyPay] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    axios
      .get(`${API_BASE_URL}/users/getUser/${userId}`, config)
      .then((data) => {
        console.log(data.data.user[0]);
        const userInfo = data.data.user[0];
        setDUserName(userInfo.username);
        setDHourlyPay(userInfo.hourly_pay);
        console.log("ROLE ===>", userInfo.role);
        setDRole(userInfo.role);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleUsername = (e) => {
    setDUserName(e.target.value);
  };

  const handleHourlyPay = (e) => {
    setDHourlyPay(e.target.value);
  };

  const handleAdmin = (e) => {
    setDRole(e.target.value);
  };
  const handleUser = (e) => {
    setDRole(e.target.value);
  };
  const editUserRequest = (e) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    const data = {
      username: dUsername,
      hourly_pay: dHourlyPay,
      role: dRole,
    };
    console.log(data);
    axios
      .put(`${API_BASE_URL}/users/editUser/${userId}`, data, config)
      .then((res) => {
        navigate("/admin/Users");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <h3 style={{ textAlign: "center" }}>Edit User</h3>
      <div class="form-outline mb-4">
        <label for="inputEmail3" class="col-sm-2 col-form-label">
          username
        </label>
        <input
          class="form-control"
          value={dUsername}
          onChange={handleUsername}
        />
      </div>

      <div class="form-outline mb-4">
        <label for="inputEmail3" class="col-sm-2 col-form-label">
          hourly wage
        </label>
        <input
          class="form-control"
          value={dHourlyPay}
          onChange={handleHourlyPay}
        />
      </div>

      <div class="row mb-4">
        <div class="col d-flex justify-content-center">
          <div class="form-check form-check-inline">
            <label class="form-label">
              <input
                class="form-check-input"
                type="radio"
                value="admin"
                name="userType"
                checked={dRole === "admin"} // Check if 'admin' is selected
                onChange={handleAdmin}
              />
              admin
            </label>
          </div>

          <div class="form-check form-check-inline">
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="radio"
                value="user"
                name="userType"
                checked={dRole === "user"}
                onChange={handleUser}
              />
              user
            </label>
          </div>
        </div>
      </div>
      <div class="text-center">
        <button class="btn btn-dark btn-block mb-4" onClick={editUserRequest}>
          Edit User
        </button>
      </div>
    </>
  );
};

export default EditUser;
