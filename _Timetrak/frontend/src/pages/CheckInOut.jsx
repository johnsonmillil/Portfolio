import { useState, useEffect } from "react";

import axios from "axios";

import JobCheckIn from "../componets/JobCheckIn";

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://127.0.0.1:3000';


const CheckInOut = () => {
  const [jobsArr, setJobsArr] = useState([]);
  const [jobInProgress, setJobInProgress] = useState(0);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    axios
      .get(`${API_BASE_URL}/jobs`, config)
      .then((response) => {
        console.log("response =>", response);
        setJobsArr(response.data.jobs);
      })
      .catch((e) => console.log("----", e));
  }, []);

  return (
    <>
      {console.log("Job Currently Working On => ", jobInProgress)}
      {jobsArr.length > 0 ? (
        jobsArr.map((job) => {
          return (
            <JobCheckIn
              key={job.project_id}
              projectID={job.project_id}
              workHourId={job.workHourId}
              name={job.name}
              description={job.description}
              changeJobProgressStatus={setJobInProgress}
              inProgress={jobInProgress}
            />
          );
        })
      ) : (
        <h1>No Active Jobs</h1>
      )}
    </>
  );
};

export default CheckInOut;
