import DashboardLayout from "../../../components/layouts/dashboard";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCourseDetail } from "../../../lib/api/apiService";
import { Table, Divider, Tag } from "antd";

const columns = [
  {
    title: "Sunday",
    dataIndex: "Sunday",
    key: "Sunday",
  },
  {
    title: "Monday",
    dataIndex: "Monday",
    key: "Monday",
  },
  {
    title: "Tuesday",
    dataIndex: "Tuesday",
    key: "Tuesday",
  },
  {
    title: "Wednesday",
    dataIndex: "Wednesday",
    key: "Wednesday",
  },
  {
    title: "Thursday",
    dataIndex: "Thursday",
    key: "Thursday",
  },
  {
    title: "Friday",
    dataIndex: "Friday",
    key: "Friday",
  },
  {
    title: "Saturday",
    dataIndex: "Saturday",
    key: "Saturday",
  },
];

function courseDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [detail, setDetail] = useState();
  const [timeTable, setTimetable] = useState({
    Monday: "",
    Tuesday: "",
    wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
    Sunday: "",
  });

  const getTimetable = (schedule) => {
    const classTime = schedule.classTime;
    for (let index = 0; index < classTime.length; index++) {
      const element = classTime[index];
      const timeArray = element.split(" ");
      //   为什么不能直接用咧？？
      const weekday = timeArray[0];
      const time = timeArray[1];
      setTimetable((prev) => ({ ...prev, [weekday]: time }));
    }
  };
  useEffect(() => {
    getCourseDetail({ id: id }).then((res) => {
      console.log(res);
      setDetail(res.data.data);
      //   有个奇怪的问题就是这边保存了那边没更新！！？
      //   为什么不能直接detail.schedule
      const schedule = res.data.data.schedule;
      console.log(schedule);
      getTimetable(schedule);
      console.log(timeTable);
    });
  }, []);

  return detail && timeTable ? (
    <Table
      columns={columns}
      dataSource={[timeTable]}
      pagination={false}
      bordered
    />
  ) : null;
}

courseDetail.Layout = DashboardLayout;

export default courseDetail;
