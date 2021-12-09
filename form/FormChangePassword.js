import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";
import instance from "../axios.default";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import { useState } from "react";

const FormChangePassword = () => {
  const [hidden, setHidden] = useState({
    old: false,
    new: false,
    verify: false,
  });
  const toast = useToast();
  const Schema = Yup.object().shape({
    password_lama: Yup.string().required("Input tidak boleh kosong"),
    password_baru: Yup.string()
      .min(8, "Password minimal harus terdiri dari 8 karakter")
      .required("Input tidak boleh kosong"),
    password_verify: Yup.string()
      .oneOf([Yup.ref("password_baru"), null], "Passwords tidak sama")
      .required("Input tidak boleh kosong"),
  });

  const updateUserAccount = async (values) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify(values);
      const result = await instance.put(
        `/SuperAdmin/update_password`,
        body,
        config
      );
      toast({
        title: "Berhasil Update",
        description: "Password anda berhasil diubah!",
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Gagal Update",
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
      password_lama: "",
      password_baru: "",
      password_verify: "",
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm }) => {
      await updateUserAccount(values);
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

  const InputTypePassword = (label, func, field) => {
    return (
      <FormControl
        id={label}
        pt="5"
        isInvalid={Boolean(touched[label] && errors[label])}
      >
        <FormLabel textTransform="capitalize">
          {label.split("_").join(" ")}
        </FormLabel>
        <InputGroup>
          <Input
            type={field ? "text" : "password"}
            name={label}
            {...getFieldProps(label)}
            onBlur={handleBlur}
          />
          <InputRightElement mr="3" cursor="pointer" onClick={() => func()}>
            {field ? <ViewOffIcon w={6} h={6} /> : <ViewIcon w={6} h={6} />}
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{touched[label] && errors[label]}</FormErrorMessage>
      </FormControl>
    );
  };

  return (
    <>
      <Box>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box>
              {InputTypePassword(
                "password_lama",
                () => setHidden({ ...hidden, old: !hidden.old }),
                hidden.old
              )}
              {InputTypePassword(
                "password_baru",
                () => setHidden({ ...hidden, new: !hidden.new }),
                hidden.new
              )}
              {InputTypePassword(
                "password_verify",
                () => setHidden({ ...hidden, verify: !hidden.verify }),
                hidden.verify
              )}
              <Box display="flex" justifyContent="flex-end">
                <Button
                  colorScheme="orange"
                  mt="5"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Ganti Password
                </Button>
              </Box>
            </Box>
          </Form>
        </FormikProvider>
      </Box>
    </>
  );
};

export default FormChangePassword;
