import React from "react";
import App from "next/app";
import "../styles/dashboard.css";
import DefaultLayout from "../components/layouts/default";
import MessageState from "../Providers/messageProvider/MessageState";

const MyApp = ({ Component, pageProps }) => {
  const Layout = Component.Layout || DefaultLayout;
  return (
    <MessageState>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MessageState>
  );
};

export default MyApp;
