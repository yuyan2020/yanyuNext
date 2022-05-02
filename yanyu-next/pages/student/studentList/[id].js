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

const StudnetDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  // {
  //   country:"",
  //   courses:[],
  //   createdAt:"",
  //   email:"",
  //   id:null,
  //   name:"",
  //   type:null,
  //   updatedAt:""
  // }

  //   {
  //   "data": {
  //     "createdAt": "1981-10-26 12:00:00",
  //     "updatedAt": "2021-08-13 09:13:49",
  //     "id": 1,
  //     "address": [
  //       "北京市",
  //       "市辖区",
  //       "东城区"
  //     ],
  //     "gender": 1,
  //     "birthday": "2020-11-02 08:00:00",
  //     "avatar": "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  //     "description": "Consectetur autem asperiores magni dignissimos quas aspernatur. Voluptatem velit molestiae quisquam fugiat dignissimos sunt. Non qui voluptatem rerum officiis modi accusamus sunt. Debitis similique eelaboriosam culpa itaque velit et enim. Error maiores volu 3333, test",
  //     "country": "Moldova",
  //     "courseAmount": 0,
  //     "email": "teacher@admin.com",
  //     "name": "aaa1",
  //     "phone": "13966456789",
  //     "profileId": 1,
  //     "skills": [
  //       {
  //         "id": 539,
  //         "level": 3,
  //         "name": "C"
  //       },
  //       {
  //         "id": 540,
  //         "level": 4,
  //         "name": "Java"
  //       }
  //     ],
  //     "workExperience": [
  //       {
  //         "startAt": "1999-07-28 08:00:00",
  //         "endAt": "2005-01-05 08:00:00",
  //         "id": 1,
  //         "company": "Hayes-Medhurst",
  //         "post": "repudiandaejk",
  //         "startEnd": "1999-07-28 08:00:00 2005-01-05 08:00:00"
  //       }
  //     ],
  //     "education": [
  //       {
  //         "startAt": "1999-01-01 08:00:00",
  //         "endAt": "2018-04-11 08:00:00",
  //         "id": 301,
  //         "level": 2,
  //         "degree": "BBA",
  //         "startEnd": "1999-01-01 08:00:00 2018-04-11 08:00:00"
  //       },
  //       {
  //         "startAt": "2010-01-02 08:00:00",
  //         "endAt": "2011-02-22 08:00:00",
  //         "id": 9001,
  //         "level": 4,
  //         "degree": "BBA",
  //         "startEnd": "2010-01-02 08:00:00 2011-02-22 08:00:00"
  //       }
  //     ]
  //   },
  //   "code": 200,
  //   "msg": "success"
  // }

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

  // const Tou = () => {
  //   <Avatar src={student.avatar} />;
  // };

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

// export async function getStaticProps(context) {
//   const id = context.params.id;
//   console.log(id);
//   const studentData = await getStudentById(id);
//   return {
//     props: {
//       student: studentData,
//     },
//   };
// }

// export async function getStaticPaths() {
//   return {
//     paths: [
//       {
//         params: { id: "1" },
//         params: { id: "115" },
//         params: { id: "119" },
//         params: { id: "120" },
//         params: { id: "121" },
//         params: { id: "122" },
//       },
//     ],
//     fallback: true,
//   };
// }

StudnetDetail.Layout = DashboardLayout;

export default StudnetDetail;
