import DashboardLayout from "../../../components/layouts/dashboard";
import React, { useState, useEffect } from "react";
import { Steps, Button, message, Row } from "antd";
import style from "./addCourse.module.css";
// import "./addCourse.css";
import CourseDetailForm from "../../../components/course/courseDetailForm";
import CourseScheduleForm from "../../../components/course/courseScheduleForm";
const { Step } = Steps;

function AddCourse() {
  const [current, setCurrent] = useState(0);
  const [availableNavigate, setAvailableNavigate] = useState([0]);

  const next = () => {
    setCurrent(current + 1);
    setAvailableNavigate([...availableNavigate, current + 1]);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const stepContent = [
    { content: <CourseDetailForm nextStep={next} /> },
    {
      content: <CourseScheduleForm />,
    },
    {
      content: "Done",
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <Steps
        type="navigation"
        current={current}
        onChange={(current) => {
          if (availableNavigate.includes(current)) {
            setCurrent(current);
          }
        }}
        className={style.navigation}
      >
        <Step title="Course Detail" />
        <Step title="Course Schedule" />
        <Step title="Success" />
      </Steps>

      <div className={style.stepsContent}>{stepContent[current].content}</div>

      <div className={style.stepsAction}>
        {current === 2 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )}
        {current > 0 && (
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
      </div>
    </div>
  );
}

AddCourse.Layout = DashboardLayout;

export default AddCourse;
