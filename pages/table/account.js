import Head from "next/head";
import DashboardLayout from "../../layouts/dashboard";
import { TableUserAccount } from "../../tables";
import { Box, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useContext, useState } from "react";
import { TempContext } from "../../context/TempContext";

export default function DashboardTableAccount() {
  const router = useRouter();
  const [settings, setSettings] = useContext(TempContext);

  const fetchUserLogin = async () => {
    try {
      const result = await instance.get("/SuperAdmin/profile");
      setSettings({ ...settings, userLogin: result.data.data });
    } catch (error) {
      router.push("/");
    }
  };

  useEffect(() => {
    fetchUserLogin();
  }, []);
  return (
    <div>
      <Head>
        <title>E-ROR | SuperAdmin Table Data Account</title>
      </Head>
      <DashboardLayout>
        <Box pb="10" px="5">
          <Box p="5">
            <Heading fontSize="2.1em">Create User</Heading>
            <TableUserAccount />
          </Box>
        </Box>
      </DashboardLayout>
    </div>
  );
}
