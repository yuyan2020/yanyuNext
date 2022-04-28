import DashboardLayout from "../../../components/layouts/dashboard";
import { useEffect } from "react";
import { Table } from "antd";
import { useState } from "react";
import { Modal, Button, Input, Form } from "antd";
import { debounce } from "lodash";
import {
  addStudent,
  deleteStudent,
  editStudent,
  getStudents,
} from "../../../lib/api/apiService";
import { formatDistance } from "date-fns";
import AddStudentForm from "../../../components/modalForms/addStudentForm";
import EditStudentForm from "../../../components/modalForms/editStudentForm";

const { Search } = Input;

const AddForm = ({ visible, onCreate, onCancel }) => {
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
      <AddStudentForm form={form} />
    </Modal>
  );
};

const EditForm = ({ visible, onEdit, onCancel, rowRecord }) => {
  const [form] = Form.useForm();
  form.setFieldsValue({
    id: rowRecord.id,
    email: rowRecord.email,
    type: rowRecord.type.id,
    country: rowRecord.country,
    name: rowRecord.name,
  });
  return (
    <Modal
      visible={visible}
      title="Edit Student"
      okText="Edit"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onEdit(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <EditStudentForm form={form} />
    </Modal>
  );
};

function StudentList() {
  const [isUpdate, setIsUpdate] = useState(false);
  const onSearch = (e) => setSearch(e.target.value);
  const handleSearchInput = (e) => setSearch(e.target.value);
  const debounceHandleSearchInput = debounce(handleSearchInput, 1000);
  const [student, setStudent] = useState();
  const [pagination, setPagination] = useState();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [recordId, setRecordId] = useState({
    id: 0,
    email: "",
    type: "",
    country: "",
  });
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };
  const [visible, setVisible] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);

  const addModal = () => {
    setVisible(true);
  };

  const addEditModal = () => {
    setVisibleEdit(true);
  };

  const handleEdit = (e) => {
    editStudent({
      name: e.name,
      country: e.country,
      email: e.email,
      type: e.type,
      id: e.id,
    }).then((res) => {
      console.log(res);
      setIsUpdate(!isUpdate);
    });
    setVisibleEdit(false);
  };

  const handleAddStudent = (e) => {
    addStudent({
      name: e.name,
      country: e.country,
      email: e.email,
      type: e.type,
    }).then((res) => setIsUpdate(!isUpdate));
    setVisible(false);
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "number",
      render: (text, record, index) => index + (page - 1) * 20,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Area",
      dataIndex: "country",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "10%",
    },
    {
      title: "Selected Curriculum",
      dataIndex: "",
      width: "30%",
      render: (record) =>
        record.courses.map((course) => course.name).join(", "),
    },
    {
      title: "Student Type",
      dataIndex: ["type", "name"],
    },
    {
      title: "Join Time",
      dataIndex: "",
      width: "18%",
      render: (record) =>
        formatDistance(new Date(record.createdAt), new Date(), {
          addSuffix: true,
        }),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      width: "8%",
      render: (record) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <a
            onClick={() => {
              setRecordId(record);
              addEditModal();
            }}
          >
            Edit
          </a>

          <a
            onClick={() =>
              deleteStudent(record.id).then((res) => {
                console.log(res);
                setIsUpdate(!isUpdate);
              })
            }
          >
            Delete
          </a>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);

    getStudents({ page: page, limit: 20, query: search })
      .then((res) => {
        const students = res.data.data.students;
        console.log(students);
        console.log(res.data.data);

        setStudent(students);

        setPagination({
          pageSize: res.data.data.paginator.limit,
          defaultCurrent: 1,
          current: res.data.data.paginator.page,
          onChange: handlePageChange,
          total: res.data.data.total,
        });
      })
      .catch((err) => console.log(err));

    setLoading(false);
  }, [isUpdate, search, page]);

  return (
    <div style={{ width: "100%" }}>
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
        <AddForm
          visible={visible}
          onCreate={handleAddStudent}
          onCancel={() => {
            setVisible(false);
          }}
        />
        <EditForm
          visible={visibleEdit}
          onEdit={handleEdit}
          onCancel={() => {
            setVisibleEdit(false);
          }}
          rowRecord={recordId}
        />

        <Search
          placeholder="input search text"
          onSearch={onSearch}
          style={{ width: 300 }}
          onChange={debounceHandleSearchInput}
        />
      </div>

      <Table
        columns={columns}
        rowKey={(record) => record.id}
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
