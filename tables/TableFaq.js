import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Text,
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
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import DataTable from "react-data-table-component";
import { darkTheme, lightTheme } from "../styles/tableTheme";
import InputFilterTable from "../components/InputFilterTable";
import moment from "moment";
import "moment/locale/id";
import instance from "../axios.default";
import OptionButtonMenuTable from "../components/OptionButtonMenuTable";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider, Field } from "formik";

const TableFaq = () => {
  const toast = useToast();
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [ids, setIds] = useState("");
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFaq = async () => {
    try {
      const result = await instance.get("/faq");
      setFaq(result.data.data);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchFaq();
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  const openAndSetIdsDelete = (val) => {
    onOpenDeleteModal();
    setIds(val);
  };

  const openAndSetIds = (val) => {
    onOpen();
    setIds(val);
  };

  const dataFiltered = faq.filter((val) => {
    return val.id === ids;
  });

  const Schema = Yup.object().shape({
    pertanyaan: Yup.string().required("Input tidak boleh kosong"),
    jawaban: Yup.string().required("Input tidak boleh kosong"),
  });

  let initValues = {};

  dataFiltered.map(async (result) => {
    return (initValues = {
      pertanyaan: result.pertanyaan,
      jawaban: result.jawaban,
    });
  });

  const updateFaq = async (ids, values) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify(values);

      const result = await instance.put(`/faq/update/id/${ids}`, body, config);
      toast({
        title: "Berhasil",
        description: "Data berhasil diupdate.",
        status: "success",
        duration: 2000,
        position: "top",
      });
      setIds("");
      fetchFaq();
    } catch (error) {
      toast({
        title: "Gagal",
        description: error.response
          ? error.response.data.message
          : "Server Error",
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await updateFaq(ids, values);
      resetForm({});
      onClose();
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
  } = formik;

  const columnNames = [
    { names: "No", selector: "no", width: "7%" },
    { names: "Pertanyaan", selector: "question" },
    { names: "Jawaban", selector: "answer" },
    { names: "Aksi", selector: "option", width: "15%", center: true },
  ];

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

  const { colorMode } = useColorMode();

  const fontColor = colorMode === "dark" ? "gray.400" : "gray.700";

  const dataTable = faq.map((result, index) => {
    return {
      id: index,
      no: index + 1,
      pertanyaan: result.pertanyaan,
      jawaban: result.jawaban,
      question: (
        <Box my="10">
          <Text fontSize="1.3em" fontWeight="semibold">
            {result.nama_lengkap}
          </Text>
          <Text color={fontColor}>{result.pertanyaan}</Text>
        </Box>
      ),
      answer: (
        <Box my="10">
          <Text color={fontColor}>{result.jawaban}</Text>
        </Box>
      ),
      option: (
        <OptionButtonMenuTable
          setAndOpen={() => openAndSetIds(result.id)}
          setAndDelete={() => openAndSetIdsDelete(result.id)}
        />
      ),
    };
  });

  const filteredItems = dataTable.filter((item) => {
    if (!filterText) return true;
    if (
      item.pertanyaan.toLowerCase().includes(filterText.toLowerCase()) ||
      item.jawaban.toLowerCase().includes(filterText.toLowerCase())
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

  const InputTypeText = (label) => {
    return (
      <FormControl
        id={label}
        pt="5"
        isInvalid={Boolean(touched[label] && errors[label])}
      >
        <FormLabel textTransform="capitalize">
          {label.split("_").join(" ")}
        </FormLabel>
        <Input
          type="text"
          name={label}
          {...getFieldProps(label)}
          onBlur={handleBlur}
        />
        <FormErrorMessage>{touched[label] && errors[label]}</FormErrorMessage>
      </FormControl>
    );
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
              {InputTypeText("pertanyaan")}
              {InputTypeText("jawaban")}
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

  const deleteData = async () => {
    try {
      const result = await instance.delete(`/faq/delete/id/${ids}`);
      toast({
        title: "Berhasil",
        description: "Data berhasil dihapus.",
        status: "success",
        duration: 2000,
        position: "top",
      });
      setIds("");
      fetchFaq();
      setLoading(false);
      onCloseDeleteModal();
    } catch (error) {
      toast({
        title: "Gagal",
        description: error.response
          ? error.response.data.message
          : "Server Error",
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };

  const modalDelete = (
    <Modal isOpen={isOpenDeleteModal} onClose={onCloseDeleteModal} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Data</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Apakah anda yakin ingin menghapus data ini?</ModalBody>

        <ModalFooter>
          <Button
            colorScheme="green"
            mr={3}
            onClick={onCloseDeleteModal}
            isLoading={loading}
          >
            Batal
          </Button>
          <Button
            colorScheme="red"
            onClick={() => {
              setLoading(true);
              deleteData();
            }}
            isLoading={loading}
          >
            Hapus
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <Box>
      {modalEdit}
      {modalDelete}
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

export default TableFaq;
