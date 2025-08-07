import React from "react";
import JobCollection from "../componets/JobCollection";

import { Link } from "react-router-dom";

const Jobs = () => {
  return (
    <form>
      <h2 style={{ textAlign: "center" }}>Jobs</h2>
      <div class="d-flex flex-column align-items-center">
        {/* <input
          className="form-control"
          type="search"
          placeholder="Job name"
          aria-label="Search"
        />

        <div className="col-auto">
        <button type="button" class="btn btn-dark">Search
        </button>
        </div> */}
        <JobCollection action="delete" />
        <div class="mt-3">
          <Link to="/addJob">
            <button type="button" class="btn btn-dark mt-3">
              Add New Job
            </button>
          </Link>
        </div>
      </div>
    </form>
  );
};

export default Jobs;
