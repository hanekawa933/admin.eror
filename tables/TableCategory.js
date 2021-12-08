import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  Badge,
  FormLabel,
  useDisclosure,
  FormControl,
  Input,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  useColorMode,
} from "@chakra-ui/react";
import DataTable from "react-data-table-component";
import { darkTheme, lightTheme } from "../styles/tableTheme";
import InputFilterTable from "../components/InputFilterTable";
import OptionButtonMenuTable from "../components/OptionButtonMenuTable";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider, Field } from "formik";
import instance from "../axios.default";

const TableCategory = () => {
  const [query, setQuery] = useState(``);
  const [active, setActive] = useState([1]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [category, setCategory] = useState([]);
  const [ids, setIds] = useState("");

  const fetchCategory = async () => {
    try {
      const result = await instance.get("/kategori");
      setCategory(result.data.data);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const openAndSetIds = (val) => {
    onOpen();
    setIds(val);
  };

  const columnNames = [
    { names: "No", selector: "no", width: "7%", center: true },
    { names: "Kategori", selector: "category", center: true },
    { names: "Kode Kategori", selector: "kd_category", center: true },
    { names: "Icon Kategori", selector: "icon_category", center: true },
    { names: "Aksi", selector: "option", center: true },
  ];

  const dataFiltered = category.filter((val) => {
    return val.id === ids;
  });

  const Schema = Yup.object().shape({
    nama: Yup.string().required("Input tidak boleh kosong"),
    kd_kategori: Yup.string().required("Input tidak boleh kosong"),
    icon: Yup.string().nullable(),
  });

  let initValues = {};

  dataFiltered.map(async (result) => {
    return (initValues = {
      nama: result.nama,
      kd_kategori: result.kd_kategori,
      icon: null,
      data: result.icon,
    });
  });

  const updateKategori = async (ids, values) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const result = await instance.post(
        `/kategori/update/id/${ids}`,
        values,
        config
      );
      setIds("");
      fetchCategory();
      console.log(result);
    } catch (error) {
      alert(error);
      console.log(error.response);
    }
  };

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <InputFilterTable
        onFilterText={(e) => setFilterText(e.target.value)}
        clearFilter={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  darkTheme;
  lightTheme;

  const dataTable = category.map((result, index) => {
    return {
      id: index,
      no: index + 1,
      nama: result.nama,
      kode: result.kd_kategori,
      category: (
        <Text fontSize="1.3em" my="10">
          {result.nama}
        </Text>
      ),
      kd_category: (
        <Text fontSize="1.3em" my="10">
          {result.kd_kategori}
        </Text>
      ),
      icon_category: (
        <Box
          as="object"
          data={"http://localhost/eror_api" + result.icon}
          type="image/svg+xml"
          maxW="100%"
          height="36"
          my={["5", "5", "5", "5", "5", "5"]}
          pointerEvents="none"
        ></Box>
      ),
      option: (
        <OptionButtonMenuTable setAndOpen={() => openAndSetIds(result.id)} />
      ),
    };
  });

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const formData = new FormData();
      formData.append("nama", values.nama);
      formData.append("kd_kategori", values.kd_kategori);
      formData.append("icon", values.icon);
      updateKategori(ids, formData);
      resetForm({});
      onClose();
      setSubmitting(false);
    },
    enableReinitialize: true,
  });

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    handleBlur,
    values,
    setFieldValue,
  } = formik;

  const filteredItems = dataTable.filter((item) => {
    if (!filterText) return true;
    if (
      item.nama.toLowerCase().includes(filterText.toLowerCase()) ||
      item.kode.toLowerCase().includes(filterText.toLowerCase())
    ) {
      return true;
    }
  });

  const columns = columnNames.map((res) => {
    return {
      name: res.names,
      selector: (row) => row[res.selector],
      width: res.width,
      center: res.center,
    };
  });

  const changedHandler = (event) => {
    setFieldValue("icon", event.currentTarget.files[0]);
  };

  const modalEdit = (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Report</ModalHeader>
        <ModalCloseButton />
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl
                id="nama"
                pt="5"
                isInvalid={Boolean(touched.nama && errors.nama)}
              >
                <FormLabel textTransform="capitalize">Nama Kategori</FormLabel>
                <Input
                  type="text"
                  name="nama"
                  {...getFieldProps("nama")}
                  onBlur={handleBlur}
                />
                <FormErrorMessage>
                  {touched.nama && errors.nama}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="kd_kategori"
                pt="5"
                isInvalid={Boolean(touched.kd_kategori && errors.kd_kategori)}
              >
                <FormLabel textTransform="capitalize">Kode Kategori</FormLabel>
                <Input
                  type="text"
                  name="kd_kategori"
                  {...getFieldProps("kd_kategori")}
                  onBlur={handleBlur}
                />
                <FormErrorMessage>
                  {touched.kd_kategori && errors.kd_kategori}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="icon"
                isInvalid={Boolean(touched.icon && errors.icon)}
                mt="5"
              >
                <FormLabel>Ilustrasi Kategori (SVG atau PNG)</FormLabel>
                <Input
                  variant="flushed"
                  type="file"
                  name="icon"
                  onBlur={handleBlur}
                  onChange={(event) => changedHandler(event)}
                  accept=".svg, .png"
                />
                <Text fontSize="xs">
                  *Kosongkan jika tidak ingin mengubah icon
                </Text>
                <FormErrorMessage>
                  {touched.icon && errors.icon}
                </FormErrorMessage>
              </FormControl>
              <Box
                as="object"
                data={"http://localhost/eror_api" + initValues.data}
                type="image/svg+xml"
                maxW="100%"
                height="36"
                my={["5", "5", "5", "5", "5", "5"]}
                pointerEvents="none"
                mx="auto"
              ></Box>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={onClose}>
                Batal
              </Button>
              <Button
                type="submit"
                colorScheme="green"
                isLoading={isSubmitting}
              >
                Ubah Data
              </Button>
            </ModalFooter>
          </Form>
        </FormikProvider>
      </ModalContent>
    </Modal>
  );

  return (
    <Box>
      {modalEdit}
      <Box mt="5">
        <DataTable
          columns={columns}
          data={filteredItems}
          pagination
          paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          persistTableHead
          highlightOnHover
          pointerOnHover
          theme={useColorMode().colorMode === "dark" ? "dark" : "light"}
        />
      </Box>
    </Box>
  );
};

export default TableCategory;
