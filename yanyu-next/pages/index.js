import { Layout } from "antd";
import { Radio } from "antd";
import { Typography } from "antd";
import { Row, Col } from "antd";
import "antd/dist/antd.css";
import { Form, Input, Checkbox, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { AES } from "crypto-js";
import { useRouter } from "next/router";

const { Title } = Typography;

const baseURL = "http://cms.chtoma.com/api";
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  responseType: "json",
});

export default function Home() {
  const router = useRouter();
  const onFinish = async (values) => {
    try {
      const response = await axiosInstance.post(
        "/login",
        JSON.stringify({
          email: values.email,
          password: AES.encrypt(values.password, "cms").toString(),
          role: values.roll,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response.data.data));
      const accessToken = response.data.data.token;
      const userRole = response.data.data.role;
      localStorage.setItem("accessToken", JSON.stringify(accessToken));
      localStorage.setItem("userRole", JSON.stringify(userRole));
      if (accessToken && userRole) {
        router.push("/successlogin");
      }
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else if (err.response?.status === 400) {
        console.log("Missing Username or Password");
      } else if (err.response?.status === 401) {
        console.log("Unauthorized");
      } else {
        console.log("Login Failed");
      }
    }
  };

  return (
    <>
      <Row>
        <Col span={8}></Col>

        <Col span={8}>
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 10 }}
          >
            <Title>Course Management Assistant</Title>
          </div>

          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
              roll: "student",
            }}
            onFinish={onFinish}
            style={{ marginTop: 10 }}
          >
            <Form.Item label="" name="roll">
              <Radio.Group style={{ marginTop: 16 }}>
                <Radio.Button value="student">Student</Radio.Button>
                <Radio.Button value="teacher">Teacher</Radio.Button>
                <Radio.Button value="manager">Manager</Radio.Button>
              </Radio.Group>
            </Form.Item>

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
