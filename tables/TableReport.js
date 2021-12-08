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
import moment from "moment";
import "moment/locale/id";
import instance from "../axios.default";
import OptionButtonMenuTable from "../components/OptionButtonMenuTable";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider, Field } from "formik";

const TableUserAccount = () => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [reports, setReports] = useState([]);
  const [ids, setIds] = useState("");
  const [user, setUser] = useState([]);
  const [category, setCategory] = useState([]);

  const fetchReportUserAndCategory = async () => {
    try {
      const users = await instance.get("/user");
      const category = await instance.get("/kategori");
      const result = await instance.get("/laporan");
      setReports(result.data.data);
      setUser(users.data.data);
      setCategory(category.data.data);
    } catch (error) {
      alert(error);
    }
  };

  console.log(reports);

  useEffect(() => {
    fetchReportUserAndCategory();
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const openAndSetIds = (val) => {
    onOpen();
    setIds(val);
  };

  const dataFiltered = reports.filter((val) => {
    return val.lId === ids;
  });

  const Schema = Yup.object().shape({
    pelapor_id: Yup.number().required("Input tidak boleh kosong"),
    jenis_kerusakan: Yup.string().required("Input tidak boleh kosong"),
    lokasi: Yup.string().required("Input tidak boleh kosong"),
    keterangan: Yup.string().required(),
    kategori_id: Yup.number().required("Input tidak boleh kosong"),
  });

  let initValues = {};

  dataFiltered.map(async (result) => {
    return (initValues = {
      pelapor_id: result.pelapor_id,
      jenis_kerusakan: result.jenis_kerusakan,
      lokasi: result.lokasi,
      keterangan: result.keterangan,
      kategori_id: result.kategori_id,
    });
  });

  console.log(initValues);

  console.log(dataFiltered);

  const updateReport = (ids, values) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify(values);

      const result = instance.put(`/laporan/update/id/${ids}`, body, config);
      setIds("");
      fetchReportUserAndCategory();
    } catch (error) {
      alert(error);
    }
  };

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      updateReport(ids, values);
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
  } = formik;

  const columnNames = [
    { names: "No", selector: "no", width: "7%" },
    { names: "User Pelapor", selector: "user_info" },
    { names: "Detail Laporan", selector: "report_detail" },
    {
      names: "Kategori",
      selector: "report_kategori",
      width: "15%",
      center: true,
    },
    { names: "Aksi", selector: "option", width: "11%", center: true },
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

  const dataTable = reports.map((result, index) => {
    const BadgeProgress = (
      <Badge
        colorScheme={
          parseInt(result.status_id) === 4
            ? "blue"
            : parseInt(result.status_id) === 3
            ? "yellow"
            : parseInt(result.status_id) === 2
            ? "red"
            : "green"
        }
        variant="solid"
      >
        {result.nama}
      </Badge>
    );
    return {
      id: index,
      no: index + 1,
      nama_lengkap: result.nama_lengkap,
      jenis_kelamin: result.jenis_kelamin,
      email: result.email,
      no_telp: result.no_telp,
      jabatan: result.jabatan,
      status: result.nama,
      jenis_kerusakan: result.jenis_kerusakan,
      status_id: result.status_id,
      lokasi: result.lokasi,
      keterangan: result.keterangan,
      keterangan_admin: result.keterangan_admin,
      keterangan_teknisi: result.keterangan_teknisi,
      tanggal_lapor: moment(result.tanggal_lapor).format("Do MMMM YYYY"),
      tanggal_pengecekan: moment(result.tanggal_pengecekan).format(
        "Do MMMM YYYY"
      ),
      kategori: result.kategori,
      user_info: (
        <Box my="10">
          <Text fontSize="1.3em" fontWeight="semibold">
            {result.nama_lengkap}
          </Text>
          <Text color={fontColor}>{result.email}</Text>
        </Box>
      ),
      report_detail: (
        <Box my="10">
          <Text fontSize="1.3em" fontWeight="semibold">
            {result.jenis_kerusakan}
          </Text>
          <Text color={fontColor}>{result.lokasi}</Text>
          {BadgeProgress}
        </Box>
      ),
      report_kategori: (
        <Text fontSize="1.3em" textTransform="capitalize">
          {result.kategori}
        </Text>
      ),
      option: (
        <OptionButtonMenuTable setAndOpen={() => openAndSetIds(result.lId)} />
      ),
      progress: BadgeProgress,
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
      item.status.toLowerCase().includes(filterText.toLowerCase()) ||
      item.tanggal_lapor.toLowerCase().includes(filterText.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(filterText.toLowerCase()) ||
      item.jenis_kerusakan.toLowerCase().includes(filterText.toLowerCase()) ||
      item.keterangan.toLowerCase().includes(filterText.toLowerCase()) ||
      item.report_kategori.toLowerCase().includes(filterText.toLowerCase())
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

  const fontHeading = colorMode === "dark" ? "yellow.500" : "gray.900";
  const fontLabel = colorMode === "dark" ? "yellow.300" : "gray.700";
  const fontDesc = colorMode === "dark" ? "yellow.100" : "gray.500";

  const ExpandedComponent = ({ data }) => (
    <Box display="flex" py="5" justifyContent="space-around">
      <Box width="50%">
        <Heading
          fontSize="1.2em"
          color={fontHeading}
          textTransform="uppercase"
          pt="5"
        >
          User Detail
        </Heading>
        <Box px="5">
          <Box>
            <FormLabel color={fontLabel} fontWeight="bold">
              Nama Lengkap
            </FormLabel>
            <Text
              fontSize="1.1em"
              color={fontDesc}
              textTransform="capitalize"
              fontWeight="semibold"
            >
              {data.nama_lengkap}
            </Text>
          </Box>
          <Box py="3">
            <FormLabel color={fontLabel} fontWeight="bold">
              Jenis Kelamin
            </FormLabel>
            <Text
              fontSize="1.1em"
              color={fontDesc}
              textTransform="capitalize"
              fontWeight="semibold"
            >
              {data.jenis_kelamin}
            </Text>
          </Box>
          <Box>
            <FormLabel color={fontLabel} fontWeight="bold">
              Email
            </FormLabel>
            <Text
              fontSize="1.1em"
              color={fontDesc}
              textTransform="capitalize"
              fontWeight="semibold"
            >
              {data.email}
            </Text>
          </Box>
          <Box py="3">
            <FormLabel color={fontLabel} fontWeight="bold">
              No Telepon
            </FormLabel>
            <Text
              fontSize="1.1em"
              color={fontDesc}
              textTransform="capitalize"
              fontWeight="semibold"
            >
              {data.no_telp}
            </Text>
          </Box>
          <Box>
            <FormLabel color={fontLabel} fontWeight="bold">
              Jabatan
            </FormLabel>
            <Text
              fontSize="1.1em"
              color={fontDesc}
              textTransform="capitalize"
              fontWeight="semibold"
            >
              {data.jabatan}
            </Text>
          </Box>
        </Box>
      </Box>
      <Box width="50%">
        <Heading
          fontSize="1.2em"
          color={fontHeading}
          textTransform="uppercase"
          pt="5"
        >
          Report Detail
        </Heading>
        <Box px="5">
          <Box py="3">{data.progress}</Box>
          <Box py="3">
            <FormLabel color={fontLabel} fontWeight="bold">
              Kategori
            </FormLabel>
            <Text
              fontSize="1.1em"
              color={fontDesc}
              textTransform="capitalize"
              fontWeight="semibold"
            >
              Mechanical Electronic
            </Text>
          </Box>
          <Box>
            <FormLabel color={fontLabel} fontWeight="bold">
              Jenis Kerusakan
            </FormLabel>
            <Text
              fontSize="1.1em"
              color={fontDesc}
              textTransform="capitalize"
              fontWeight="semibold"
            >
              {data.jenis_kerusakan}
            </Text>
          </Box>
          <Box py="3">
            <FormLabel color={fontLabel} fontWeight="bold">
              Lokasi
            </FormLabel>
            <Text
              fontSize="1.1em"
              color={fontDesc}
              textTransform="capitalize"
              fontWeight="semibold"
            >
              {data.lokasi}
            </Text>
          </Box>
          <Box>
            <FormLabel color={fontLabel} fontWeight="bold">
              Keterangan
            </FormLabel>
            <Text
              fontSize="1.1em"
              color={fontDesc}
              textTransform="capitalize"
              fontWeight="semibold"
            >
              {data.keterangan}
            </Text>
          </Box>
          <Box display="flex" py="3">
            <Box>
              <FormLabel color={fontLabel} fontWeight="bold">
                Tanggal Lapor
              </FormLabel>
              <Text
                fontSize="1.1em"
                color={fontDesc}
                textTransform="capitalize"
                fontWeight="semibold"
              >
                {data.tanggal_lapor}
              </Text>
            </Box>
            <Box pl="5">
              <FormLabel color={fontLabel} fontWeight="bold">
                Tanggal Pengecekan
              </FormLabel>
              <Text
                fontSize="1.1em"
                color={fontDesc}
                textTransform="capitalize"
                fontWeight="semibold"
              >
                {data.tanggal_pengecekan}
              </Text>
            </Box>
          </Box>
          <Box>
            <FormLabel color={fontLabel} fontWeight="bold">
              Keterangan Admin
            </FormLabel>
            <Text
              fontSize="1.1em"
              color={fontDesc}
              textTransform="capitalize"
              fontWeight="semibold"
            >
              {data.keterangan_admin}
            </Text>
          </Box>
          <Box>
            <FormLabel color={fontLabel} fontWeight="bold">
              Keterangan Teknisi
            </FormLabel>
            <Text
              fontSize="1.1em"
              color={fontDesc}
              textTransform="capitalize"
              fontWeight="semibold"
            >
              {data.keterangan_teknisi}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );

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

  const userOption = user.map((result, index) => {
    return (
      <option value={result.uId} key={index}>
        {result.email}
      </option>
    );
  });

  const categoryOption = category.map((result, index) => {
    return (
      <option value={result.id} key={index}>
        {result.nama}
      </option>
    );
  });

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
                id="pelapor_id"
                pt="5"
                isInvalid={Boolean(touched.pelapor_id && errors.pelapor_id)}
              >
                <FormLabel textTransform="capitalize">Pelapor</FormLabel>
                <Select
                  placeholder="Pilih User"
                  name="pelapor_id"
                  {...getFieldProps("pelapor_id")}
                  onBlur={handleBlur}
                >
                  {userOption}
                </Select>
                <FormErrorMessage>
                  {touched.pelapor_id && errors.pelapor_id}
                </FormErrorMessage>
              </FormControl>
              {InputTypeText("jenis_kerusakan")}
              {InputTypeText("lokasi")}
              {InputTypeText("keterangan")}
              <FormControl
                id="kategori_id"
                pt="5"
                isInvalid={Boolean(touched.kategori_id && errors.kategori_id)}
              >
                <FormLabel textTransform="capitalize">Kategori</FormLabel>
                <Select
                  placeholder="Pilih Kategori"
                  name="kategori_id"
                  {...getFieldProps("kategori_id")}
                  onBlur={handleBlur}
                >
                  {categoryOption}
                </Select>
                <FormErrorMessage>
                  {touched.kategori_id && errors.kategori_id}
                </FormErrorMessage>
              </FormControl>
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
          expandableRows
          expandableRowsComponent={ExpandedComponent}
        />
      </Box>
    </Box>
  );
};

export default TableUserAccount;
