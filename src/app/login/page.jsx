"use client";

import PageTitle from "../components/PageTitle";
import LoginPage from "./loginpage";

export default function Page() {
  return (
    <>
      <PageTitle title="Login" description="Sign in to your EventPro account" />
      <LoginPage />
    </>
  );
}
