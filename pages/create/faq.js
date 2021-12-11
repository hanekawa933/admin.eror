import Head from "next/head";
import DashboardLayout from "../../layouts/dashboard";
import { FormFaq } from "../../form";
import { Box, Heading, Skeleton } from "@chakra-ui/react";
import { useEffect, useContext, useState } from "react";
import { TempContext } from "../../context/TempContext";
import instance from "../../axios.default";
import { useRouter } from "next/router";

export default function DashboardCreateFaq() {
  const router = useRouter();
  const [settings, setSettings] = useContext(TempContext);
  const [loadingUser, setLoadingUser] = useState(false);

  const fetchUserLogin = async () => {
    try {
      const result = await instance.get("/SuperAdmin/profile");
      setSettings({ ...settings, userLogin: result.data.data });
      setLoadingUser(true);
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
        <title>E-ROR | Buat FAQ</title>
      </Head>
      <DashboardLayout>
        <Box pb="10" px="5">
          <Skeleton isLoaded={loadingUser}>
            <Box p="5">
              <Heading fontSize="2.1em">Buat FAQ</Heading>
              <FormFaq />
            </Box>
          </Skeleton>
        </Box>
      </DashboardLayout>
    </div>
  );
}
