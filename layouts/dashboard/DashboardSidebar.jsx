import { useContext, useEffect } from "react";
import { TempContext } from "../../context/TempContext";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Heading,
  useColorMode,
  Switch,
  Button,
  Image,
  Tooltip,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import NavSection from "./NavSection";

const DashboardSidebar = () => {
  const { colorMode } = useColorMode();
  const [settings, setSettings] = useContext(TempContext);

  const toggleChange = () => {
    setSettings({ ...settings, bigMode: !settings.bigMode });
  };

  const toggleSidebar = () => {
    setSettings({ ...settings, active: !settings.active });
  };

  const exp =
    settings && settings.userLogin && parseInt(settings.userLogin.current_exp);

  console.log(settings);

  return (
    <Box
      w={[
        "280px",
        "280px",
        "280px",
        settings.bigMode === true ? "90px" : "280px",
        settings.bigMode === true ? "90px" : "280px",
        settings.bigMode === true ? "90px" : "280px",
      ]}
      role="group"
      minHeight="100%"
      borderRight="2px"
      borderColor="gray.200"
      display={[
        settings.active === true ? "inline" : "none",
        settings.active === true ? "inline" : "none",
        settings.active === true ? "inline" : "none",
        "inline",
        "inline",
        "inline",
      ]}
      bg={useColorMode().colorMode === "dark" ? "gray.800" : "white"}
      transform={[
        settings.active === true ? "translateX(0)" : "translateX(-100%)",
        settings.active === true ? "translateX(0)" : "translateX(-100%)",
        settings.active === true ? "translateX(0)" : "translateX(-100%)",
        settings.active === true ? "translateX(0)" : "translateX(-100%)",
        "translateX(0)",
        "translateX(0)",
      ]}
      pb="10"
      _hover={{
        width: settings.bigMode === true ? "280px" : "280px",
        opacity: [
          "1",
          "1",
          "1",
          "1",
          settings.bigMode === true ? "0.97" : "1",
          settings.bigMode === true ? "0.97" : "1",
        ],
        overflowY: "auto",
      }}
      position="fixed"
      zIndex={999}
      overflowY="hidden"
      top="0"
      bottom="45px"
      css={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          width: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "var(--chakra-colors-gray-200)",
          borderRadius: "24px",
        },
      }}
    >
      <Flex
        pt="5"
        px="5"
        justifyContent={[
          "space-between",
          "space-between",
          "space-between",
          "space-between",
          settings.bigMode === true ? "center" : "space-between",
          settings.bigMode === true ? "center" : "space-between",
        ]}
        alignItems="center"
        _groupHover={{ justifyContent: "space-between" }}
      >
        <Link href="/home" passHref={true}>
          <a>
            <Image boxSize="50px" src="/assets/img/EROR.png" alt="E-ROR" />
          </a>
        </Link>
        <Tooltip label="Toggle Big Mode" zIndex={1000}>
          <Box>
            <Switch
              size="md"
              display={[
                "none",
                "none",
                "none",
                "none",
                settings.bigMode === true ? "none" : "inline",
                settings.bigMode === true ? "none" : "inline",
              ]}
              _groupHover={{
                display: ["none", "none", "none", "none", "inline", "inline"],
              }}
              onChange={() => toggleChange()}
            />
          </Box>
        </Tooltip>
        <Button
          display={["inline", "inline", "inline", "inline", "none", "none"]}
          onClick={() => toggleSidebar()}
        >
          <Icon icon="eva:close-fill" width={24} height={24} />
        </Button>
      </Flex>
      <Box
        my={[
          "7",
          "7",
          "7",
          "7",
          settings.bigMode === true ? "4" : "7",
          settings.bigMode === true ? "4" : "7",
        ]}
        borderRadius="md"
        py={settings.bigMode === true ? "2" : "4"}
        display="flex"
        justifyContent="center"
        alignItems="center"
        boxShadow={[
          "xl",
          "xl",
          "xl",
          "xl",
          settings.bigMode === true ? "none" : "xl",
          settings.bigMode === true ? "none" : "xl",
        ]}
        mx={settings.bigMode === true ? "3" : "3"}
        _groupHover={{ boxShadow: "xl", mx: "3", my: "7", py: "4" }}
        background={colorMode === "dark" ? "gray.900" : "gray.50"}
      >
        <Avatar size="md" name="Avatar" src="/assets/img/photo_profile.png" />
        <Box
          mx="3"
          display={[
            "inline",
            "inline",
            "inline",
            "inline",
            settings.bigMode === true ? "none" : "inline",
            settings.bigMode === true ? "none" : "inline",
          ]}
          _groupHover={{ display: "inline" }}
        >
          <Heading fontSize="md">
            {settings.userLogin &&
              settings.userLogin.nama_lengkap &&
              settings.userLogin.nama_lengkap.split(" ")[0]}
          </Heading>
          <Text>Super Admin</Text>
        </Box>
      </Box>
      <NavSection />
    </Box>
  );
};

export default DashboardSidebar;
