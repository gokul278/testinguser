import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  console.log("dfhbdf");

  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("JWTtoken");
  const refUtId = urlParams.get("refUtId");

  if (token && refUtId) {
    // Save token and refUtId to localStorage
    localStorage.setItem("JWTtoken", token);
    localStorage.setItem("refUtId", refUtId);

    console.log("sfhbsdhf");

    navigate("/");
  }

  return <div>Dashboard</div>;
};

export default Dashboard;
