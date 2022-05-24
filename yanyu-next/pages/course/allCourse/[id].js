import DashboardLayout from "../../../components/layouts/dashboard";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCourseDetail } from "../../../lib/api/apiService";
import { Table, Row, Col, Card, Descriptions, Collapse, Tag } from "antd";
import CourseCard from "../../../components/course/courseCard";

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

const { Panel } = Collapse;

function courseDetail() {
  const router = useRouter();

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
    if (router.isReady) {
      const { id } = router.query;
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
    }
  }, [router.isReady]);

  return detail && timeTable ? (
    <Row style={{ width: "100%" }}>
      <Col span={8}>
        <CourseCard item={detail} style={{ width: "90%" }} readMore={false} />
      </Col>
      <Col span={16}>
        <Card title="Course Detail">
          <Descriptions title="Create Time">
            <Descriptions.Item>{detail.createdAt}</Descriptions.Item>
          </Descriptions>
          <Descriptions title="Start Time">
            <Descriptions.Item>{detail.createdAt}</Descriptions.Item>
          </Descriptions>
          <Descriptions title="Status">
            <Descriptions.Item>{detail.status}</Descriptions.Item>
          </Descriptions>
          <Descriptions title="Course Code">
            <Descriptions.Item>{detail.uid}</Descriptions.Item>
          </Descriptions>
          <Descriptions title="ClassTime">
            <Descriptions.Item>
              <Table
                columns={columns}
                dataSource={[timeTable]}
                pagination={false}
                bordered
              />
            </Descriptions.Item>
          </Descriptions>
          <Descriptions title="Category">
            <Descriptions.Item>
              {detail.type.map((i) => (
                <span key={i.name}>{i.name}</span>
              ))}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions title="Description">
            <Descriptions.Item>{detail.detail}</Descriptions.Item>
          </Descriptions>
          <Descriptions title="Chapter">
            <Descriptions.Item>
              <Collapse
                style={{ width: "100%" }}
                defaultActiveKey={[detail.schedule.chapters[0].id]}
              >
                {detail.schedule.chapters.map((i) => (
                  <Panel
                    header={i.name}
                    key={i.id}
                    extra={<Tag color="warning">Pending</Tag>}
                  >
                    <p>{i.content}</p>
                  </Panel>
                ))}
              </Collapse>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  ) : null;
}

courseDetail.Layout = DashboardLayout;

export default courseDetail;
