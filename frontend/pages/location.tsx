import Link from "next/link";
import dynamic from "next/dynamic";
import MyNavbar from "../components/navbar";
import Footer from "../components/footer";
import Header from "../components/header";

import styles from "../styles/Home.module.css";

function Location(): React.ReactNode {
  const Map = dynamic(() => import("../components/map"), { ssr: false });

  return (
    <>
      <MyNavbar />
      <div className={styles.container}>
        <Header>
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
            integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
            crossOrigin=""
          />
        </Header>
        <h1>Location</h1>{" "}
        <h2>
          <Link href="/">
            <a>Back to frontpage</a>
          </Link>
        </h2>
        <Map />
        <Footer />
      </div>
    </>
  );
}

export default Location;
