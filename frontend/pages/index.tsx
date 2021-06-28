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
          <Image
            className="order-0 order-sm-2"
            src="/astrid_roald.jpeg"
            fluid
            rounded
          />

          <h1 className={`${styles.title} order-1`}>
            Astrid & Roald are getting married!
          </h1>

          <p className={`${styles.description} order-3`}>
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
