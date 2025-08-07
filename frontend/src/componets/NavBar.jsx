import React, { useState } from "react";
import { Link } from "react-router-dom";
import questionIcon from "../icons/question.png";

const NavBar = (props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navbarClasses = props.isLoggedIn ? "navbar" : "navbar expanded-navbar";

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const Logout = () => {
    window.location.reload();
  };

  return (
    <div className="d-lg-flex">
      {/* Sidebar */}
      <nav
        id="sidebarMenu"
        className={`collapse d-lg-block sidebar collapse bg-lightblue ${
          sidebarOpen ? "show" : ""
        }`}
      >
        <div className="position-sticky">
          <ul className="list-group list-group-flush mx-3 mt-4">
            {/* Nav Logo
            <li className="list-group-item">
              <img
                className="logo"
                src="http://www.techprousa.com/wp-content/uploads/2015/08/logo.png"
                alt="TechPro Constructions"
              ></img>
            </li> */}
            {props.isLoggedIn && (
              <>
                <li className="list-group-item bg-lightblue">
                  <Link to="/" className="nav-link">
                    Check-In/Out
                  </Link>
                </li>
                <li className="list-group-item bg-lightblue">
                  <Link to="/reports" className="nav-link">
                    Reports
                  </Link>
                </li>
              </>
            )}
            {props.isAdmin && (
              <li className="list-group-item bg-lightblue">
                <Link to="/admin/jobs" className="nav-link">
                  Jobs
                </Link>
              </li>
            )}
            {props.isAdmin && (
              <li className="list-group-item bg-lightblue">
                <Link to="/admin/users" className="nav-link">
                  Users
                </Link>
              </li>
            )}
          </ul>
          {props.isLoggedIn && (
            <button onClick={Logout} className="btn btn-danger mx-3 my-3">
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg bg-shortlightblue fixed-top"
        style={{ right: "auto" }}
      >
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleToggleSidebar}
        >
          <i className="fa fa-bars"></i>
        </button>
        <li className="list-group-item">
          <img
            className="logo"
            src="http://www.techprousa.com/wp-content/uploads/2015/08/logo.png"
            alt="TechPro Constructions"
          ></img>
        </li>
        <Link className="navbar-brand" to="#">
          <img />
        </Link>

        <ul className="navbar-nav ms-auto d-flex flex-row">
          {props.isLoggedIn && (
            <li className="nav-item">
              <Link to="/documentation" className="nav-link">
                <img
                  src={questionIcon}
                  alt="Help"
                  style={{ width: "24px", height: "24px" }}
                />
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
