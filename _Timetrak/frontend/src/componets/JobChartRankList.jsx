import { useState, useEffect } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://127.0.0.1:3000';


const JobCHartRankList = (props) => {
  const [hourList, setHourList] = useState([]);
  const [costList, setCostList] = useState([]);

  useEffect(() => {
    console.log("LOOK =>>", props.totalActiveHours, props.totalActiveCost);
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .get(
        `${API_BASE_URL}/reports/UserJobsReport/${props.selectedJob}`,
        config
      )
      .then((response) => {
        // Handle the successful response here
        console.log("Data:", response.data);
        setCostList(response.data.jobSortCost);
        setHourList(response.data.jobSortHours);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  }, [props.selectedJob]);
  return (
    <div className="row">
      <div className="col">
        <h6 style={{ textAlign: "center" }}>ranked by hours</h6>
        <ul className="list-group">
          {hourList.map((user, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                <div>{`${index + 1})`}</div>
                <div>{`Username: ${user.user_username}`}</div>
                <div>{`Total Hours: ${Number(user.total_hours).toFixed(
                  2
                )}`}</div>
                <div>{`Total Wages: $${Number(user.total_cost).toFixed(
                  2
                )}`}</div>
              </span>
              <span className="badge badge-primary badge-pill">
                {user.total_hours}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="col">
        <h6 style={{ textAlign: "center" }}>ranked by wages</h6>
        <ul className="list-group">
          {costList.map((user, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                <div>{`${index + 1})`}</div>
                <div>{`Username: ${user.user_name}`}</div>
                <div>{`Total Hours: ${Number(user.total_hours).toFixed(
                  2
                )}`}</div>
                <div>{`Total Wages: $${Number(user.total_cost).toFixed(
                  2
                )}`}</div>
              </span>
              <span className="badge badge-primary badge-pill">
                {user.total_cost}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JobCHartRankList;
