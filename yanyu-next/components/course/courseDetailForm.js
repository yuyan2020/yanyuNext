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
import debounce from "lodash/debounce";
import { InboxOutlined } from "@ant-design/icons";
const { Option } = Select;
const { Dragger } = Upload;
import { useState, useEffect, useRef, useMemo } from "react";
import { getCourseCode, getTeachers } from "../../lib/api/apiService";
const durationUnit = (
  <Select defaultValue="month" className="select-after">
    <Option value="year">year</Option>
    <Option value="month">month</Option>
    <Option value="day">day</Option>
    <Option value="week">week</Option>
    <Option value="hour">hour</Option>
  </Select>
);
const draggerProps = {
  name: "file",
  multiple: true,
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  height: "300px",

  onChange(info) {
    const { status } = info.file;

    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }

    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },

  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const DebounceSelect = ({ fetchOptions, debounceTimeout = 800, ...props }) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
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
  const [form] = Form.useForm();
  const [course, setCourse] = useState();
  const [code, setCode] = useState();
  const [teacher, setTeacher] = useState([]);

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    props.nextStep();
  };

  const onBlur = () => {
    console.log("blur");
  };

  const onFocus = () => {
    console.log("focus");
  };
  const onSearch = (val) => {
    console.log("search:", val);
  };

  useEffect(() => {
    getCourseCode().then((res) => {
      setCode(res.data.data);

      form.setFieldsValue({ courseCode: res.data.data });
    });
  }, []);

  return (
    <>
      <Form
        // {...formItemLayout}
        form={form}
        name="courseDetail"
        onFinish={onFinish}
        // initialValues={{
        //   residence: ["zhejiang", "hangzhou", "xihu"],
        //   prefix: "86",
        // }}
        scrollToFirstError
        layout="vertical"
        // initialValues={{ courseCode: code ? code : null }}
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
                // mode="multiple"
                // value={teacher}
                placeholder="Select Teacher"
                fetchOptions={fetchTeacherList}
                // onChange={(newValue) => {
                //   setTeacher(newValue);
                // }}
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
              <Input placeholder="" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Course Code"
              name="courseCode"
              rules={[{ required: true }]}
            >
              <Input
                placeholder=""
                defaultValue="waiting to be fetched"
                disabled
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Start Date" name="startDate">
              <DatePicker style={{ width: "100%" }} />
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
            <Form.Item label="Cover" name="cover" rules={[{}]}>
              <Dragger {...draggerProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from
                  uploading company data or other band files
                </p>
              </Dragger>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Course
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </>
  );
};

export default courseDetailForm;
