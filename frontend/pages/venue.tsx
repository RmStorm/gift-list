import dynamic from "next/dynamic";
import Container from "react-bootstrap/Container";
import MyNavbar from "../components/navbar";
import Footer from "../components/footer";
import Header from "../components/header";

import styles from "../styles/Home.module.scss";

function Location(): React.ReactNode {
  const Map = dynamic(() => import("../components/map"), { ssr: false });

  return (
    <>
      <div className={styles.container}>
        <MyNavbar />
        <Header>
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
            integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
            crossOrigin=""
          />
        </Header>
        <main className={styles.main}>
          <Container>
            <h2 className="text-center">Venue</h2>
            <p>
              The venue is{" "}
              <a href="https://www.syverstadgard.no/">Syverstad gård</a>
            </p>
            <h2 className="text-center">Accomodation</h2>
            <p>
              Holmen Fjordhotell is a 10 minute walk from the venue (through a
              small forest), right by the sea. We have reserved rooms for the
              guests who want to book a room close by. If you give our names and
              our address (Pilotveien 10, 0770 Oslo) upon booking you will get a
              10 % discount on the room. The prices listed below are already
              discounted.
            </p>
            <ul>
              <li>Single room: 1035 kr (1235 kr with a view)</li>
              <li>Double room: 1305 kr (1505 kr with a view)</li>
            </ul>
            <p>
              We hope that everybody who stays at the hotel will join us for a
              morning swim in the sea and a delicious breakfast afterwards.
            </p>
          </Container>
        </main>

        <Map />
        <Footer />
      </div>
    </>
  );
}

export default Location;
