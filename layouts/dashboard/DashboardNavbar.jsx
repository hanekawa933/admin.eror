import { useState, useContext, useEffect } from "react";
import { TempContext } from "../../context/TempContext";
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  Button,
  Divider,
  useColorMode,
  Text,
  Link,
} from "@chakra-ui/react";
import { SettingsIcon, SunIcon, MoonIcon, BellIcon } from "@chakra-ui/icons";
import { Icon } from "@iconify/react";
import instance from "../../axios.default";
import moment from "moment";
import "moment/locale/id";

const DashboardNavbar = () => {
  const NavbarMobile = "64px";
  const NavbarDesktop = "92px";
  const { colorMode, toggleColorMode } = useColorMode();

  const [settings, setSettings] = useContext(TempContext);

  const toggleSidebar = () => {
    setSettings({ ...settings, active: !settings.active });
  };

  return (
    <Box
      sx={{
        "--my-calculation":
          settings.bigMode === false
            ? "calc(100% - 280px)"
            : "calc(100% - 90px)",
      }}
      w={[
        "100%",
        "100%",
        "100%",
        "100%",
        "var(--my-calculation)",
        "var(--my-calculation)",
      ]}
      justifyContent="space-between"
      alignItems="center"
      height={[
        NavbarMobile,
        NavbarMobile,
        NavbarMobile,
        NavbarMobile,
        NavbarDesktop,
        NavbarDesktop,
      ]}
      bg={useColorMode().colorMode === "dark" ? "gray.800" : "white"}
      position="fixed"
      top="0"
      right="0"
      px="6"
      display="flex"
      zIndex="500"
    >
      <Button
        visibility={[
          "visible",
          "visible",
          "visible",
          "visible",
          "hidden",
          "hidden",
        ]}
        onClick={() => toggleSidebar()}
        zIndex="5000"
      >
        <Icon icon="ci:list-ul" width={24} height={24} />
      </Button>
      <Box display="flex">
        <Menu>
          <MenuButton as={Button}>
            <SettingsIcon />
          </MenuButton>
          <MenuList>
            <Box as="span" px="5" fontSize="1.1em" fontWeight="bold">
              Settings
            </Box>
            <Divider pb="3" />
            <Box display="flex" flexDirection="column" px="5">
              <Box as="span" py="3" fontWeight="semibold">
                App Theme
              </Box>
              <Box display="flex" justifyContent="space-around">
                <Box
                  cursor="pointer"
                  width="20"
                  height="20"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  background="yellow.100"
                  borderRadius="md"
                  _hover={{ background: "yellow.200" }}
                  onClick={colorMode === "dark" ? toggleColorMode : () => null}
                >
                  <SunIcon color="gray.900" />
                </Box>
                <Box
                  cursor="pointer"
                  width="20"
                  height="20"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  background="gray.800"
                  borderRadius="md"
                  _hover={{ background: "gray.900" }}
                  onClick={colorMode === "light" ? toggleColorMode : () => null}
                >
                  <MoonIcon color="gray.100" />
                </Box>
              </Box>
            </Box>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
};

export default DashboardNavbar;
