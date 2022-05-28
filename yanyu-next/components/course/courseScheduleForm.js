import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Row, Col, Select, TimePicker } from "antd";
const { Option } = Select;
import moment from "moment";
import { addSchedule } from "../../lib/api/apiService";

const courseScheduleForm = (props) => {
  const onFinish = (values) => {
    console.log("Received values of form:", values);
    const firstChapter = {
      content: values.content,
      name: values.chapterName,
      order: 1,
    };
    const restChapters = values.chapters.map((c, index) => ({
      content: c.content,
      name: c.chapterName,
      order: index + 2,
    }));
    const firstTime = values.classTime + " " + values.time.format("HH:mm:ss");
    const restTimes = values.times.map(
      (t) => t.classTime + " " + t.time.format("HH:mm:ss")
    );
    const schedule = {
      courseId: props.id,
      scheduleId: props.sId,
      chapters: [firstChapter, ...restChapters],
      classTime: [firstTime, ...restTimes],
    };
    addSchedule(schedule).then((res) => {
      if (res.status === 200) {
        props.nextStep();
      }
    });
    console.log(schedule);
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
                  name="chapterName"
                  rules={[
                    {
                      required: true,
                      message: "Missing chapter name",
                    },
                  ]}
                >
                  <Input placeholder="Chapter Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="content"
                  rules={[
                    {
                      required: true,
                      message: "Missing chapter content",
                    },
                  ]}
                >
                  <Input placeholder="Chapter Content" />
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
                          name={[name, "chapterName"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing chapter name",
                            },
                          ]}
                        >
                          <Input placeholder="Chapter Name" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "content"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing chapter content",
                            },
                          ]}
                        >
                          <Input placeholder="Chapter Content" />
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
                          Add chapters
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
                  name="classTime"
                  rules={[
                    {
                      required: true,
                      message: "Missing Class Time",
                    },
                  ]}
                >
                  <Select
                    defaultValue=""
                    // style={{ width: 120 }}
                    // onChange={handleChange}
                  >
                    <Option value="Sunday">Sunday</Option>
                    <Option value="Monday">Monday</Option>
                    <Option value="Tuesday">Tuesday</Option>
                    <Option value="Wednesday">Wednesday</Option>
                    <Option value="Thursday">Thursday</Option>
                    <Option value="Friday">Friday</Option>
                    <Option value="Saturday">Saturday</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="time"
                  rules={[
                    {
                      required: true,
                      message: "Missing time",
                    },
                  ]}
                >
                  <TimePicker
                    defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
                    placeholder="Select Time"
                    style={{ width: "100%" }}
                  />
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
                          name={[name, "classTime"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing class time",
                            },
                          ]}
                        >
                          <Select
                            defaultValue=""
                            // style={{ width: 120 }}
                            // onChange={handleChange}
                          >
                            <Option value="Sunday">Sunday</Option>
                            <Option value="Monday">Monday</Option>
                            <Option value="Tuesday">Tuesday</Option>
                            <Option value="Wednesday">Wednesday</Option>
                            <Option value="Thursday">Thursday</Option>
                            <Option value="Friday">Friday</Option>
                            <Option value="Saturday">Saturday</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "time"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing time",
                            },
                          ]}
                        >
                          <TimePicker
                            defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
                            placeholder="Select Time"
                            style={{ width: "100%" }}
                          />
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
                          Add class time
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </Form.List>
          </Col>
        </Row>
        <Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </>
  );
};

export default courseScheduleForm;
