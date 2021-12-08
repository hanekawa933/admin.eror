import Head from "next/head";
import DashboardLayout from "../../layouts/dashboard";
import { TableReport } from "../../tables";
import { Box, Heading } from "@chakra-ui/react";

export default function DashboardTableAccount() {
  return (
    <div>
      <Head>
        <title>E-ROR | SuperAdmin Table Data Account</title>
      </Head>
      <DashboardLayout>
        <Box pb="10" px="5">
          <Box p="5">
            <Heading fontSize="2.1em">Table Report</Heading>
            <TableReport />
          </Box>
        </Box>
      </DashboardLayout>
    </div>
  );
}
