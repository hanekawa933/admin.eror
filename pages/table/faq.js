import Head from "next/head";
import DashboardLayout from "../../layouts/dashboard";
import { TableFaq } from "../../tables";
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
        <title>E-ROR | Tabel Data FAQ</title>
      </Head>
      <DashboardLayout>
        <Box pb="10" px="5">
          <Box p="5">
            <Heading fontSize="2.1em">Tabel FAQ</Heading>
            <TableFaq />
          </Box>
        </Box>
      </DashboardLayout>
    </div>
  );
}
