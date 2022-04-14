import { Layout } from "antd";
import { Radio } from "antd";
import { Typography } from "antd";
import styles from "./home.module.css";
import { Row, Col } from "antd";
import { Space } from "antd";
import "antd/dist/antd.css";
import {
  Form,
  Input,
  InputNumber,
  Cascader,
  Select,
  Checkbox,
  Button,
  AutoComplete,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Header, Footer, Sider, Content } = Layout;

export default function Home() {
  const onFinish = () => {
    console.log("cool");
  };
  return (
    <>
      <Row align="left">
        <Col span={8}></Col>

        <Col span={8}>
          <Title>Course Management Assistant</Title>
          <Radio.Group defaultValue="student" style={{ marginTop: 16 }}>
            <Radio.Button value="student">Student</Radio.Button>
            <Radio.Button value="teacher">Teacher</Radio.Button>
            <Radio.Button value="manager">Manager</Radio.Button>
          </Radio.Group>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            style={{ marginTop: 16 }}
          >
            <Form.Item
              name="email"
              label=""
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Please input email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label=""
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
              hasFeedback
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Please input your password"
              />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 0, span: 16 }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
              <Button type="primary" htmlType="submit" block>
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </Col>

        <Col span={8}></Col>
      </Row>
    </>
  );
}
