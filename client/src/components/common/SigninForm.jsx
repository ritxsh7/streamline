import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../../api/modules/user.api";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setUser } from "../../redux/features/userSlice";

const SigninForm = ({ switchAuthState }) => {
  const dispatch = useDispatch();

  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [isDemo, setIsDemo] = useState(false);
  const [username, setUsername] = useState("ritxsshh");
  const [password, setPassword] = useState("12345678");

  const signinForm = useFormik({
    initialValues: {
      password: "",
      username: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(8, "username minimum 8 characters")
        .required("username is required"),
      password: Yup.string()
        .min(8, "password minimum 8 characters")
        .required("password is required"),
    }),
    onSubmit: async (values) => {
      setErrorMessage(undefined);
      setIsLoginRequest(true);
      console.log("asdasdasdasd");
      const { response, err } = await userApi.signin(values);
      setIsLoginRequest(false);

      if (response) {
        signinForm.resetForm();
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
        toast.success("Sign in success");
      }

      if (err) setErrorMessage(err.message);
    },
  });

  const submitDemo = async (e) => {
    e.preventDefault();
    const { response, err } = await userApi.signin({ username, password });
    setIsLoginRequest(false);

    if (response) {
      signinForm.resetForm();
      dispatch(setUser(response));
      dispatch(setAuthModalOpen(false));
      toast.success("Sign in success");
    }

    if (err) setErrorMessage(err.message);
  };

  return (
    <Box
      component="form"
      onSubmit={isDemo ? submitDemo : signinForm.handleSubmit}
    >
      <Stack spacing={3}>
        <TextField
          id="username"
          type="text"
          placeholder="username"
          name="username"
          fullWidth
          value={isDemo ? username : signinForm.values.username}
          onChange={signinForm.handleChange}
          color="success"
          error={
            signinForm.touched.username &&
            signinForm.errors.username !== undefined
          }
          helperText={signinForm.touched.username && signinForm.errors.username}
        />
        <TextField
          id="password"
          type="password"
          placeholder="password"
          name="password"
          fullWidth
          value={isDemo ? password : signinForm.values.password}
          onChange={signinForm.handleChange}
          color="success"
          error={
            signinForm.touched.password &&
            signinForm.errors.password !== undefined
          }
          helperText={signinForm.touched.password && signinForm.errors.password}
        />
      </Stack>

      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isLoginRequest}
      >
        sign in
      </LoadingButton>

      <Button fullWidth sx={{ marginTop: 1 }} onClick={() => switchAuthState()}>
        sign up
      </Button>
      {!isDemo && (
        <>
          <h2 style={{ margin: "1rem 0", color: "white", textAlign: "center" }}>
            OR
          </h2>
          <Button
            variant="outlined"
            sx={{ width: "100%" }}
            onClick={(e) => {
              setIsDemo(true);
            }}
          >
            Use Demo Account
          </Button>
        </>
      )}
      {errorMessage && (
        <Box sx={{ marginTop: 2 }}>
          <Alert severity="error" variant="outlined">
            {errorMessage}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default SigninForm;
