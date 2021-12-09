import { useState, useEffect, useRef } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import instance from "../axios.default";

const FormFaq = () => {
  const toast = useToast();

  const Schema = Yup.object().shape({
    pertanyaan: Yup.string().required("Input tidak boleh kosong"),
    jawaban: Yup.string().required("Input tidak boleh kosong"),
  });

  const createCategory = async (data) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const result = await instance.post("/faq", data, config);
      toast({
        title: "Berhasil",
        description: "FAQ berhasil dibuat.",
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Gagal",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      pertanyaan: "",
      jawaban: "",
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await createCategory(values);
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

  const InputTypeText = (label) => {
    return (
      <FormControl
        id={label}
        pt="5"
        isInvalid={Boolean(touched[label] && errors[label])}
      >
        <FormLabel textTransform="capitalize">{label}</FormLabel>
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

  const changedHandler = (event) => {
    setFieldValue("icon", event.currentTarget.files[0]);
  };

  return (
    <Box mt="5">
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          {InputTypeText("pertanyaan")}
          {InputTypeText("jawaban")}
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

export default FormFaq;
