import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>3D Book Collections</title>
        <meta name="title" content="3D Book Collections" />
        <meta name="description" content="Explore your books in 3D!" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://3d-book-collections.vercel.app/" />
        <meta property="og:title" content="3D Book Collections" />
        <meta property="og:description" content="Explore your books in 3D!" />
        <meta property="og:image" content="https://3d-book-collections.vercel.app/ogp.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://3d-book-collections.vercel.app/" />
        <meta name="twitter:title" content="3D Book Collections" />
        <meta name="twitter:description" content="Explore your books in 3D!" />
        <meta name="twitter:image" content="https://3d-book-collections.vercel.app/ogp.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
