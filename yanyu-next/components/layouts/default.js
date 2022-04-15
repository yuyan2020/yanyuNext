import Header from "../header";
const DefaultLayout = ({ children }) => (
  <div>
    <Header />
    {children}
  </div>
);

export default DefaultLayout;
