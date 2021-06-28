import Link from "next/link";
import { Image } from "react-bootstrap";
import MyNavbar from "../components/navbar";
import Footer from "../components/footer";
import Header from "../components/header";

import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/Home.module.scss";

export default function Home(): React.ReactNode {
  return (
    <>
      <div className={styles.container_background}>
        <MyNavbar />
        <Header />
        <main className={styles.main}>
          <h1 className={styles.title}>Astrid & Roald are getting married!</h1>
          <Image src="/astrid_roald.jpeg" fluid rounded />
          <p className={styles.description}>
            There will be a little more story here later on! Probably also some
            planning stuff!! Possible even pictures of the{" "}
            <Link href="/venue">
              <a>venue</a>
            </Link>
            .
          </p>
        </main>
        <Footer />
      </div>
    </>
  );
}
