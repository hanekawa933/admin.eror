import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  useDisclosure,
  FormControl,
  FormLabel,
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
import instance from "../axios.default";
import OptionButtonMenuTable from "../components/OptionButtonMenuTable";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider, Field } from "formik";

const TableUserAccount = () => {
  const { colorMode } = useColorMode();
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [users, setUsers] = useState([]);
  const [ids, setIds] = useState("");

  const fetchUserData = async () => {
    try {
      const result = await instance.get("/user");
      setUsers(result.data.data);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const openAndSetIds = (val) => {
    onOpen();
    setIds(val);
  };

  const dataFiltered = users.filter((val) => {
    return val.uId === ids;
  });

  const Schema = Yup.object().shape({
    nama_lengkap: Yup.string().required("Input tidak boleh kosong"),
    password: Yup.string().min(
      8,
      "Password minimal harus terdiri dari 8 karakter"
    ),
    password_verify: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords tidak sama"
    ),
    jenis_kelamin: Yup.string().required("Input tidak boleh kosong"),
    email: Yup.string()
      .required("Input tidak boleh kosong")
      .email("Email tidak valid"),
    no_telp: Yup.number()
      .typeError("Input harus berupa angka")
      .required("Input tidak boleh kosong"),
    jabatan: Yup.string().required("Input tidak boleh kosong"),
  });

  let initValues = {};

  dataFiltered.map(async (result) => {
    return (initValues = {
      nama_lengkap: result.nama_lengkap,
      password: "",
      password_verify: "",
      jenis_kelamin: result.jenis_kelamin,
      email: result.email,
      no_telp: result.no_telp,
      jabatan: result.jabatan,
    });
  });

  const columnNames = [
    { names: "No", selector: "no", width: "7%" },
    { names: "Info User", selector: "user_info", width: "30%" },
    { names: "Profil", selector: "user_profile", width: "20%" },
    { names: "Kontak", selector: "user_contact", width: "15%" },
    { names: "Jabatan", selector: "roles", width: "15%" },
    { names: "Aksi", selector: "option", width: "13%", center: true },
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

  const dataTable = users.map((result, index) => {
    return {
      no: index + 1,
      nama_lengkap: result.nama_lengkap,
      jenis_kelamin: result.jenis_kelamin,
      email: result.email,
      no_telp: result.no_telp,
      jabatan: result.jabatan,
      role_id: result.role_id,
      role: result.nama,
      user_info: (
        <Text fontSize="1.3em" my="10">
          {result.email}
        </Text>
      ),
      user_profile: (
        <Box my="10">
          <Text fontSize="1.3em">{result.nama_lengkap}</Text>
          <Text color={colorMode === "light" ? "gray.500" : "gray.400"}>
            {!result.jenis_kelamin ? "-" : result.jenis_kelamin}
          </Text>
        </Box>
      ),
      user_contact: (
        <Box my="10">
          <Text fontSize="1.3em">{!result.no_telp ? "-" : result.no_telp}</Text>
        </Box>
      ),
      roles: (
        <Box my="10">
          <Text fontSize="1.3em">{!result.jabatan ? "-" : result.jabatan}</Text>
          <Text color={colorMode === "light" ? "gray.500" : "gray.400"}>
            {result.nama}
          </Text>
        </Box>
      ),
      option: (
        <OptionButtonMenuTable setAndOpen={() => openAndSetIds(result.uId)} />
      ),
    };
  });

  const filteredItems = dataTable.filter((item) => {
    if (!filterText) return true;
    if (
      item.nama_lengkap.toLowerCase().includes(filterText.toLowerCase()) ||
      item.jenis_kelamin.toLowerCase().includes(filterText.toLowerCase()) ||
      item.email.toLowerCase().includes(filterText.toLowerCase()) ||
      item.no_telp.toLowerCase().includes(filterText.toLowerCase()) ||
      item.jabatan.toLowerCase().includes(filterText.toLowerCase()) ||
      item.role.toLowerCase().includes(filterText.toLowerCase())
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

  const updateUserAccount = (ids, values) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify(values);

      const result = instance.put(`/user/update/id/${ids}`, body, config);
      setIds("");
      fetchUserData();
    } catch (error) {
      alert(error);
      console.log(error.response);
    }
  };

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      updateUserAccount(ids, values);
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
  } = formik;

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
        <ModalHeader>User</ModalHeader>
        <ModalCloseButton />
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <ModalBody>
              {InputTypeText("nama_lengkap")}
              <Box display="flex">
                <FormControl
                  id="password"
                  pt="5"
                  isInvalid={Boolean(touched.password && errors.password)}
                >
                  <FormLabel textTransform="capitalize">password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    {...getFieldProps("password")}
                    onBlur={handleBlur}
                  />
                  <FormErrorMessage>
                    {touched.password && errors.password}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  id="password_verify"
                  pt="5"
                  ml="5"
                  isInvalid={Boolean(
                    touched.password_verify && errors.password_verify
                  )}
                >
                  <FormLabel textTransform="capitalize">
                    Verifikasi Password
                  </FormLabel>
                  <Input
                    type="password"
                    name="password_verify"
                    {...getFieldProps("password_verify")}
                    onBlur={handleBlur}
                  />
                  <FormErrorMessage>
                    {touched.password_verify && errors.password_verify}
                  </FormErrorMessage>
                </FormControl>
              </Box>
              <Text color="gray.400" fontSize="small" mt="3">
                *Biarkan kosong jika tidak ingin mengubah password
              </Text>
              <FormControl
                id="jenis_kelamin"
                pt="5"
                isInvalid={Boolean(
                  touched.jenis_kelamin && errors.jenis_kelamin
                )}
              >
                <FormLabel textTransform="capitalize">Jenis Kelamin</FormLabel>
                <Select
                  placeholder="Pilih Jenis Kelamin"
                  name="jenis_kelamin"
                  {...getFieldProps("jenis_kelamin")}
                  onBlur={handleBlur}
                >
                  <option value="Laki-Laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </Select>
                <FormErrorMessage>
                  {touched.jenis_kelamin && errors.jenis_kelamin}
                </FormErrorMessage>
              </FormControl>
              {InputTypeText("email")}
              {InputTypeText("no_telp")}
              {InputTypeText("jabatan")}
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

export default TableUserAccount;
