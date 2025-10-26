import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";

const queryClient = new QueryClient();  

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={1000}
      >
      <Component {...pageProps} />
      </SnackbarProvider>
    </QueryClientProvider>
  )
}

export default MyApp;
