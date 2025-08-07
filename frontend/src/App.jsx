import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import CheckInCheckOut from "./pages/CheckInOut";
import Reports from "./pages/Reports";
import Jobs from "./pages/Jobs";
import Users from "./pages/Users";
import Login from "./pages/Login";
import AddJob from "./pages/AddJob";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import ChangePassword from "./pages/ChangePassword";
import NavBar from "./componets/NavBar";
import EditJob from "./pages/EditJob";
import DeleteJobButton from "./componets/DeleteJobButton";
import AssignJob from "./pages/AssignJob";
import ChangeUserTime from "./pages/ChangeUserTime";
import Documentation from "./pages/Documentation";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminId, setAdminId] = useState(0);

  return (
    <div className="app-container">
      <div className="sidebar">
        {/* <div className="logo-container"></div> */}
        <NavBar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
      </div>
      <div className="main-content">
        {isLoggedIn ? (
          <Routes>
            <Route path="/" element={<CheckInCheckOut />} />
            <Route path="/addJob" element={<AddJob />} />
            <Route path="/addUser" element={<AddUser />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route
              path="/reports"
              element={<Reports isAdmin={isAdmin} adminId={adminId} />}
            />
            {isAdmin && <Route path="/admin/Jobs" element={<Jobs />} />}
            {isAdmin && <Route path="/admin/Users" element={<Users />} />}
            {isAdmin && (
              <Route path="/admin/editJob/:jobId" element={<EditJob />} />
            )}
            {isAdmin && (
              <Route path="/admin/assignJob/:userId" element={<AssignJob />} />
            )}
            {isAdmin && (
              <Route path="/users/editUser/:userId" element={<EditUser />} />
            )}
            {isAdmin && (
              <Route
                path="/users/changeTimes/:userId/:workday/:workEndDay/:project_id"
                element={<ChangeUserTime />}
              />
            )}
            {isAdmin && (
              <Route
                path="/users/editUserPass/:userId"
                element={<ChangePassword />}
              />
            )}
            {isAdmin && (
              <Route
                path="/admin/DeleteJob/:jobId"
                element={<DeleteJobButton />}
              />
            )}
          </Routes>
        ) : (
          <div>
            <nav className="navbar-light bg-light">
              <Login
                setIsLoggedIn={setIsLoggedIn}
                setIsAdmin={setIsAdmin}
                setAdminId={setAdminId}
              />
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
