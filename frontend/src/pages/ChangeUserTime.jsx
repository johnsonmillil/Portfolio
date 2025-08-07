import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://127.0.0.1:3000';

const ChangeUserTime = () => {
  const { workday, userId, project_id, workEndDay } = useParams();

  // console.log("enddate ==>", workEndDay);
  const navigate = useNavigate();

  const [workHourRecord, setWorkHourRecord] = useState(0);

  const [newSYear, setNewSYear] = useState("");
  const [newSMonth, setNewSMonth] = useState("");
  const [newSDay, setNewSDay] = useState("");
  const [newSHour, setNewSHour] = useState("");
  const [newSMinute, setNewSMinute] = useState("");
  const [newSSecond, setNewSSecond] = useState("");

  const [newEYear, setNewEYear] = useState("");
  const [newEMonth, setNewEMonth] = useState("");
  const [newEDay, setNewEDay] = useState("");
  const [newEHour, setNewEHour] = useState("");
  const [newEMinute, setNewEMinute] = useState("");
  const [newESecond, setNewESecond] = useState("");

  const [sYear, setSYear] = useState("");
  const [sMonth, setSMonth] = useState("");
  const [sDay, setSDay] = useState("");
  const [sHour, setSHour] = useState("");
  const [sMinute, setSMinute] = useState("");
  const [sSecond, setSSecond] = useState("");

  const [eYear, setEYear] = useState("");
  const [eMonth, setEMonth] = useState("");
  const [eDay, setEDay] = useState("");
  const [eHour, setEHour] = useState("");
  const [eMinute, setEMinute] = useState("");
  const [eSecond, setESecond] = useState("");

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    axios
      .put(
        `${API_BASE_URL}/users/editTime/${userId}/${workday}/${project_id}`,
        config
      )
      .then((res) => {
        console.log("-", res.data.workHourId);
        setWorkHourRecord(res.data.workHourId);
        const [year, month, day, hour, minute, seconds] =
          workday.split(/[- :]/);
        const [eyear, emonth, eday, ehour, eminute, eseconds] =
          workEndDay.split(/[- :]/);
        setSYear(year);
        setNewSYear(year);
        setSMonth(month);
        setNewSMonth(month);
        setSDay(day);
        setNewSDay(day);
        setSHour(hour);
        setNewSHour(hour);
        setSMinute(minute);
        setNewSMinute(minute);
        setSSecond(seconds);
        setNewSSecond(seconds);

        setEYear(eyear);
        setNewEYear(eyear);
        setEMonth(emonth);
        setNewEMonth(emonth);
        setEDay(eday);
        setNewEDay(eday);
        setEHour(ehour);
        setNewEHour(ehour);
        setEMinute(eminute);
        setNewEMinute(eminute);
        setESecond(eseconds);
        setNewESecond(eseconds);
      })

      .catch((e) => {
        console.log(e);
      });
  }, []);

  // new start date
  const handleSYear = (e) => {
    setNewSYear(e.target.value);
  };
  const handleSMonth = (e) => {
    setNewSMonth(e.target.value);
  };
  const handleSDay = (e) => {
    setNewSDay(e.target.value);
  };
  const handleSHour = (e) => {
    setNewSHour(e.target.value);
  };
  const handleSMinute = (e) => {
    setNewSMinute(e.target.value);
  };
  const handleSSecond = (e) => {
    setNewSSecond(e.target.value);
  };

  // new end date
  const handleEYear = (e) => {
    setNewEYear(e.target.value);
  };
  const handleEMonth = (e) => {
    setNewEMonth(e.target.value);
  };
  const handleEDay = (e) => {
    setNewEDay(e.target.value);
  };
  const handleEHour = (e) => {
    setNewEHour(e.target.value);
  };
  const handleEMinute = (e) => {
    setNewEMinute(e.target.value);
  };
  const handleESecond = (e) => {
    setNewESecond(e.target.value);
  };

  //api call to change time
  const changeTime = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    const start = `${newSYear}-${newSMonth}-${newSDay} ${newSHour}:${newSMinute}:${newSSecond}`;
    const finish = `${newEYear}-${newEMonth}-${newEDay} ${newEHour}:${newEMinute}:${newESecond}`;
    axios
      .put(
        `${API_BASE_URL}/users/insertNewTime/${workHourRecord}/${start}/${finish}`
      )
      .then((data) => {
        console.log(data);
        navigate("/reports");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <div style={{ textAlign: "center", width: "60%", marginLeft: "16%" }}>
        <h3>Change User Time</h3>
        <br />

        <form>
          <h5 style={{ textAlign: "center" }}>Start Time</h5>
          <div style={{ display: "-webkit-inline-box" }}>
            <div className="col-4">
              <h6>Y</h6>
              <input
                type="text"
                className="form-control"
                placeholder="Year"
                maxLength="4"
                defaultValue={sYear}
                onChange={handleSYear}
              />
            </div>
            <div className="col-2">
              <h6>M</h6>
              <input
                type="text"
                className="form-control"
                placeholder="Month"
                maxLength="2"
                defaultValue={sMonth}
                onChange={handleSMonth}
              />
            </div>
            <div className="col-2">
              <h6>DD</h6>
              <input
                type="text"
                className="form-control"
                placeholder="Day"
                maxLength="2"
                defaultValue={sDay}
                onChange={handleSDay}
              />
            </div>
            <div className="col-1">
              <h6>Hr</h6>
              <input
                type="text"
                className="form-control"
                placeholder="Hour"
                maxLength="2"
                defaultValue={sHour}
                onChange={handleSHour}
              />
            </div>
            <div className="col-1">
              <h6>Min</h6>
              <input
                type="text"
                className="form-control"
                placeholder="Minute"
                maxLength="2"
                defaultValue={sMinute}
                onChange={handleSMinute}
              />
            </div>
            <div className="col-2">
              <h6>Sec</h6>
              <input
                type="text"
                className="form-control"
                placeholder="Second"
                maxLength="2"
                defaultValue={sSecond}
                onChange={handleSSecond}
              />
            </div>
          </div>
        </form>

        <form>
          <h5 style={{ textAlign: "center" }}>End Time</h5>
          <div className="form-row" style={{ display: "-webkit-inline-box" }}>
            <div className="col-4">
              <input
                type="text"
                className="form-control"
                placeholder="Year"
                maxLength="4"
                defaultValue={eYear}
                onChange={handleEYear}
              />
            </div>
            <div className="col-2">
              <input
                type="text"
                className="form-control"
                placeholder="Month"
                maxLength="2"
                defaultValue={eMonth}
                onChange={handleEMonth}
              />
            </div>
            <div className="col-2">
              <input
                type="text"
                className="form-control"
                placeholder="Day"
                maxLength="2"
                defaultValue={eDay}
                onChange={handleEDay}
              />
            </div>
            <div className="col-1">
              <input
                type="text"
                className="form-control"
                placeholder="Hour"
                maxLength="2"
                defaultValue={eHour}
                onChange={handleEHour}
              />
            </div>
            <div className="col-1">
              <input
                type="text"
                className="form-control"
                placeholder="Minute"
                maxLength="2"
                defaultValue={eMinute}
                onChange={handleEMinute}
              />
            </div>
            <div className="col-2">
              <input
                type="text"
                className="form-control"
                placeholder="Second"
                maxLength="2"
                defaultValue={eSecond}
                onChange={handleESecond}
              />
            </div>
          </div>
        </form>
        <br />
        <button onClick={changeTime} className="btn btn-dark">
          Submit
        </button>
      </div>
    </>
  );
};

export default ChangeUserTime;
