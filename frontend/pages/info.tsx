import Container from "react-bootstrap/Container";
import { useSession, signIn } from "next-auth/client";
import { Form, Button, Alert } from "react-bootstrap";
import React, { useState } from "react";
import Link from "next/link";
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

const askFoodLogin = () => (
  <p>
    <strong>
      {" "}
      <a onClick={() => signIn()} href="#food" className="link-primary">
        Sign in
      </a>{" "}
      to fill out the allergy box!
    </strong>
  </p>
);

const submitFoodPreference = (session, setFeedback) => async (event) => {
  event.preventDefault();
  const res = await fetch("/api/backend/allergy", {
    body: JSON.stringify({
      user_email: session.user.email,
      food_preference: event.target[0].value,
    }),
    headers: { "Content-Type": "application/json" },
    method: "PUT",
  });
  if (res.status === 200) {
    setFeedback({ variant: "success", message: "Updated your food prefences" });
    return true;
  }
  setFeedback({ variant: "danger", message: await res.text() });
  return false;
};

const ShowFoodBox = ({ session }) => {
  const [feedback, setFeedback] = useState({ variant: "danger", message: "" });
  return (
    <Form onSubmit={submitFoodPreference(session, setFeedback)}>
      <Form.Group controlId="description">
        <Form.Control
          as="textarea"
          rows={5}
          defaultValue={session.user.foodPreference}
          size="sm"
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="m-2">
        Send food preference
      </Button>
      {feedback.message ? (
        <Alert
          className="m-2"
          variant={feedback.variant}
          onClose={() => setFeedback({ variant: "danger", message: "" })}
          dismissible
        >
          <Alert.Heading>
            {feedback.variant === "success"
              ? "success"
              : "Oh snap! You got an error!"}
          </Alert.Heading>
          <p>{feedback.message}</p>
        </Alert>
      ) : undefined}
    </Form>
  );
};

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
            <p>
              The wedding will be held on September 4th 2021 at{" "}
              <Link href="/venue">
                <a>Syverstad gård</a>
              </Link>
            </p>
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
            {session ? <ShowFoodBox session={session} /> : askFoodLogin()}
          </Container>
        </main>
        <Footer />
      </div>
    </>
  );
}
