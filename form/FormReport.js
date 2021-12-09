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
  Select,
  Grid,
  Image,
  useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import instance from "../axios.default";

const FormReport = () => {
  const toast = useToast();
  const [user, setUser] = useState([]);
  const [category, setCategory] = useState([]);
  const [preview, setPreview] = useState([]);

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
    gambar: Yup.array().nullable(),
  });

  const createReport = async (data) => {
    // const body = JSON.stringify(data);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const result = await instance.post("/laporan", data, config);
      toast({
        title: "Berhasil",
        description: "Laporan berhasil dibuat.",
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (error) {
      console.log(error.response);
      toast({
        title: "Gagal",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };

  const gambarRef = useRef();

  const handleReset = () => {
    gambarRef.current.value = null; //THIS RESETS THE FILE FIELD
  };

  const formik = useFormik({
    initialValues: {
      pelapor_id: "",
      jenis_kerusakan: "",
      lokasi: "",
      keterangan: "",
      kategori_id: "",
      gambar: [],
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("jenis_kerusakan", values.jenis_kerusakan);
      formData.append("lokasi", values.lokasi);
      formData.append("keterangan", values.keterangan);
      for (let i = 0; i < values.gambar.length; i++) {
        formData.append("gambar[]", values.gambar[i]);
      }
      formData.append("kategori_id", values.kategori_id);
      formData.append("pelapor_id", values.pelapor_id);
      await createReport(formData);
      resetForm({});
      handleReset();
      setPreview([]);
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

  const fileobj = [];

  // console.log(values);

  // console.log(values.gambar);
  const changedHandler = (event) => {
    let files = event.target.files;
    fileobj.push(files);
    let reader;
    setFieldValue("gambar", event.currentTarget.files);

    preview = [];

    for (var i = 0; i < fileobj[0].length; i++) {
      reader = new FileReader();
      reader.readAsDataURL(fileobj[0][i]);
      reader.onload = (event) => {
        preview.push(event.target.result); // update the array instead of replacing the entire value of preview
        setPreview([...preview]); // spread into a new array to trigger rerender
      };
    }
  };

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
          <FormControl
            id="gambar"
            isInvalid={Boolean(touched.gambar && errors.gambar)}
            mt="5"
          >
            <FormLabel>Bukti Laporan</FormLabel>
            <Input
              variant="flushed"
              type="file"
              name="gambar[]"
              onBlur={handleBlur}
              onChange={(event) => changedHandler(event)}
              multiple
              ref={gambarRef}
              accept=".png, .jpg, jpeg, .gif, .bmp"
            />
            <FormErrorMessage>
              {touched.gambar && errors.gambar}
            </FormErrorMessage>
          </FormControl>
          <Box display="flex" flexDir="column" mt="3">
            <Box
              as="span"
              fontWeight="semibold"
              textTransform="capitalize"
            ></Box>
            <Grid templateColumns="repeat(3,1fr)" gap={6} mt="3">
              {(preview || []).map((url, index) => (
                <Image src={url} alt="..." key={index} />
              ))}
            </Grid>
          </Box>
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
