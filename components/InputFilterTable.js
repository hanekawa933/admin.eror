import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  InputLeftElement,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
const InputFilterTable = ({ filterText, onFilterText, clearFilter }) => {
  return (
    <InputGroup width="35%" mb="7">
      <InputLeftElement
        pointerEvents="none"
        color="gray.300"
        fontSize="1.2em"
        // eslint-disable-next-line react/no-children-prop
        children={<Search2Icon color="gray.400" />}
      />
      <Input
        placeholder="Filter data"
        onChange={onFilterText}
        value={filterText}
      />
      <InputRightElement width="7.5rem">
        <Button colorScheme="twitter" onClick={clearFilter}>
          Hapus Filter
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default InputFilterTable;
