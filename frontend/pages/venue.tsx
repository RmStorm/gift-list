import dynamic from "next/dynamic";
import Container from "react-bootstrap/Container";
import { Image } from "react-bootstrap";
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
              We are getting married at Syverstad gård in Asker, 25 minutes by
              car from the centre of Oslo. Syverstad is a farm in operation,
              with sheep, bees, chickens and pigs. Next to this they have
              renovated a 300 year old barn to a venue for festivities.
            </p>
            <p>
              We are going for good weather on our big day, and we plan to have
              the ceremony in the garden. The dinner will be served in the barn,
              so there will be no need to travel between venues. The address of
              the venue is Syverstadveien 21, and you can read more about it{" "}
              <a href="https://www.syverstadgard.no/">on their website</a>
            </p>
            <div className="row justify-content-center">
              <div className="col-5">
                <Image
                  src="https://images.squarespace-cdn.com/content/v1/5a992b7d4611a0c9d66f38dd/1604653218215-DQH9IVJVEZ35YV29L3S4/fotografsiwpessar1-23.jpg?format=1000w"
                  rounded
                  fluid
                />
              </div>{" "}
              <div className="col-3">
                <Image
                  src="https://images.squarespace-cdn.com/content/v1/5a992b7d4611a0c9d66f38dd/1566570068788-DORNBFH05055TRTS2UYL/D87C6727-6A04-41DA-A978-1415C2B17A9B.jpeg?format=1000w"
                  rounded
                  fluid
                />
              </div>
            </div>

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
