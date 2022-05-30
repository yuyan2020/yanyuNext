import DashboardLayout from "../../../components/layouts/dashboard";
import React, { useState, useEffect } from "react";
import { Steps, Button, message, Row, Result } from "antd";
import style from "./addCourse.module.css";
// import "./addCourse.css";
import CourseDetailForm from "../../../components/course/courseDetailForm";
import CourseScheduleForm from "../../../components/course/courseScheduleForm";
import { useRouter } from "next/router";
const { Step } = Steps;

function AddCourse() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [id, setId] = useState();

  const [availableNavigate, setAvailableNavigate] = useState([0]);

  const [scheduleId, setScheduleId] = useState();

  const next = () => {
    setCurrent(current + 1);
    setAvailableNavigate([...availableNavigate, current + 1]);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const stepContent = [
    {
      content: (
        <CourseDetailForm
        // nextStep={next}
        // step={current}
        // data={course}
        // setData={setCourse}
        // uid={code}
        // setUid={setCode}
        // t={selectedType}
        // st={setSelectedType}
        />
      ),
    },
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

      <div className={current === 0 ? style.tableDisplay : style.notDisplay}>
        <CourseDetailForm
          nextStep={next}
          setSId={setScheduleId}
          setId={setId}
          mode={true}
        />
      </div>

      <div className={current === 1 ? style.tableDisplay : style.notDisplay}>
        <CourseScheduleForm sId={scheduleId} id={id} nextStep={next} />
      </div>

      <div className={current === 2 ? style.tableDisplay : style.notDisplay}>
        <div className={style.stepsContent}>
          <Result
            status="success"
            title="Successfully Added Course!"
            subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
            extra={[
              <Button
                type="primary"
                key="console"
                onClick={() => router.push(`/course/addCourse/${id}`)}
              >
                Go Course
              </Button>,
              <Button
                key="buy"
                onClick={() => router.reload(window.location.pathname)}
              >
                Create Again
              </Button>,
            ]}
          />
        </div>
      </div>

      {/* <div className={style.stepsAction}>
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
      </div> */}
    </div>
  );
}

AddCourse.Layout = DashboardLayout;

export default AddCourse;
