import Container from "react-bootstrap/Container";
import { useSession } from "next-auth/client";
import React from "react";
import MyNavbar from "../components/navbar";
import Footer from "../components/footer";
import Header from "../components/header";

import styles from "../styles/Home.module.scss";

const renderPair = ({ k, v }) => (
  <div key={k} className="d-flex justify-content-evenly">
    <div className="p-1 pl-5">
      <strong>{k}</strong>
    </div>
    <div className="p-1 user-select-all">{v}</div>
  </div>
);

export default function Info(): React.ReactNode {
  const [session] = useSession();
  const program = [
    { k: "13:00", v: "Arrival" },
    { k: "14:00", v: "Wedding ceremony" },
    { k: "14:30", v: "Cake and bubbles" },
    { k: "17:00", v: "Dinner" },
    { k: "21:00", v: "Dance floor opens" },
    { k: "02:00", v: "Party's over" },
  ];

  const contactInformationRoaldAstrid = [
    { k: "Astrid", v: "+47 992 68 1 71" },
    { k: "Roald", v: "+47 413 60 753" },
    { k: "Email:", v: "roaldstorm@gmail.com" },
  ];
  const contactInformationJelma = [
    { k: "Jelma", v: "+31 6 47 40 38 23" },
    { k: "Email:", v: "weddingofranda@gmail.com" },
  ];
  return (
    <>
      <div className={styles.container}>
        <MyNavbar />
        <Header />
        <main className={styles.main}>
          <Container>
            <h2>Program</h2>
            {program.map(renderPair)}
            <h2>Contact Information</h2>
            <p>Feel free to contact us if you have any questions.</p>
            {contactInformationRoaldAstrid.map(renderPair)}
            <p className={styles.infoText}>
              If you want to give a speech or contribute with other kinds of
              entertainment, contact our toastmaster Jelma van Santen.
            </p>
            {contactInformationJelma.map(renderPair)}
            <h2>Attire</h2>

            <ul>
              <li>Suit</li>
              <li>Dress, long or short</li>
            </ul>
            <p className={styles.infoText}>
              We plan to have the ceremony outdoors in the garden, if the
              weather allows it. Because of that we do not recommend wearing
              your sharpest stilettos.
            </p>

            <p className={styles.infoText}>
              Depending on the weather it might be a good idea to bring a
              jacket, cardigan or shawl to throw over your shoulders. September
              evenings can get a little chilly in Oslo.
            </p>
            <p className={styles.infoText}>
              If you plan to walk the shortest way to Holmen Fjordhotell at the
              end of the evening, we recommend you bring a pair of shoes that
              can handle 700 m of walking on a forest path.
            </p>
            <h2 id="food">Food</h2>
            <p className={styles.infoText}>
              If you have any allergies or other needs regarding food and
              drinks, please {!session && "sign in and"} leave a comment in the
              box below.
            </p>
          </Container>
        </main>
        <Footer />
      </div>
    </>
  );
}
