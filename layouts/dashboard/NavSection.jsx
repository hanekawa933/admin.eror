import { useContext } from "react";
import { TempContext } from "../../context/TempContext";
import {
  Box,
  List,
  ListItem,
  useColorMode,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  general,
  report,
  operational,
  user,
  admin,
  technician,
} from "./SidebarData";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import Cookie from "js-cookie";

const logoutIcon = "simple-line-icons:logout";
const getIcon = (icon) => <Icon icon={icon} width={22} height={22} />;

const NavSection = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const [settings, setSettings] = useContext(TempContext);

  const ActiveList = (path, key, icon, text) => {
    return (
      <ListItem borderRadius="md" key={key} my="3">
        <Link href={path} passHref>
          <ChakraLink
            alignItems="center"
            display="flex"
            borderRadius="md"
            bg={colorMode === "dark" ? "gray.700" : "gray.100"}
            p="3"
            boxShadow="xl"
            _hover={{ textDecoration: "none" }}
            onClick={() =>
              setSettings({ ...settings, active: !settings.active })
            }
          >
            {icon}
            <Text
              color={colorMode === "dark" ? "gray.100" : "gray.700"}
              fontWeight="500"
              fontSize="sm"
              casing="uppercase"
              mx="5"
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
              {text}
            </Text>
          </ChakraLink>
        </Link>
      </ListItem>
    );
  };

  const NonActiveList = (path, key, icon, text) => {
    return (
      <ListItem borderRadius="md" key={key} my="3">
        <Link href={path} passHref>
          <ChakraLink
            onClick={() =>
              setSettings({ ...settings, active: !settings.active })
            }
            alignItems="center"
            display="flex"
            borderRadius="md"
            _hover={{
              background: colorMode === "dark" ? "gray.700" : "gray.100",
              boxShadow: "xl",
            }}
            p="3"
          >
            {icon}
            <Text
              color={colorMode === "dark" ? "gray.100" : "gray.700"}
              fontWeight="500"
              fontSize="sm"
              casing="uppercase"
              mx="5"
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
              {text}
            </Text>
          </ChakraLink>
        </Link>
      </ListItem>
    );
  };

  const checkWhatListIsActive = (path, key, icon, text, log) =>
    path === router.pathname
      ? ActiveList(path, key, icon, text, log)
      : NonActiveList(path, key, icon, text, log);

  const GeneralList = general.map((data, index) => {
    return checkWhatListIsActive(data.to, index, data.icon, data.text);
  });
  const OperationalList = operational.map((data, index) => {
    return checkWhatListIsActive(data.to, index, data.icon, data.text);
  });
  const ReportList = report.map((data, index) => {
    return checkWhatListIsActive(data.to, index, data.icon, data.text);
  });

  const logout = () => {
    Cookie.remove("token");
    router.push("/");
  };

  const logoutLink = (
    <ListItem>
      <Box
        borderRadius="md"
        _hover={{
          background: colorMode === "dark" ? "gray.700" : "gray.100",
          textDecoration: "none",
          boxShadow: "xl",
        }}
        alignItems="center"
        display="flex"
        p="3"
        onClick={() => logout()}
        cursor="pointer"
      >
        {getIcon(logoutIcon)}
        <Text
          color={colorMode === "dark" ? "gray.100" : "gray.700"}
          fontWeight="500"
          fontSize="sm"
          casing="uppercase"
          mx="5"
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
          logout
        </Text>
      </Box>
    </ListItem>
  );

  return (
    <Box
      w={[
        "280px",
        "280px",
        "280px",
        "280px",
        settings.bigMode === true ? "90px" : "280px",
        settings.bigMode === true ? "90px" : "280px",
      ]}
      mt="10"
      _groupHover={{ width: "280px" }}
    >
      <Box>
        <Box
          fontWeight="500"
          fontSize="sm"
          textTransform="uppercase"
          mx="5"
          my="5"
          letterSpacing="2px"
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
          Umum
        </Box>
        <List px="5">
          {GeneralList}
          {logoutLink}
        </List>
      </Box>
      <Box mt="5">
        <Box
          fontWeight="500"
          fontSize="sm"
          textTransform="uppercase"
          mx="5"
          my="5"
          letterSpacing="2px"
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
          Form
        </Box>
        <List px="5">{OperationalList}</List>
      </Box>
      <Box mt="5">
        <Box
          fontWeight="500"
          fontSize="sm"
          textTransform="uppercase"
          mx="5"
          my="5"
          letterSpacing="2px"
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
          Tabel Data
        </Box>
        <List px="5">{ReportList}</List>
      </Box>
    </Box>
  );
};

export default NavSection;
