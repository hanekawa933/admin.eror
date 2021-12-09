import { useState, useEffect, useRef } from "react";
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
  useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import instance from "../axios.default";

const FormCategory = () => {
  const toast = useToast();
  const logoRef = useRef();
  const handleReset = () => {
    logoRef.current.value = []; //THIS RESETS THE FILE FIELD
  };

  const Schema = Yup.object().shape({
    nama: Yup.string().required("Input tidak boleh kosong"),
    kd_kategori: Yup.string().required("Input tidak boleh kosong"),
    icon: Yup.string().required("File tidak boleh kosong"),
  });

  const createCategory = async (data) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      await instance.post("/kategori", data, config);
      toast({
        title: "Berhasil",
        description: "Data kategori berhasil ditambahkan",
        status: "success",
        duration: 2000,
        position: "top",
      });
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
    initialValues: {
      nama: "",
      kd_kategori: "",
      icon: "",
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const formData = new FormData();
      formData.append("nama", values.nama);
      formData.append("kd_kategori", values.kd_kategori);
      formData.append("icon", values.icon);
      await createCategory(formData);
      resetForm({});
      handleReset();
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
    setFieldValue,
  } = formik;

  const changedHandler = (event) => {
    setFieldValue("icon", event.currentTarget.files[0]);
  };

  return (
    <Box mt="5">
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
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
            <FormErrorMessage>{touched.nama && errors.nama}</FormErrorMessage>
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
              ref={logoRef}
              accept=".svg, .png"
            />
            <FormErrorMessage>{touched.icon && errors.icon}</FormErrorMessage>
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

export default FormCategory;
