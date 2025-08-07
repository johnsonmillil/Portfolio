import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://127.0.0.1:3000';


const AddUserJobButton = () => {
  const buttonStyling = {
    color: "red",
    textSize: "font-size: 1.5rem",
  };

  const handleAddJobRequest = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.delete(
        `${API_BASE_URL}/jobs/addJob/${props.jobId}`,
        config
      );
      if (response.status === 200 || response.status === 204) {
        console.log("job added");
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
      <button
        type="button"
        className="badge badge-danger"
        onClick={handleAddJobRequest}
      >
        <span className="badge badge-warning" style={buttonStyling}>
          X
        </span>
      </button>
    </>
  );
};

export default AddUserJobButton;
