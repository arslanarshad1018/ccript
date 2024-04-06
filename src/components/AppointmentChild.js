import React from "react";
import { BsArrowRepeat } from "react-icons/bs";

// Constants for days and time slots
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const MIN_HOUR = 8;
const MAX_HOUR = 20;

// Calculates if the appointment is within the current time slot
const isWithinTimeSlot = (startTime, endTime, slot) => {
  const slotTime = convertTo24HrFormat(slot);
  const start = convertTo24HrFormat(startTime);
  const end = convertTo24HrFormat(endTime);
  return slotTime >= start && slotTime < end;
};

// Calculates the height of an appointment based on duration
const calculateHeight = (startTime, endTime) => {
  const start = new Date(`01/01/2000 ${convertTo24HrFormat(startTime)}`);
  const end = new Date(`01/01/2000 ${convertTo24HrFormat(endTime)}`);
  const diff = (end - start) / (1000 * 60 * 60); // difference in hours
  return diff * 60; // Assuming 60px height for a one-hour slot
};

// Converts 12hr formatted time to 24hr for comparison
const convertTo24HrFormat = (time) => {
  let [hours, modifier] = time.split(" ");
  let [hour, minute] = hours.split(":");
  if (hour === "12") {
    hour = "00";
  }
  if (modifier === "PM") {
    hour = parseInt(hour, 10) + 12;
  }
  return `${hour}:${minute}`;
};
// Utility function to create time slots
const createTimeSlots = (minHour, maxHour) => {
  let slots = [];
  for (let hour = minHour; hour <= maxHour; hour++) {
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = `${hour > 12 ? hour - 12 : hour} ${suffix}`;
    slots.push(formattedHour);
  }
  return slots;
};

// Appointment data

// AppointmentTable Component
const AppointmentChild = (props) => {
  const appointments = props.appointments;
  const refreshHandler = props.refreshHandler;

  // const { appointments } = props.appointments
  const timeSlots = createTimeSlots(MIN_HOUR, MAX_HOUR);
  // This function will find the maximum number of overlapping appointments in any slot
  const findMaxOverlappingAppointments = () => {
    let maxOverlaps = 0;
    DAYS.forEach((day) => {
      timeSlots.forEach((timeSlot) => {
        const overlappingAppointments = Object.values(appointments).filter(
          (appointment) => {
            return (
              appointment.weekDay === day &&
              isWithinTimeSlot(
                appointment.startTimeFormatted,
                appointment.endTimeFormatted,
                timeSlot
              )
            );
          }
        );
        maxOverlaps = Math.max(maxOverlaps, overlappingAppointments.length);
      });
    });
    return maxOverlaps;
  };
  // Calculate the maximum number of overlapping appointments to set the column width
  const maxOverlappingAppointments = findMaxOverlappingAppointments();
  const columnWidth =
    maxOverlappingAppointments > 1
      ? `calc(100% / ${maxOverlappingAppointments})`
      : "100%";

  return (

    <div className="container mt-5">
      <table className="table table-bordered rounded table-rounded">
        <thead>
          <tr>
            <th
              scope="col"
              onClick={refreshHandler}
              className="tableReloadHeader text-center align-middle"
            >
              <BsArrowRepeat size={25} color={"#0AA36E"} />
            </th>
            {DAYS.map((day) => (
              <th
                scope="col"
                className="tableHeader text-center align-middle"
                key={day}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((timeSlot) => (
            <tr key={timeSlot}>
              <td>{timeSlot}</td>
              {DAYS.map((day) => {
                let slotAppointments = [];
                Object.values(appointments).forEach((appointment) => {
                  if (
                    appointment.weekDay === day &&
                    isWithinTimeSlot(
                      appointment.startTimeFormatted,
                      appointment.endTimeFormatted,
                      timeSlot
                    )
                  ) {
                    slotAppointments.push(appointment);
                  }
                });
                return (
                  <td
                    key={day + timeSlot}
                    className="appointmentSlot"
                    style={{ minWidth: columnWidth }}
                  >
                    {slotAppointments.map((appointment, index) => (
                      <div
                        key={index}
                        className="appointmentBlock"
                        style={{
                          height: `${calculateHeight(
                            appointment.startTimeFormatted,
                            appointment.endTimeFormatted
                          )}px`,
                        }}
                      >
                        <div className="appointmentName">
                          {appointment.name}
                        </div>
                        <div className="appointmentReason" style={{ marginLeft: "40px", marginTop: "10px" }}>
                          Reason
                        </div>
                        <div className="appointmentReason">
                          {appointment.reason}
                        </div>
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentChild;
