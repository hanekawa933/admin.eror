import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Text,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Select,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import instance from "../axios.default";

const FormReport = () => {
  const [create, setCreate] = useState([]);
  const [user, setUser] = useState([]);
  const [category, setCategory] = useState([]);

  const fetchUserAndCategory = async () => {
    try {
      const users = await instance.get("/user");
      const category = await instance.get("/kategori");
      setUser(users.data.data);
      setCategory(category.data.data);
    } catch (error) {
      alert(error);
    }
  };

  console.log(user);
  useEffect(() => {
    fetchUserAndCategory();
  }, []);

  const Schema = Yup.object().shape({
    pelapor_id: Yup.number().required("Input tidak boleh kosong"),
    jenis_kerusakan: Yup.string().required("Input tidak boleh kosong"),
    lokasi: Yup.string().required("Input tidak boleh kosong"),
    keterangan: Yup.string().required(),
    kategori_id: Yup.number().required("Input tidak boleh kosong"),
  });

  const createReport = async (data) => {
    const body = JSON.stringify(data);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const result = await instance.post("/laporan", body, config);
      setCreate(result.data.data);
    } catch (error) {
      alert(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      pelapor_id: "",
      jenis_kerusakan: "",
      lokasi: "",
      keterangan: "",
      kategori_id: "",
    },
    validationSchema: Schema,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      createReport(values);
      setSubmitting(false);
      resetForm({});
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

  const userOption = user.map((result, index) => {
    return (
      <option value={result.id} key={index}>
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

  return (
    <Box mt="5">
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
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
          <Box display="flex" justifyContent="end">
            <Button
              type="submit"
              colorScheme="orange"
              isLoading={isSubmitting}
              mt="5"
            >
              Masukan Data
            </Button>
          </Box>
        </Form>
      </FormikProvider>
    </Box>
  );
};

export default FormReport;
