import Link from "next/link";
import { Image } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import MyNavbar from "../components/navbar";
import Footer from "../components/footer";
import Header from "../components/header";

import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/Home.module.scss";

export default function Home(): React.ReactNode {
  return (
    <div className={styles.container_background}>
      <MyNavbar />
      <Header />
      <Container>
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
            Hello everybody! We are excited to finally welcome you all to
            celebrate our wedding with us this fall on September 4th 2021. We
            have all gotten used to plans changing several times before they are
            realised. So, having this website allows us to keep a central thing
            up to date with correct information.
          </p>
          <p className={`${styles.description} order-4`}>
            You can find out about the{" "}
            <Link href="/venue">
              <a>venue</a>
            </Link>
            , our{" "}
            <Link href="/wishlist">
              <a>wish list</a>
            </Link>{" "}
            and other{" "}
            <Link href="/info">
              <a>practical information</a>
            </Link>{" "}
            around the website. We appreciate it if you sign in to the page
            using your email (or optionally a Google account), to let us know if
            you have any dietary needs, or to claim a present from the wish
            list.
          </p>
        </main>
      </Container>
      <Footer />
    </div>
  );
}
