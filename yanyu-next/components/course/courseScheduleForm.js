import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space, Row, Col } from "antd";

const courseScheduleForm = () => {
  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };
  return (
    <>
      <Row>
        <Col span={12}>
          <h1 style={{ float: "left" }}>Chapters</h1>
        </Col>
        <Col span={12}>
          <h1 style={{ float: "left" }}>Class times</h1>
        </Col>
      </Row>
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row>
          <Col span={12}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="first"
                  rules={[
                    {
                      required: true,
                      message: "Missing first name",
                    },
                  ]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="last"
                  rules={[
                    {
                      required: true,
                      message: "Missing last name",
                    },
                  ]}
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
              </Col>
            </Row>
            <Form.List name="chapters">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "first"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing first name",
                            },
                          ]}
                        >
                          <Input placeholder="First Name" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "last"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing last name",
                            },
                          ]}
                        >
                          <Input placeholder="Last Name" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Col>
                    </Row>
                  ))}
                  <Row>
                    <Col span={20}>
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add field
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </Form.List>
          </Col>
          <Col span={12}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="first"
                  rules={[
                    {
                      required: true,
                      message: "Missing first name",
                    },
                  ]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="last"
                  rules={[
                    {
                      required: true,
                      message: "Missing last name",
                    },
                  ]}
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
              </Col>
            </Row>
            <Form.List name="times">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "first"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing first name",
                            },
                          ]}
                        >
                          <Input placeholder="First Name" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "last"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing last name",
                            },
                          ]}
                        >
                          <Input placeholder="Last Name" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              remove(name);
                            } else {
                              message.warn(
                                "You must set at least one class time."
                              );
                            }
                          }}
                        />
                      </Col>
                    </Row>
                  ))}
                  <Row>
                    <Col span={20}>
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add field
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </Form.List>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default courseScheduleForm;
