import { ChakraProvider } from "@chakra-ui/react";
import setAuthToken from "../middlewares/setAuthToken";
import { TempProvider } from "../context/TempContext";
import Cookies from "js-cookie";

if (typeof window !== "undefined") {
  if (Cookies.get("token")) {
    setAuthToken(Cookies.get("token"));
  }
}

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <TempProvider>
        <Component {...pageProps} />
      </TempProvider>
    </ChakraProvider>
  );
}

export default MyApp;
