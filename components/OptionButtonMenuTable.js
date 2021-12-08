import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  chakra,
} from "@chakra-ui/react";

import { SettingsIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";

const OptionButtonMenuTable = ({ setAndDelete, setAndOpen }) => {
  return (
    <Menu>
      <MenuButton as={Button} size="md" colorScheme="orange">
        <SettingsIcon />
      </MenuButton>
      <MenuList minWidth="3em">
        <MenuItem _hover={{ background: "transparent" }}>
          <Button
            size="sm"
            colorScheme="red"
            leftIcon={<DeleteIcon />}
            width="100%"
            onClick={() => setAndDelete()}
          >
            Delete
          </Button>
        </MenuItem>
        <MenuItem minWidth="3em" _hover={{ background: "transparent" }}>
          <Button
            size="sm"
            colorScheme="whatsapp"
            leftIcon={<EditIcon />}
            width="100%"
            onClick={() => setAndOpen()}
          >
            Edit
          </Button>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default OptionButtonMenuTable;
