import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  message,
  Upload,
  Spin,
} from "antd";
import moment from "moment";
import debounce from "lodash/debounce";
import { InboxOutlined } from "@ant-design/icons";
const { Option } = Select;
const { Dragger } = Upload;
import { useState, useEffect, useRef, useMemo } from "react";
import {
  addCourse,
  getCourseCode,
  getCourseType,
  getTeacherById,
  getTeachers,
} from "../../lib/api/apiService";
const durationUnit = (
  <Select defaultValue="month" className="select-after">
    <Option value="4">year</Option>
    <Option value="3">month</Option>
    <Option value="1">day</Option>
    <Option value="2">week</Option>
    <Option value="0">hour</Option>
  </Select>
);

const DebounceSelect = ({ fetchOptions, debounceTimeout = 800, ...props }) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      // fetchRef.current += 1;
      // const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      value &&
        fetchOptions(value).then((newOptions) => {
          // if (fetchId !== fetchRef.current) {
          //   // for fetch callback order
          //   return;
          // }

          console.log(newOptions);
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
};

async function fetchTeacherList(username) {
  // console.log("fetching user", username);
  return getTeachers({ query: username }).then((res) =>
    res.data.data.teachers.map((user) => ({
      label: user.name,
      value: user.id,
    }))
  );
}

const courseDetailForm = (props) => {
  const [code, setCode] = useState();

  const [form] = Form.useForm();
  const [Type, setType] = useState([]);

  const normFile = (e) => {
    console.log("Upload event:", e);

    if (Array.isArray(e)) {
      return e;
    }

    return e?.fileList;
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    const selectedType = values.type.map((t) => parseInt(t));

    addCourse({
      name: values.courseName,
      uid: values.courseCode,
      detail: values.description,
      startTime: values.startDate.format("YYYY-MM-DD"),
      price: parseInt(values.price),
      maxStudents: parseInt(values.studentLimit),
      duration: parseInt(values.duration),
      durationUnit: 1,
      teacherId: values.teacher,
      type: selectedType,
    }).then((res) => {
      props.setSId(res.data.data.scheduleId);
      props.setId(res.data.data.id);
    });
    props.nextStep();
  };

  useEffect(() => {
    if (!props.uid && props.mode) {
      getCourseCode().then((res) => {
        setCode(res.data.data);
        form.setFieldsValue({ courseCode: res.data.data });
      });
    }
  }, []);

  useEffect(() => {
    getCourseType().then((res) => setType(res.data.data));
  }, []);

  useEffect(() => {
    if (props.course) {
      form.setFieldsValue({
        courseName: props.course.name,
        courseCode: props.course.uid,
        description: props.course.detail,
        startDate: moment(props.course.createdAt),
        price: props.course.price,
        studentLimit: props.course.maxStudent,
        duration: props.course.duration,
        durationUnit: props.course.durationUnit,
        teacher: props.course.teacherName,
        type: props.course.type.map((t) => t.name),
      });
    }
  }, [props.course]);

  return (
    <div style={{ width: "100%" }}>
      <Form
        form={form}
        name="courseDetail"
        onFinish={onFinish}
        scrollToFirstError
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="Course Name"
              name="courseName"
              rules={[
                { required: true, message: "Please input your course name!" },
              ]}
            >
              <Input placeholder="course name" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Teacher"
              name="teacher"
              rules={[
                { required: true, message: "Please select your teacher!" },
              ]}
            >
              <DebounceSelect
                placeholder="Select Teacher"
                fetchOptions={fetchTeacherList}
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Type"
              name="type"
              rules={[
                { required: true, message: "Please input your course type!" },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{
                  width: "100%",
                }}
                placeholder="Please select type"
              >
                {Type
                  ? Type.map((t) => <Option key={t.id}>{t.name}</Option>)
                  : null}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Course Code"
              name="courseCode"
              rules={[{ required: true }]}
            >
              <Input placeholder="" disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Start Date" name="startDate">
              <DatePicker style={{ width: "100%" }} format="YYYY/MM/DD" />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Please input your course price!",
                },
              ]}
            >
              <Input prefix="$" placeholder="Course price" />
            </Form.Item>
            <Form.Item
              label="Student Limit"
              name="studentLimit"
              rules={[
                {
                  required: true,
                  message: "Please input your course student limit!",
                },
              ]}
            >
              <Input placeholder="Student Limit" />
            </Form.Item>
            <Form.Item
              label="Duration"
              name="duration"
              rules={[
                {
                  required: true,
                  message: "Please input your course duration!",
                },
              ]}
            >
              <Input placeholder="course duration" addonAfter={durationUnit} />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={13} />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item label="Dragger">
              <Form.Item
                name="dragger"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Dragger name="files" action="/upload.do" height="300px">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload.
                  </p>
                </Dragger>
              </Form.Item>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {props.mode ? "Create Course" : "Update Course"}
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  );
};

export default courseDetailForm;
