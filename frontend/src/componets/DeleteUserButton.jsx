import React from "react";

import axios from "axios";

import DeleteIcon from "../icons/trash.svg";

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://127.0.0.1:3000';


const DeleteUserButton = (props) => {
  const buttonStyling = {
    color: "red",
    textSize: "font-size: 1.5rem",
  };

  const handleDeleteRequest = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.delete(
        `${API_BASE_URL}/users/deleteUser/${props.userId}`,
        config
      );
      console.log("ENTERED>>");
      if (response.status === 200 || response.status === 204) {
        console.log("Deletion Successful");
        return props.isUserDeleted();
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      if (error.response) {
        // Server responded with an error status (e.g., 4xx or 5xx)
        console.error("Request failed with status:", error.response.status);
        console.error("Error response data:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from the server:", error.request);
      } else {
        // Something else went wrong
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <>
      <button type="button" className="btn" onClick={handleDeleteRequest}>
        <img src={DeleteIcon} alt="Edit Job" />
      </button>
    </>
  );
};

export default DeleteUserButton;
