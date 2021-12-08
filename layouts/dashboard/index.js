import { useContext } from "react";
import { Box } from "@chakra-ui/react";
import { TempContext } from "../../context/TempContext";

import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = ({ children }) => {
  const NavbarMobile = "64px";
  const NavbarDesktop = "92px";

  const [settings, setSettings] = useContext(TempContext);

  return (
    <Box display="flex" minHeight="100%" overflow="hidden">
      <DashboardNavbar />
      <DashboardSidebar />
      <Box
        sx={{
          "--calc-mobile": `calc(${NavbarMobile} + 24px)`,
          "--calc-desktop": `calc(${NavbarDesktop} + 24px)`,
        }}
        pt={[
          "var(--calc-mobile)",
          "var(--calc-mobile)",
          "var(--calc-mobile)",
          "var(--calc-desktop)",
          "var(--calc-desktop)",
          "var(--calc-desktop)",
        ]}
        flexGrow="1"
        overflow="auto"
        ml={[
          0,
          0,
          0,
          0,
          settings.bigMode === true ? "90px" : "280px",
          settings.bigMode === true ? "90px" : "280px",
        ]}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
