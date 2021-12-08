import Cookie from "js-cookie";
import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Link,
  Box,
  InputRightElement,
  InputGroup,
  useToast,
} from "@chakra-ui/react";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import instance from "../../axios.default";

import { useRouter } from "next/router";

const AuthLogin = () => {
  const toast = useToast();
  const Router = useRouter();
  const [hidden, setHidden] = useState(true);

  const Schema = Yup.object().shape({
    username: Yup.string().required("Username tidak boleh kosong"),
    password: Yup.string().required("Password tidak boleh kosong"),
  });

  const login = async (val) => {
    try {
      const body = JSON.stringify(val);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await instance.post("/SuperAdmin/login", body, config);
      Cookie.set("token", `Bearer ${result.data.token}`);

      instance.defaults.headers.common[
        "x-auth-token"
      ] = `Bearer ${result.data.token}`;

      const user = await instance.get("/user/profile");

      toast({
        title: "Berhasil login",
        status: "success",
        duration: 2000,
        position: "top",
      });

      Router.push("/home");
    } catch (error) {
      toast({
        title: !error.response ? "Server Error" : error.response.data.message,
        description: "Gagal login!",
        status: "error",
        duration: 2000,
        position: "top",
      });
      console.log(error);
    }
  };

  const viewPassword = () => {
    setHidden(!hidden);
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Schema,
    onSubmit: (values, { resetForm, setSubmitting, setFieldValue }) => {
      login(values);
      setTimeout(() => {
        resetForm();
        setFieldValue("username", values.username);
        setSubmitting(false);
      }, 2000);
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    handleBlur,
  } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <FormControl
          id="username"
          isInvalid={Boolean(touched.username && errors.username)}
        >
          <FormLabel>username</FormLabel>
          <Input
            type="text"
            name="username"
            {...getFieldProps("username")}
            onBlur={handleBlur}
          />
          <FormErrorMessage>
            {touched.username && errors.username}
          </FormErrorMessage>
        </FormControl>
        <FormControl
          id="password"
          pt="5"
          isInvalid={Boolean(touched.password && errors.password)}
        >
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={hidden ? "password" : "text"}
              name="password"
              {...getFieldProps("password")}
              onBlur={handleBlur}
            />
            <InputRightElement
              mx="3"
              cursor="pointer"
              onClick={() => viewPassword()}
            >
              {hidden ? <ViewIcon w={6} h={6} /> : <ViewOffIcon w={6} h={6} />}
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            {touched.password && errors.password}
          </FormErrorMessage>
        </FormControl>
        <Button
          type="submit"
          colorScheme="orange"
          w="100%"
          isLoading={isSubmitting}
          mt="5"
        >
          Login
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default AuthLogin;
