import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useState } from "react";
import API from "../services/api";

function AppointmentCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const res = await API.get("/appointments");

      const calendarEvents = res.data.map((appointment) => ({
        title: `${appointment.patientName} - Dr. ${appointment.doctor}`,
        date: appointment.appointmentDate,
      }));

      setEvents(calendarEvents);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Appointment Calendar</h2>

      <FullCalendar
        plugins={[
          dayGridPlugin,
          interactionPlugin,
          timeGridPlugin,
        ]}
        initialView="dayGridMonth"
        editable={false}
        selectable={true}
        events={events}
        height="700px"
      />
    </div>
  );
}

export default AppointmentCalendar;