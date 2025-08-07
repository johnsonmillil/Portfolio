import axios from "axios";
import { useState, useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://127.0.0.1:3000';


const UserDropDown = (props) => {
  console.log("current props!!!", props);
  const [usersList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [jobsList, setJobsList] = useState([]);

  useEffect(() => {
    console.log("JoB LIST", jobsList);
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    axios
      .get(`${API_BASE_URL}/users/allUsers`, config)
      .then((data) => {
        console.log(data.data.userList);
        setUserList(data.data.userList);
      })
      .catch((e) => {
        console.log(e);
      });

    // Fetch the list of jobs
    axios
      .get(`${API_BASE_URL}/jobs/allJobs`, config)
      .then((jobs) => {
        console.log("List of Jobs ==> ", jobs.data.jobs);
        setJobsList(jobs.data.jobs);
        // Handle job data as needed
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleUserChange = (e) => {
    props.setUser(e.target.value);
  };
  const handleJobChange = (e) => {
    props.setJob(e.target.value);
    console.log(e.target.value);
  };

  return (
    <div>
      {props.page === 0 && (
        <select className="form-select" onChange={handleUserChange}>
          <option value={props.adminId}>Change User</option>
          {usersList.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      )}
      {props.page === 1 && (
        <>
          <select className="form-select" onChange={handleJobChange}>
            <option value={0}>All Jobs</option>
            {jobsList.map((job) => (
              <option key={job.id} value={job.id}>
                {job.name}
              </option>
            ))}
          </select>
        </>
      )}
      <br />
    </div>
  );
};

export default UserDropDown;
