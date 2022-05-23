import React from "react";
import App from "next/app";
import "../styles/dashboard.css";
import DefaultLayout from "../components/layouts/default";
import "../styles/addCourse.css";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const Layout = Component.Layout || DefaultLayout;

    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
