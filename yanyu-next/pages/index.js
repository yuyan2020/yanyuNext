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
import { login } from "../lib/api/apiService";
import { useEffect } from "react";

const { Title } = Typography;

export default function Home() {
  const router = useRouter();

  const onFinish = (values) => {
    login({
      email: values.email,
      password: AES.encrypt(values.password, "cms").toString(),
      role: values.roll,
    })
      .then((res) => {
        localStorage.setItem("accessToken", res.data.data.token);
        localStorage.setItem("userRole", res.data.data.role);
        localStorage.setItem("serId", res.data.data.userId);
        router.push("/dashboard");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      router.push("/dashboard");
    }
  }, []);

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
