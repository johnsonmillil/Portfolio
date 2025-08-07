import React from "react";

import { useParams } from "react-router-dom";

import JobCollection from "../componets/JobCollection";

const AssignJob = (props) => {
  const { userId } = useParams();
  console.log("ASSIGN JOBS PARAMS====>>>", userId);
  return (
    <div className="container">
      <h3 style={{ textAlign: "center" }}>Assign Job</h3>
      <form className="d-flex"></form>
      <JobCollection action="add" currentUserId={userId} />
    </div>
  );
};

export default AssignJob;
