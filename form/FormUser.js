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
  useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import instance from "../axios.default";

const FormUser = () => {
  const toast = useToast();
  const [role, setRole] = useState([]);
  const Schema = Yup.object().shape({
    nama_lengkap: Yup.string().required("Input tidak boleh kosong"),
    password: Yup.string()
      .required("Input tidak boleh kosong")
      .min(8, "Password minimal harus terdiri dari 8 karakter"),
    password_verify: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords tidak sama")
      .required(),
    jenis_kelamin: Yup.string().required("Input tidak boleh kosong"),
    email: Yup.string()
      .required("Input tidak boleh kosong")
      .email("Email tidak valid"),
    no_telp: Yup.number()
      .typeError("Input harus berupa angka")
      .required("Input tidak boleh kosong"),
    jabatan: Yup.string().required("Input tidak boleh kosong"),
    role_id: Yup.number().required("Input tidak boleh kosong"),
  });

  const fetchRole = async () => {
    try {
      const role = await instance.get("/role");
      setRole(role.data.data);
    } catch (error) {
      alert(error);
    }
  };

  const createUser = async (data) => {
    const body = JSON.stringify(data);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const result = await instance.post("/user", body, config);
      toast({
        title: "Berhasil",
        description: "User berhasil dibuat.",
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

  useEffect(() => {
    fetchRole();
  }, []);

  const formik = useFormik({
    initialValues: {
      nama_lengkap: "",
      password: "",
      password_verify: "",
      jenis_kelamin: "",
      email: "",
      no_telp: "",
      jabatan: "",
      role_id: "",
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm }) => {
      await createUser(values);
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

  const roleOption = role.map((result, index) => {
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
          {InputTypeText("nama_lengkap")}
          <Box display="flex" flexDir={["column", "row"]}>
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
              ml={["0", "5"]}
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
          <FormControl
            id="jenis_kelamin"
            pt="5"
            isInvalid={Boolean(touched.jenis_kelamin && errors.jenis_kelamin)}
          >
            <FormLabel textTransform="capitalize">Jenis Kelamin</FormLabel>
            <Select
              placeholder="Pilih Jenis Kelamin"
              name="jenis_kelamin"
              {...getFieldProps("jenis_kelamin")}
              onBlur={handleBlur}
            >
              <option value="Laki-Laki">Laki-Laki</option>
              <option value="Perempuan">Perempuan</option>
            </Select>
            <FormErrorMessage>
              {touched.jenis_kelamin && errors.jenis_kelamin}
            </FormErrorMessage>
          </FormControl>
          {InputTypeText("email")}
          {InputTypeText("no_telp")}
          {InputTypeText("jabatan")}
          <FormControl
            id="role_id"
            pt="5"
            isInvalid={Boolean(touched.role_id && errors.role_id)}
          >
            <FormLabel textTransform="capitalize">Role</FormLabel>
            <Select
              placeholder="Pilih Role"
              name="role_id"
              {...getFieldProps("role_id")}
              onBlur={handleBlur}
            >
              {roleOption}
            </Select>
            <FormErrorMessage>
              {touched.role_id && errors.role_id}
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

export default FormUser;
