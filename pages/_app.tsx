import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>3D Book Collections</title>
        <meta property="og:description" content="Explore your books in 3D!" />
        <meta property="og:image" content="https://3d-book-collections-krot.vercel.app/ogp.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
