import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Tables from "./Tables";
import NoRecords from "../icons/36e3bf06671120139042d74c7f3bca73.png";

import {
  Chart as ChartJs,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
ChartJs.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = (props) => {
  console.log("&*&*&*", props.times.payRate[0].hourly_pay);
  const [activeTab, setActiveTab] = useState("Daily");
  const [cLabels, setCLabels] = useState([]);
  const [cData, setCData] = useState([]);

  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  const divStyle = {
    textAlign: "center",
  };

  const noRecordsStyle = {
    color: "red",
  };

  const fromatHours = (hours) => {
    const totalSeconds = Math.round(hours * 3600); // Convert hours to seconds
    const hoursValue = Math.floor(totalSeconds / 3600);
    const minutesValue = Math.floor((totalSeconds % 3600) / 60);
    const secondsValue = totalSeconds % 60;

    const formattedTime = `${hoursValue} hr ${minutesValue} min ${secondsValue} sec`;

    return formattedTime;
  };

  const monthlyNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (monthFilter == "" && yearFilter == "") {
      setMonthFilter(currentMonth);
      setYearFilter(currentYear);
    }

    let filteredDailyTime;

    let filteredTimes = props.times;

    if (activeTab === "Daily") {
      const existingData = {}; // Create an object to store existing data by date

      // Iterate through the existing data and update the total_seconds

      filteredTimes.dailyTimes.forEach((time) => {
        console.log(
          "----------",
          time.workday.split("T")[0],
          "----------",
          time.workday
        );
        if (time.workyear === yearFilter && time.workmonth === monthFilter) {
          const workdayDate = new Date(time.workday); // Convert the workday string to a Date object
          console.log(workdayDate);
          const formattedDate = workdayDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });

          if (existingData[formattedDate]) {
            existingData[formattedDate] += time.total_seconds / 3600;
          } else {
            existingData[formattedDate] = time.total_seconds / 3600;
          }
        }
      });

      // Convert the object back to arrays for CLabels and CData
      setCLabels(Object.keys(existingData));
      setCData(Object.values(existingData));
    } else if (activeTab === "Weekly") {
      const existingData = {};

      // Iterate through the existing data and update the total_seconds

      filteredTimes.weeklyTimes.forEach((time) => {
        if (time.workyear === yearFilter && time.workmonth === monthFilter) {
          if (time.workyear !== null) {
            const startDate = new Date(
              time.week_start_date.split("T")[0]
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
            const endDate = new Date(
              time.week_end_date.split("T")[0]
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
            const weekKey = `${startDate} - ${endDate}`;
            if (existingData[weekKey]) {
              existingData[weekKey].total_seconds += Number(time.total_seconds);
            } else {
              existingData[weekKey] = {
                start_date: startDate,
                end_date: endDate,
                total_seconds: Number(time.total_seconds),
              };
            }
          }
        }
      });

      const labels = Object.keys(existingData);

      const data = labels.map((key) => {
        return existingData[key].total_seconds / 3600;
      });

      setCLabels(labels);
      setCData(data);
    } else if (activeTab === "Monthly") {
      const monthNames = [
        "",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const existingData = {};

      filteredTimes.monthlyTimes.forEach((time) => {
        if (time.workyear === yearFilter) {
          const month = time.workmonth;

          if (month !== 0) {
            const monthName = monthNames[month];
            if (existingData[monthName]) {
              existingData[monthName] += time.total_seconds / 3600;
            } else {
              existingData[monthName] = time.total_seconds / 3600;
            }
          }
        }
      });

      setCLabels(Object.keys(existingData));
      setCData(Object.values(existingData));
    } else if (activeTab === "Yearly") {
      const existingData = {};

      filteredTimes.yearlyTimes.forEach((time) => {
        const year = time.workyear;

        if (!existingData[year]) {
          existingData[year] = 0;
        }

        existingData[year] += time.total_seconds / 3600;
      });
      setCLabels(Object.keys(existingData));
      setCData(Object.values(existingData));
    }
  }, [props, activeTab, yearFilter, monthFilter]);

  const handleYearChange = (event) => {
    setYearFilter(parseInt(event.target.value));
  };

  const handleMonthChange = (event) => {
    setMonthFilter(parseInt(event.target.value)); //
  };

  const data = {
    labels: cLabels,
    datasets: [
      {
        label: "Hours",
        data: cData,
        backgroundColor: "silver",
        borderColor: "black",
        borderWidth: 1,
        customData: ["Info 1", "Info 2"],
      },
    ],
  };

  const options = {};

  return (
    <div>
      <div className="nav nav-tabs">
        <div
          className={`nav-link ${activeTab === "Daily" ? "active" : ""}`}
          onClick={() => setActiveTab("Daily")}
        >
          <h5>Daily</h5>
        </div>
        <div
          className={`nav-link ${activeTab === "Weekly" ? "active" : ""}`}
          onClick={() => setActiveTab("Weekly")}
        >
          <h5>Weekly</h5>
        </div>

        <div
          className={`nav-link ${activeTab === "Monthly" ? "active" : ""}`}
          onClick={() => setActiveTab("Monthly")}
        >
          <h5>Monthly</h5>
        </div>

        <div
          className={`nav-link ${activeTab === "Yearly" ? "active" : ""}`}
          onClick={() => setActiveTab("Yearly")}
        >
          <h5>Yearly</h5>
        </div>
      </div>
      <div>
        {activeTab === "Monthly" && (
          <div>
            <h6>Year Filter:</h6>
            <select
              value={yearFilter}
              onChange={handleYearChange}
              className="form-select"
            >
              <option value="">Select Year</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
            </select>
          </div>
        )}
        {(activeTab === "Daily" || activeTab === "Weekly") && (
          <div>
            <h6>Month Filter:</h6>
            <select
              value={monthFilter}
              onChange={handleMonthChange}
              className="form-select"
            >
              <option value="">Select Month</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>

            <div>
              <h6>Year Filter:</h6>
              <select
                value={yearFilter}
                onChange={handleYearChange}
                className="form-select"
              >
                <option value="">Select Year</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
              </select>
            </div>
          </div>
        )}
        <div>
          {activeTab === "Weekly" || activeTab === "Daily" ? (
            <h2>{`${monthlyNames[monthFilter - 1]} ${yearFilter}`}</h2>
          ) : activeTab === "Monthly" ? (
            <h2>{`${yearFilter}`}</h2>
          ) : null}
        </div>

        <>
          {data.labels.length > 0 ? (
            <>
              {activeTab === "Daily" && (
                <div>
                  <Bar data={data} options={options} />

                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "8%",
                      marginBottom: "8%",
                    }}
                  >
                    <h3>
                      Total Hours:
                      {fromatHours(
                        data.datasets[0].data.reduce(
                          (acc, value) => acc + value,
                          0
                        )
                      )}
                    </h3>
                    <h3>
                      Total Income: $
                      {(
                        data.datasets[0].data.reduce(
                          (acc, value) => acc + value,
                          0
                        ) * props.times.payRate[0].hourly_pay
                      ).toFixed(2)}
                    </h3>
                  </div>
                </div>
              )}
              {activeTab === "Weekly" && (
                <div>
                  <Bar data={data} options={options} />

                  <div style={{ textAlign: "center" }}>
                    <h2>
                      Total Hours:
                      {fromatHours(
                        data.datasets[0].data.reduce(
                          (acc, value) => acc + value,
                          0
                        )
                      )}
                    </h2>
                    <h2>
                      Total Income: $
                      {(
                        data.datasets[0].data.reduce(
                          (acc, value) => acc + value,
                          0
                        ) * props.times.payRate[0].hourly_pay
                      ).toFixed(2)}
                    </h2>
                  </div>
                </div>
              )}
              {activeTab === "Monthly" && (
                <div style={{ textAlign: "center" }}>
                  <Bar data={data} options={options} />

                  <div>
                    <h2>
                      Total Hours:
                      {fromatHours(
                        data.datasets[0].data.reduce(
                          (acc, value) => acc + value,
                          0
                        )
                      )}
                    </h2>
                    <h2>
                      Total Income: $
                      {(
                        data.datasets[0].data.reduce(
                          (acc, value) => acc + value,
                          0
                        ) * props.times.payRate[0].hourly_pay
                      ).toFixed(2)}
                    </h2>
                  </div>
                </div>
              )}
              {activeTab === "Yearly" && (
                <div>
                  <Bar data={data} options={options} />

                  <div style={{ textAlign: "center" }}>
                    <h3>
                      Total Hours:
                      {fromatHours(
                        data.datasets[0].data.reduce(
                          (acc, value) => acc + value,
                          0
                        )
                      )}
                    </h3>
                    <h3>
                      Total Income: $
                      {(
                        data.datasets[0].data.reduce(
                          (acc, value) => acc + value,
                          0
                        ) * props.times.payRate[0].hourly_pay
                      ).toFixed(2)}
                    </h3>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={divStyle}>
              <img src={NoRecords} alt="no records" />
              <h4 style={noRecordsStyle}>No records Found</h4>
              <h6 style={noRecordsStyle}>Change search filters</h6>
            </div>
          )}
        </>
      </div>
      <h5>hourly wage: ${props.times.payRate[0].hourly_pay}</h5>
      <div>
        <Tables
          data={props.times}
          activeTab={activeTab}
          yearFilter={yearFilter}
          monthFilter={monthFilter}
          monthName={monthlyNames[monthFilter - 1]}
          isAdmin={props.isAdmin}
          setUser={props.setUser}
        />
      </div>
    </div>
  );
};

export default BarChart;
