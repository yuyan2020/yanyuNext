import DashboardLayout from "../../components/layouts/dashboard";
import { Select, Spin, Row, Col, Tabs } from "antd";
import debounce from "lodash/debounce";
import React, { useMemo, useRef, useState } from "react";
import { getCourseDetail, getCourses } from "../../lib/api/apiService";
import CourseDetailForm from "../../components/course/courseDetailForm";
import CourseScheduleForm from "../../components/course/courseScheduleForm";
const { TabPane } = Tabs;

function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);

      value &&
        fetchOptions(value).then((newOptions) => {
          setOptions(newOptions);
          setFetching(false);
        });
    };
    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      showSearch
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}

const EditCourse = () => {
  const [queryType, setQueryType] = useState("uid");
  const [course, setCourse] = useState();

  async function fetchCourseList(value) {
    return getCourses({ [queryType]: value }).then((res) =>
      res.data.data.courses.map((course) => ({
        label: course.name + " " + course.teacherName + " " + course.uid,
        value: course.id,
      }))
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <Row style={{ width: "100%", marginBottom: "10px" }}>
        <Col span={2}>
          <Select
            defaultValue="Code"
            style={{ width: 120 }}
            onChange={(value) => setQueryType(value)}
          >
            <Option value="uid">Code</Option>
            <Option value="name">Name</Option>
            <Option value="type">Category</Option>
          </Select>
        </Col>
        <Col span={14}>
          <DebounceSelect
            placeholder="Select Course"
            fetchOptions={fetchCourseList}
            style={{
              width: "100%",
            }}
            onChange={(newValue) => {
              getCourseDetail({ id: newValue }).then((res) => {
                const course = res.data.data;
                console.log(course);
                setCourse(course);
              });
            }}
          />
        </Col>
      </Row>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Course Detail" key="1">
          <Row style={{ width: "100%" }}>
            <CourseDetailForm mode={false} course={course} />
          </Row>
        </TabPane>
        <TabPane tab="Course Schedule" key="2">
          <Row style={{ width: "100%" }}>
            <CourseScheduleForm
              chapters={course.schedule.chapters}
              classTime={course.schedule.classTime}
              id={course.id}
              sId={course.schedule.id}
            />
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

EditCourse.Layout = DashboardLayout;

export default EditCourse;
