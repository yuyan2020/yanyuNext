import DashboardLayout from "../../../components/layouts/dashboard";
import { Avatar, Image } from "antd";
import { useRouter } from "next/router";
import {
  getStudentById,
  getStudentProfileById,
} from "../../../lib/api/apiService";
import { useState, useEffect } from "react";
import { divide } from "lodash";
import { Tabs } from "antd";
const { TabPane } = Tabs;

const StudentDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const [student, setStudent] = useState();

  useEffect(() => {
    const getProfile = async () => {
      const res = await getStudentById(id);
      const profileId = await res.data.data.profileId;
      const profile = await getStudentProfileById({ userId: profileId });
      setStudent(profile.data.data);
      console.log(profile);
    };
    getProfile();
  }, [id]);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "70vh",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          backgroundColor: "",
          width: "41%",
          height: "60%",
          border: " solid grey",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            backgroundColor: "",
            width: "100%",
            height: "40%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* <Tou /> */}
          <Avatar size={80} src="https://joeschmoe.io/api/v1/random" />
        </div>
        <hr />
        <div style={{ backgroundColor: "", width: "100%", height: "60%" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "30%",
              justifyContent: "space-around",
            }}
          >
            <div>
              <div>
                <b>name</b>{" "}
              </div>
              {/* <div>bjy</div> */}
              <div>{student ? student.name : ""}</div>
            </div>
            <div>
              <div>
                <b>Age</b>
              </div>
              <div>{student ? student.birthday : ""}</div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "30%",
              justifyContent: "space-around",
            }}
          >
            <div>
              <div>
                <b>Email</b>
              </div>
              <div>{student ? student.email : ""}</div>
            </div>
            <div>
              <div>
                <b>Phone</b>
              </div>
              <div>{student ? student.phone : ""}</div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "30%",
              justifyContent: "center",
              alignItems: "start",
            }}
          >
            <div>
              <div>
                <b>Address</b>
              </div>
              <div>{student ? student.address : ""}</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: "", width: "53%", height: "90%" }}>
        <Tabs defaultActiveKey="2">
          <TabPane tab={<span>About</span>} key="about">
            <div>
              Education:&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              {student ? student.education[0].degree : ""}
            </div>
            <div>
              Area:&nbsp;&nbsp;&nbsp;&nbsp; {student ? student.country : ""}
            </div>
            <div>
              Gender:&nbsp;&nbsp;&nbsp;&nbsp; {student ? student.gender : ""}
            </div>
            <div>
              Member Period:&nbsp;&nbsp;&nbsp;&nbsp;
              {student ? student.education[0].degree : ""}
            </div>
            <div>
              Type: &nbsp;&nbsp;&nbsp;&nbsp;{student ? student.gender : ""}
            </div>
            <div>
              Create Time:&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              {student ? student.createdAt : ""}
            </div>
            <div>
              Update Time:&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              {student ? student.updatedAt : ""}
            </div>
          </TabPane>
          <TabPane tab={<span>Courses</span>} key="courses">
            Courses
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

StudentDetail.Layout = DashboardLayout;

export default StudentDetail;
