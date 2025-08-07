import { Link } from "react-router-dom";
import EditIcon from "../icons/edit.svg";
// import TrashIcon from "../icons/trash.svg";
import PlusIcon from "../icons/plus-square.svg";
import ChangePass from "../icons/arrow-repeat.svg";
import ReportIcon from "../icons/newspaper.svg";
import DeleteUserButton from "./DeleteUserButton";

const UsersProfile = (props) => {
  console.log("PROPS userId=>>> ", props.userId);
  return (
    <div>
      <tr className="hoverable-row">
        <td>{props.username}</td>
        <td>${props.hourly_pay}</td>
        <td>{props.role}</td>
        <td>
          <Link to={`/users/editUser/${props.userId}`}>
            <button type="button" class="btn">
              <img src={EditIcon} alt="Edit User" />
            </button>
          </Link>
        </td>
        <td>
          <Link to={`/users/editUserPass/${props.userId}`}>
            <button type="button" class="btn">
              <img src={ChangePass} alt="Edit User" />
            </button>
          </Link>
        </td>
        <td>
          <Link to={`/admin/assignJob/${props.userId}`}>
            <button type="button" class="btn">
              <img src={PlusIcon} alt="+" />
            </button>
          </Link>
        </td>

        <td>
          <DeleteUserButton
            userId={props.userId}
            isUserDeleted={props.isUserDeleted}
          />
        </td>
      </tr>
    </div>
  );
};

export default UsersProfile;
