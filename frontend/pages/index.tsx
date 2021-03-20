import Head from "next/head";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/Home.module.css";

export default function Home(): React.ReactNode {
  return (
    <div className={styles.container}>
      <Head>
        <title>Astrid & Roald</title>

        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Astrid & Roald gaan trouwen!</h1>

        <p className={styles.description}>
          Get started by editing{" "}
          <Link href="/location">
            <a>location</a>
          </Link>
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          {" "}
          <Link href="/index_old">
            <a>oldindex</a>
          </Link>
        </div>
        <div className={styles.grid}>
          {" "}
          <Link href="/gifts">
            <a>gifts</a>
          </Link>
        </div>
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
  );
}
