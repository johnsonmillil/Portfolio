import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://127.0.0.1:3000';

import UsersProfile from "./UsersProfile";

const UserCollection = () => {
  const [usersArr, setUsersArr] = useState([]);
  const [deleted, setDeleted] = useState(0);

  const isUserDeleted = () => {
    setDeleted(deleted + 1);
  };

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    const fetchUsers = async () => {
      try {
        const usersData = await axios.get(
          `${API_BASE_URL}/users/allUsers`,
          config
        );
        console.log("Here =>>>", usersData.data);
        const usersProfileCreation = usersData.data.userList.map((user, i) => {
          return (
            <div>
              <UsersProfile
                key={i}
                username={user.username}
                hourly_pay={user.hourly_pay}
                role={user.role}
                userId={user.id}
                isUserDeleted={isUserDeleted}
              />
            </div>
          );
        });
        setUsersArr(usersProfileCreation);
      } catch (e) {
        console.log(e);
      }
    };
    fetchUsers();
  }, [deleted]);

  return (
    <div className="container text-center">
      <table className="table table-responsive table-hover">
        <thead className="table-light">
          <tr>
            <th>Username</th>
            <th>Hourly Pay</th>
            <th>Role</th>
            <th>Update</th>
            <th>Password Reset</th>
            <th>Assign Job</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <div>{usersArr}</div>
        </tbody>
      </table>
    </div>
  );
};

export default UserCollection;
