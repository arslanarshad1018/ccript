import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./NavBar";
import AppointmentChild from "./AppointmentChild";

const Appointments = () => {
  const [appointments, setAppointments] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://hiring-test-task.vercel.app/api/appointments`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAppointments(response.data);
      console.log(response.data)
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshHandler = async () => {
    try {
      const response = await axios.post(
        `https://hiring-test-task.vercel.app/api/refresh-token`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      localStorage.setItem("token", response.data.newToken);
      console.log("Token updated");
      fetchData();
      console.log(appointments)
    } catch (err) {
      console.error("Failed to refresh token:", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <Navbar />
      {appointments && (
        <AppointmentChild
          refreshHandler={refreshHandler}
          appointments={appointments}
        />
      )}
    </div>
  );
};

export default Appointments;
