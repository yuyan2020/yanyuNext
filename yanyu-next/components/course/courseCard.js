import { Card, Button, Divider } from "antd";
import { useRouter } from "next/router";
import { UserOutlined } from "@ant-design/icons";

const { Meta } = Card;

export default function CourseCard(props) {
  const router = useRouter();
  const infoStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "0px",
  };
  const gridStyle = {
    width: "25%",
    textAlign: "center",
    marginTop: "10px",
  };

  const handleCourseDetail = () => {
    router.push("/course/allCourse/" + props.item.id);
  };
  const Detail = () => {
    return (
      <div style={{ marginTop: "10px", marginBottom: "10px" }}>
        <div style={infoStyle}>
          <span>{props.item.createdAt}</span>
          <span>{props.item.star}</span>
        </div>
        <Divider style={{ margin: "3px" }} />
        <div style={infoStyle}>
          <span>Duration:</span>
          <span>{props.item.duration}</span>
        </div>
        <Divider style={{ margin: "3px" }} />
        <div style={infoStyle}>
          <span>Teacher:</span>
          <span>{props.item.teacherName}</span>
        </div>
        <Divider style={{ margin: "3px" }} />
        <div style={infoStyle}>
          <span>
            <UserOutlined
              style={{ marginRight: 5, fontSize: 16, color: "#1890ff" }}
            />
            Student Limit:
          </span>
          <span>{props.item.maxStudents}</span>
        </div>
        {props.readMore ? (
          <Button
            type="primary"
            style={{ marginTop: "10px" }}
            onClick={handleCourseDetail}
          >
            Read More
          </Button>
        ) : (
          <>
            <Card.Grid hoverable={false} style={gridStyle}>
              <h1>{props.item.price}</h1>
              <span>Price</span>
            </Card.Grid>
            <Card.Grid hoverable={false} style={gridStyle}>
              <h1>{props.item.sales.batches}</h1>
              <span>Batches</span>
            </Card.Grid>
            <Card.Grid hoverable={false} style={gridStyle}>
              <h1>{props.item.sales.paidAmount}</h1>
              <span>Students</span>
            </Card.Grid>
            <Card.Grid hoverable={false} style={gridStyle}>
              <h1>{props.item.sales.earnings}</h1>
              <span>Earnings</span>
            </Card.Grid>
          </>
        )}
      </div>
    );
  };
  return (
    <Card
      cover={
        <img
          alt="example"
          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        />
      }
      style={props.style}
    >
      <Meta title={props.item.name} />
      <Detail />
    </Card>
  );
}
