"use client";

import PageTitle from "../components/PageTitle";
import RegisterPage from "./registerpage";

export default function Page() {
  return (
    <>
      <PageTitle title="Create Account" description="Create your EventPro account" />
      <RegisterPage />
    </>
  );
}
