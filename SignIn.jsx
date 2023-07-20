import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  signIn,
  signOut,
  selectUser,
  setPost,
} from "../redux/features/SignInSlice";
import {
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  firestore,
  signInWithGoogle,
} from "../firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="#">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
export default function Google() {
  const [user, setuser] = React.useState({
    firstname: "",
    lastname: "",
    username: "",
    imgurl: "",
  });

  const theme = createTheme();
  const dispatch = useDispatch();
  const curr = useSelector(selectUser);
  const navigate = useNavigate();
  const [use, loading, error] = useAuthState(auth);
  const login = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, user.email, user.password)
      .then((userAuth) => {})
      .catch((err) => {
        alert(err);
      });
  };
  useEffect(() => {
    if (loading) {
      return;
    }
    if (use) {
      const uid = use.uid;
      const getuser = async () => {
        const data = [];
        const docRef = doc(firestore, "users", uid);
        const docSnap = await getDoc(docRef);
        dispatch(signIn({ users: docSnap.data() }));
      };
      const getPosts = async () => {
        const data = [];
        const posts = await getDocs(collection(firestore, "posts"));
        posts.forEach((post) => {
          data.push(post.data());
        });
        console.log(data);
        dispatch(
          setPost({
            data,
          })
        );
      };
      getPosts();
      getuser();
      navigate("/homepage");
    }
  }, [user, loading]);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={user.email}
              onChange={(e) => setuser({ ...user, email: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={user.password}
              onChange={(e) => setuser({ ...user, password: e.target.value })}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 2,
              }}
              onClick={login}>
              Sign In
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                mb: 2,
              }}
              onClick={signInWithGoogle}>
              Sign In With Google
            </Button>
            <Grid
              container
              sx={{
                mt: 2,
                mb: 2,
              }}>
              <Grid item>
                <Link href="/Singup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
