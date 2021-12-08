import Head from "next/head";
import DashboardLayout from "../../layouts/dashboard";
import { FormCategory } from "../../form";
import { Box, Heading } from "@chakra-ui/react";
import { useEffect, useContext, useState } from "react";
import { TempContext } from "../../context/TempContext";
import instance from "../../axios.default";

export default function DashboardCreateCategory() {
  const [settings, setSettings] = useContext(TempContext);

  const fetchUserLogin = async () => {
    try {
      const result = await instance.get("/SuperAdmin/profile");
      setSettings({ ...settings, userLogin: result.data.data });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchUserLogin();
  }, []);
  return (
    <div>
      <Head>
        <title>E-ROR | SuperAdmin Create Account</title>
      </Head>
      <DashboardLayout>
        <Box pb="10" px="5">
          <Box p="5">
            <Heading fontSize="2.1em">Create Category</Heading>
            <FormCategory />
          </Box>
        </Box>
      </DashboardLayout>
    </div>
  );
}
