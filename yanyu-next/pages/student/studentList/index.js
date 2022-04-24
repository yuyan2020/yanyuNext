import DashboardLayout from "../../../components/layouts/dashboard";
import { useEffect } from "react";
import axios from "axios";
import { Table } from "antd";
import { useState } from "react";

const columns = [
  {
    title: "No.",
    dataIndex: "number",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
    render: (name) => `${name.first} ${name.last}`,
    width: "20%",
  },
  {
    title: "Area",
    dataIndex: "area",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Selected Curriculum",
    dataIndex: "sc",
  },
  {
    title: "Student Type",
    dataIndex: "type",
  },
  {
    title: "Join Time",
    dataIndex: "time",
  },
  {
    title: "Action",
    dataIndex: "",
    key: "x",
    render: () => <a>Delete</a>,
  },
];

function StudentList() {
  const sumCourses = (courses) => {
    const sum = "";
    courses.forEach((element) => {
      sum += element.name + ", ";
    });
    return sum;
  };

  const [student, setStudent] = useState();
  const [pagination, setPagination] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://cms.chtoma.com/api/students?page=1&limit=20", {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`,
        },
      })
      .then((res) => {
        const students = res.data.data.students;
        console.log(students);
        console.log(res.data.data);
        const studentData = [];
        console.log(students.courses);
        // const sumcourse = sumCourses(students.courses);
        for (let i = 0; i < students.length; i++) {
          studentData.push({
            number: i,
            name: students[i].name,
            area: students[i].country,
            email: students[i].email,
            sc: sumCourses(students[i].courses),
            type: students[i].type.name,
            time: students[i].createdAt,
          });
        }
        setStudent(studentData);

        setPagination({
          ...res.data.data.paginator,
          total: res.data.data.total,
        });
      });
    setLoading(false);
  }, []);
  return (
    <Table
      columns={columns}
      // rowKey={(record) => record.login.uuid}
      dataSource={student}
      pagination={pagination}
      loading={loading}
      // onChange={this.handleTableChange}
    />
  );
}

StudentList.Layout = DashboardLayout;

export default StudentList;
