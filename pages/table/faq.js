import Head from "next/head";
import DashboardLayout from "../../layouts/dashboard";
import { TableFaq } from "../../tables";
import { Box, Heading } from "@chakra-ui/react";

export default function DashboardTableAccount() {
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
