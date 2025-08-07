import axios from "axios";
import { Link, useParams } from "react-router-dom";

import EditJob from "../pages/EditJob";
import DeleteJobButton from "./DeleteJobButton";
import AddToJob from "./AddToJob";

import EditIcon from "../icons/edit.svg";

const JobProfile = (props) => {
  console.log("PROPS FOR USER ADD JOB currentUserId=>", props.currentUserId);

  return (
    <div>
      <tr className="hoverable-row">
        <td>{props.jobName}</td>
        <td>{props.jobDescription}</td>
        <td>{props.active == 1 ? "ACTIVE" : "INACTIVE"}</td>
        {props.action === "delete" && (
          <td>
            <Link to={`/admin/editJob/${props.jobId}`}>
              <button type="button" class="btn">
                <img src={EditIcon} alt="Edit Job" />
              </button>
            </Link>
          </td>
        )}
        <td>
          {props.action === "delete" && (
            <DeleteJobButton
              jobId={props.jobId}
              isJobDeleted={props.isJobDeleted}
            />
          )}
          {props.action === "add" && (
            <AddToJob jobId={props.jobId} userId={props.currentUserId} />
          )}
        </td>
      </tr>
    </div>
  );
};

export default JobProfile;
