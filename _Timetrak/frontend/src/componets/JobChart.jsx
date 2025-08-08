import React, { useEffect, useState } from "react";

import JobChartRank from "../componets/JobChartRankList";

const JobChart = (props) => {
  const [selectActive, setSelectActive] = useState(1);
  const [currentJobNums, setCurrentJobNums] = useState([]);
  const [totalActiveHours, setTotalActiveHours] = useState(0);
  const [totalActiveCost, setTotalActiveCost] = useState(0);

  useEffect(() => {
    const selectedJob = props.data.data.overallGroupByCost.find(
      (job) => job.id == props.currentJob
    );
    console.log("+++0", selectedJob);

    if (selectedJob != undefined) {
      const activeHours = props.data.data.overallGroupByCost.reduce(
        (sum, job) => sum + Number(job.total_hours),
        0
      );
      const activeCost = props.data.data.overallGroupByCost.reduce(
        (sum, job) => sum + Number(job.total_cost),
        0
      );
      setTotalActiveCost(activeCost);
      setTotalActiveHours(activeHours);
    }

    console.log("Selected valueeeee", typeof selectedJob); //object
    setCurrentJobNums(selectedJob ? [selectedJob] : []);
  }, [props.currentJob]);

  const handleFilterJob = (e) => {
    console.log(Number(e.target.value));
    setSelectActive(Number(e.target.value));
  };
  const handleFilterAll = (e) => {
    console.log(Number(e.target.value));
    setSelectActive(Number(e.target.value));
  };

  return (
    <div>
      {props.currentJob == 0 ? (
        <div>
          <div class="form-check form-check-inline">
            <label class="form-check-label">
              <input
                type="radio"
                class="form-check-input"
                name="options"
                id="option1"
                autoComplete="off"
                value={1}
                onChange={handleFilterJob}
                defaultChecked
              />{" "}
              Active
            </label>
          </div>
          <div class="form-check form-check-inline">
            <label class="form-check-label">
              <input
                type="radio"
                class="form-check-input"
                name="options"
                id="option2"
                value={0}
                autoComplete="off"
                onChange={handleFilterAll}
              />{" "}
              All
            </label>
          </div>
          <h4 style={{ justifyContent: "center" }}>All Jobs</h4>
          <h7>Ordered by hours</h7>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Job Name</th>
                <th scope="col">Total Hours</th>
                <th scope="col">Total Cost</th>
              </tr>
            </thead>

            <tbody>
              {props.data.data.overallGroupByHours
                .filter((row) => {
                  // If selectActive is 0, no filtering needed
                  // If selectActive is 1, include rows where row.job_active is 1
                  return (
                    selectActive == 0 ||
                    (selectActive == 1 && row.job_active == 1)
                  );
                })
                .map((row, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{row.job_name}</td>
                    <td>{row.total_hours}</td>
                    <td>${Number(row.total_cost).toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
            <br></br>
            <br></br>
            <h7>Ordered by cost</h7>
            {/* <h1>orderd by cost</h1> */}
            <tbody>
              {props.data.data.overallGroupByCost
                .filter((row) => {
                  // If selectActive is 0, no filtering needed
                  // If selectActive is 1, include rows where row.job_active is 1
                  return (
                    selectActive == 0 ||
                    (selectActive == 1 && row.job_active == 1)
                  );
                })
                .map((row, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{row.job_name}</td>
                    <td>{row.total_hours}</td>
                    <td>${Number(row.total_cost).toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <br></br>
          <div className="card">
            <div className="card-header">
              {currentJobNums.length > 0 && currentJobNums[0].job_name}
            </div>
            <div className="card-body">
              <h4 className="card-title">
                Statistics
              </h4>
              <p className="card-text">
                Total amount of hours:{" "}
                <b>
                  {currentJobNums.length > 0 && currentJobNums[0].total_hours}
                </b>
              </p>
              <p className="card-text">
                Total cost of wages:{" "}
                <b>
                  $
                  {currentJobNums.length > 0 &&
                    Number(currentJobNums[0].total_cost).toFixed(2)}
                </b>
              </p>
              <p className="card-text">
                Total % of currently active wages:{" "}
                <b>
                  {currentJobNums.length > 0 &&
                    (
                      (Number(currentJobNums[0].total_cost).toFixed(2) /
                        Number(totalActiveCost)) *
                      100
                    ).toFixed(2)}
                  %
                </b>
              </p>
              <p className="card-text">
                Total % of currently active project hours:{" "}
                <b>
                  {currentJobNums.length > 0 &&
                    (
                      (Number(currentJobNums[0].total_hours).toFixed(2) /
                        Number(totalActiveHours)) *
                      100
                    ).toFixed(2)}
                  %
                </b>
              </p>
              <br />
              <h4 className="card-title">
                Employees
              </h4>
              <br />
              <div>
                <JobChartRank
                  selectedJob={props.selectedJob}
                  // activeJobsStats={activeJobsStats}
                  totalActiveHours={totalActiveHours}
                  totalActiveCost={totalActiveCost}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobChart;
