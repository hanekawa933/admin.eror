import Head from "next/head";
import DashboardLayout from "../../layouts/dashboard";
import { TableCategory } from "../../tables";
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

export default function DashboardTableCategory() {
  return (
    <div>
      <Head>
        <title>E-ROR | SuperAdmin Table Data Category</title>
      </Head>
      <DashboardLayout>
        <Box pb="10" px="5">
          <Box p="5">
            <Heading fontSize="2.1em">Table Category</Heading>
            <TableCategory />
          </Box>
        </Box>
      </DashboardLayout>
    </div>
  );
}
