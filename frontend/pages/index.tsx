import Head from "next/head";
import Link from "next/link";
import { Image } from "react-bootstrap";
import MyNavbar from "../components/navbar";

import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/Home.module.css";

export default function Home(): React.ReactNode {
  return (
    <>
      <MyNavbar />

      <div className={styles.container}>
        <Head>
          <title>Astrid & Roald</title>
          <link href="/bouquet.png" rel="icon" />
        </Head>
        <main className={styles.main}>
          <h1 className={styles.title}>Astrid & Roald are getting married!</h1>
          <Image src="/astrid_roald.jpeg" fluid />
          <p className={styles.description}>
            There will be a little more story here later on! Probably also some
            planning stuff!! Possible even pictures of the{" "}
            <Link href="/location">
              <a>location</a>
            </Link>
            .
          </p>
        </main>

        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            rel="noopener noreferrer"
            target="_blank"
          >
            Powered by{" "}
            <img alt="Vercel Logo" className={styles.logo} src="/vercel.svg" />
          </a>
        </footer>
      </div>
    </>
  );
}
