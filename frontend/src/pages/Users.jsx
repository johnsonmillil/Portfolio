import { Link } from "react-router-dom";
import UsersCollection from "../componets/UsersCollection.jsx";

const Users = () => {
  return (
    <form>
      <h2 style={{ textAlign: "center" }}>Users</h2>
      <div class="d-flex flex-column align-items-center">
        {/* <input
              className="form-control"
              type="search"
              placeholder="Username"
              aria-label="Search"
            />
            <div className="col-auto">
              <button type="button" class="btn btn-dark">
                Search
              </button>
            </div> */}
        <UsersCollection />
        <div className="mt-5">
          <Link to="/addUser">
            <button type="button" class="btn btn-dark">
              Add User
            </button>
          </Link>
        </div>
      </div>
    </form>
  );
};

export default Users;
