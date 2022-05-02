import DashboardLayout from "../../../components/layouts/dashboard";
import { useRouter } from "next/router";

const StudnetDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  return <p>Student Id: {id}</p>;
};

StudnetDetail.Layout = DashboardLayout;

export default StudnetDetail;
