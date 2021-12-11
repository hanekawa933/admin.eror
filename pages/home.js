import Head from "next/head";
import Image from "next/image";
import DashboardLayout from "../layouts/dashboard";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Divider,
  Span,
  Link as ChakraLink,
  useColorMode,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Grid,
} from "@chakra-ui/react";
import path from "../constant.default";
import { useEffect, useContext, useState } from "react";
import { TempContext } from "../context/TempContext";
import instance from "../axios.default";
import { ProtectedRoute } from "../HOC/withAuth";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";

function Home() {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const [settings, setSettings] = useContext(TempContext);
  const [report, setReport] = useState([]);

  const fetchUserLogin = async () => {
    try {
      const result = await instance.get("/SuperAdmin/profile");
      setSettings({ ...settings, userLogin: result.data.data });
    } catch (error) {
      router.push("/");
    }
  };

  const fetchReport = async () => {
    try {
      const result = await instance.get("/laporan/sum_laporan");
      setReport(result.data.data);
    } catch (error) {
      router.push("/");
    }
  };

  useEffect(() => {
    fetchUserLogin();
    fetchReport();
  }, []);

  const stats =
    report &&
    report.count &&
    report.count.map((res) => {
      const today = parseInt(res.today);
      const yesterday = parseInt(res.yesterday);
      const starting = parseInt(res.jumlah);
      const finalValue =
        today >= yesterday ? starting + today : starting - yesterday;
      const divition = (finalValue - starting) / starting;
      const percentage = divition * 100;
      return (
        <Box
          key={res.id}
          background={colorMode === "dark" ? "gray.900" : "gray.100"}
          borderRadius="lg"
          boxShadow="md"
          px="10"
          py="5"
          display="flex"
          alignItems="center"
          justifyContent="space-around"
        >
          <Box width="max-content">
            <Stat>
              <StatLabel
                fontSize={"1em"}
                textTransform="capitalize"
                fontWeight="bold"
              >
                {res.nama}
              </StatLabel>
              <StatNumber
                textTransform="capitalize"
                color={colorMode === "dark" ? "gray.400" : "gray.700"}
              >
                {res.jumlah} {res.nama}
              </StatNumber>
              <StatHelpText>
                <StatArrow
                  type={res.today >= res.yesterday ? "increase" : "decrease"}
                />
                {percentage.toFixed(2)}%
              </StatHelpText>
            </Stat>
          </Box>
          <Box>
            <Icon
              icon={
                res.nama.toLowerCase() === "user"
                  ? "carbon:user-avatar-filled"
                  : "entypo:text-document-inverted"
              }
              width={5 * 16 + "px"}
              color="orange"
            />
          </Box>
        </Box>
      );
    });

  const statsReport =
    report && report.laporan
      ? report.laporan.map((res) => {
          const today = parseInt(res.today);
          const yesterday = parseInt(res.yesterday);
          const starting = parseInt(res.count);
          const finalValue =
            today >= yesterday ? starting + today : starting - yesterday;
          const divition = (finalValue - starting) / starting;
          const percentage = divition * 100;
          return (
            <Box
              key={res.id}
              background={colorMode === "dark" ? "gray.900" : "gray.100"}
              borderRadius="lg"
              boxShadow="md"
              px="10"
              py="5"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stat>
                <StatLabel
                  fontSize={"1em"}
                  textTransform="capitalize"
                  fontWeight="bold"
                >
                  {res.nama}
                </StatLabel>
                <StatNumber
                  textTransform="capitalize"
                  color={colorMode === "dark" ? "gray.400" : "gray.700"}
                >
                  {res.count} laporan
                </StatNumber>
                <StatHelpText>
                  <StatArrow
                    type={res.today >= res.yesterday ? "increase" : "decrease"}
                  />
                  {percentage.toFixed(2)}%
                </StatHelpText>
              </Stat>
              <Box>
                <Box
                  as="object"
                  data={parseInt(res.id) === 999 ? res.icon : path + res.icon}
                  type="image/svg+xml"
                  maxW="100%"
                  height="24"
                  my={["5", "5", "5", "5", "5", "5"]}
                  pointerEvents="none"
                  mx="auto"
                ></Box>
              </Box>
            </Box>
          );
        })
      : null;

  const gridResponsive = ["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(2, 1fr)"];
  const gridResponsive2 = [
    "repeat(1, 1fr)",
    "repeat(1, 1fr)",
    "repeat(2, 1fr)",
    "repeat(2, 1fr)",
    "repeat(3, 1fr)",
  ];

  return (
    <div>
      <Head>
        <title>E-ROR | Login Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <Box px="5" py="10">
          <Box p="8" borderRadius="lg" boxShadow="lg">
            <Heading>Statistik Aplikasi</Heading>
            <Grid gridTemplateColumns={gridResponsive} gap="6" mt="5">
              {stats}
            </Grid>
          </Box>
          <Box p="8" borderRadius="lg" boxShadow="lg" mt="10">
            <Heading>Statistik Laporan</Heading>
            <Grid gridTemplateColumns={gridResponsive2} gap="6" mt="5">
              {statsReport}
            </Grid>
          </Box>
        </Box>
      </DashboardLayout>
    </div>
  );
}

export default ProtectedRoute(Home);
