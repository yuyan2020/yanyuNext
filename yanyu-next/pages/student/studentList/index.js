import DashboardLayout from "../../../components/layouts/dashboard";
import { useEffect } from "react";
import axios from "axios";
import { Table } from "antd";
import { useState } from "react";
import { Modal, Button, Input, Space, Form, Checkbox, Select } from "antd";
import { AudioOutlined } from "@ant-design/icons";
import { debounce } from "lodash";

const { Search } = Input;
const columns = [
  {
    title: "No.",
    dataIndex: "number",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
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
    width: "8%",
    render: (record) => (
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <a onClick={() => console.log(record.id)}>Edit</a>
        <a onClick={() => console.log(record.id)}>Delete</a>
      </div>
    ),
  },
];

const token = localStorage.accessToken;

const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Create a new collection"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your name!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Type"
          name="type"
          rules={[
            {
              required: true,
              message: "Please select your student type!",
            },
          ]}
        >
          <Select>
            <Select.Option value="1">1</Select.Option>
            <Select.Option value="2">2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Country"
          name="country"
          rules={[
            {
              required: true,
              message: "Please input your country!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

function StudentList() {
  const sumCourses = (courses) => {
    const sum = "";
    courses.forEach((element) => {
      sum += element.name + ", ";
    });
    return sum;
  };

  const [isUpdate, setIsUpdate] = useState(false);
  const onSearch = (e) => setSearch(e.target.value);
  const handleSearchInput = (e) => setSearch(e.target.value);
  const debounceHandleSearchInput = debounce(handleSearchInput, 1000);
  const [student, setStudent] = useState();
  const [pagination, setPagination] = useState();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };
  const [visible, setVisible] = useState(false);

  const addModal = () => {
    setVisible(true);
  };

  const handleAddStudent = (e) => {
    console.log(e);
    axios
      .post(
        "http://cms.chtoma.com/api/students",
        {
          name: e.name,
          country: e.country,
          email: e.email,
          type: e.type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setIsUpdate(!isUpdate);
      });
    setVisible(false);
  };

  useEffect(() => {
    setLoading(true);
    let url;
    if (!search) {
      url = `http://cms.chtoma.com/api/students?page=${page}&limit=20`;
    } else {
      url = `http://cms.chtoma.com/api/students?page=${page}&limit=20&query=${search}`;
    }
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const students = res.data.data.students;
        console.log(students);
        console.log(res.data.data);
        const studentData = [];

        for (let i = 0; i < students.length; i++) {
          studentData.push({
            number: i + 20 * (page - 1),
            name: students[i].name,
            area: students[i].country,
            email: students[i].email,
            sc: sumCourses(students[i].courses),
            type: students[i].type.name,
            time: students[i].createdAt,
            id: students[i].id,
          });
        }

        setStudent(studentData);

        setPagination({
          pageSize: res.data.data.paginator.limit,
          defaultCurrent: 1,
          current: res.data.data.paginator.page,
          onChange: handlePageChange,
          total: res.data.data.total,
        });
      });

    setLoading(false);
  }, [search, page]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <Button type="primary" onClick={addModal}>
          Add
        </Button>
        <CollectionCreateForm
          visible={visible}
          onCreate={handleAddStudent}
          onCancel={() => {
            setVisible(false);
          }}
        />
        {/* <Modal title="Basic Modal" visible={isModalVisible} footer={null}>
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            id="addStudent"
            style={{ marginRight: "60px" }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Please select your student type!",
                },
              ]}
            >
              <Select>
                <Select.Option value="1">1</Select.Option>
                <Select.Option value="2">2</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Country"
              name="country"
              rules={[
                {
                  required: true,
                  message: "Please input your country!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <Form.Item
                wrapperCol={{
                  offset: 16,
                  span: 16,
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "15px" }}
                  onSubmit={handleAddStudent}
                >
                  Submit
                </Button>
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  offset: 16,
                  span: 16,
                }}
              >
                <Button htmlType="submit">Cancel</Button>
              </Form.Item>
            </div>
          </Form>
        </Modal> */}
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          style={{ width: 300 }}
          onChange={debounceHandleSearchInput}
        />
      </div>

      <Table
        columns={columns}
        // rowKey={(record) => record.login.uuid}
        dataSource={student}
        pagination={pagination}
        loading={loading}
        // onChange={this.handleTableChange}
      />
    </div>
  );
}

StudentList.Layout = DashboardLayout;

export default StudentList;
