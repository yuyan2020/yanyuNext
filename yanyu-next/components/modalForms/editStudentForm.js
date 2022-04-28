import { Input, Form, Select } from "antd";

export default function editStudentForm(props) {
  //   form.setFieldsValue({
  //     id: props.record.id,
  //     email: props.record.email,
  //     type: props.record.type,
  //     country: props.record.area,
  //     name: props.record.name,
  //   });
  return (
    <Form
      form={props.form}
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
      <Form.Item
        label="Id"
        name="id"
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
  );
}
