import { useSession } from "next-auth/client";
import Router from "next/router";
import React, { useState } from "react";
import {
  Media,
  Button,
  Form,
  Container,
  Col,
  Row,
  Alert,
} from "react-bootstrap";
import useSWR, { mutate } from "swr";

import styles from "../styles/master_list.module.css";
import { Gift } from "../types";

import MyNavbar, { ALLOWED_EDIT_USERS } from "../components/navbar";
import Footer from "../components/footer";
import Header from "../components/header";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

const formatGift = (event, originialGift?: Gift) => {
  return {
    ...(originialGift && { id: originialGift.id }),
    name: event.target.name.value,
    description: event.target.description.value,
    urls: event.target.productLinks.value.split("\n"),
    image_url: event.target.imagelink.value,
    desired_amount: event.target.numberWished.value,
  };
};

const updateGift = async (event, setFeedback, originialGift: Gift) => {
  event.preventDefault();
  const newGift: Gift = formatGift(event, originialGift);
  const res = await fetch("/api/backend/gifts", {
    body: JSON.stringify(newGift),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  if (res.status === 200) {
    setFeedback({ variant: "success", message: "Gift is updated" });
    return;
  }
  setFeedback({ variant: "danger", message: await res.text() });
};

const createGift = async (event, setFeedback) => {
  event.preventDefault();
  const newGift: Gift = formatGift(event);
  const res = await fetch("/api/backend/gifts", {
    body: JSON.stringify(newGift),
    headers: { "Content-Type": "application/json" },
    method: "PUT",
  });
  if (res.status === 200) {
    setFeedback({ variant: "success", message: "New gift created!" });
    mutate("/api/backend/gifts");
    return;
  }
  setFeedback({ variant: "danger", message: await res.text() });
};

const deleteGift = async (_, setFeedback, originialGift: Gift) => {
  const res = await fetch("/api/backend/gifts", {
    body: JSON.stringify({ id: originialGift.id }),
    headers: { "Content-Type": "application/json" },
    method: "DELETE",
  });
  if (res.status === 200) {
    setFeedback({ variant: "success", message: "Gift deleted!" });
    mutate("/api/backend/gifts");
    return;
  }
  setFeedback({ variant: "danger", message: await res.text() });
};

const EditForm = ({ onSubmit, gift }) => {
  const [feedback, setFeedback] = useState({ variant: "danger", message: "" });

  const curriedOnSubmit = (event) => {
    return onSubmit(event, setFeedback, gift);
  };

  return (
    <Form onSubmit={curriedOnSubmit}>
      <Form.Group as={Row} controlId="name">
        <Form.Label column sm={2}>
          Name
        </Form.Label>
        <Col sm={10}>
          <Form.Control defaultValue={gift?.name} size="sm" />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="description">
        <Form.Label column sm={2}>
          Description
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            as="textarea"
            rows={2}
            defaultValue={gift?.description}
            size="sm"
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="productLinks">
        <Form.Label column sm={2}>
          Product links
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            as="textarea"
            rows={4}
            defaultValue={gift?.urls.join("\n")}
            size="sm"
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="imagelink">
        <Form.Label column sm={2}>
          image link
        </Form.Label>
        <Col sm={10}>
          <Form.Control defaultValue={gift?.image_url} size="sm" />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="numberWished">
        <Form.Label column sm={2}>
          Desired amount
        </Form.Label>
        <Col sm={10}>
          <Form.Control defaultValue={gift?.desired_amount} size="sm" />
        </Col>
      </Form.Group>

      <Button variant="primary" type="submit">
        {gift ? "Update" : "Create"}
      </Button>
      {gift && (
        <Button
          variant="danger"
          onClick={(e) => deleteGift(e, setFeedback, gift)}
        >
          Delete
        </Button>
      )}
      {feedback.message ? (
        <Alert
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

export default function AstridList(): React.ReactNode {
  const [session, loading] = useSession();
  const { data, error } = useSWR("/api/backend/gifts", fetcher);

  // The 'new gift form' consist of uncontrolled fields, this basically means that
  // their values are persisted accross re-renders. A clever little idiotic thing
  // I came up with is to simply key that form with an integer. Everytime a new gift
  // is created I increment the key which creates a fresh object and deletes the values..
  // Since all the callbacks have the same form I had to splice the increment call in here.
  const [newGiftCount, setNewGiftCount] = useState(0);
  const curriedGiftCreater = (event, setFeedback) => {
    setNewGiftCount(newGiftCount + 1); // increment gift count to empty bottom form
    createGift(event, setFeedback);
  };

  if (!data || loading) return <div>loading...</div>;
  if (!ALLOWED_EDIT_USERS.includes(session?.user.email)) {
    if (typeof window !== "undefined") {
      Router.push("/");
    }
    return <div>You're not allowed!!! Ya punchy bastard!!!!</div>;
  }
  if (error) return <div>failed to load</div>;

  return (
    <>
      <MyNavbar />
      <Header />
      <Container>
        {data.map((gift) => {
          return (
            <Media key={gift.name} className={styles.media}>
              <img
                width={128}
                height={128}
                className="mr-3"
                src={gift.image_url}
                alt="You need to add a link to a nice pic!"
              />
              <Media.Body>
                <EditForm onSubmit={updateGift} gift={gift} />
              </Media.Body>
            </Media>
          );
        })}
        <Media className={styles.media} key={newGiftCount}>
          <Media.Body>
            <h3>Add a new present</h3>
            <EditForm onSubmit={curriedGiftCreater} gift={undefined} />
          </Media.Body>
        </Media>
      </Container>
      <Footer />
    </>
  );
}
