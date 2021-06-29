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
import { CaretUpFill, CaretDownFill, Trash } from "react-bootstrap-icons";

import useSWR, { mutate } from "swr";

import styles from "../styles/master_list.module.css";
import { Gift } from "../types";

import MyNavbar, { ALLOWED_EDIT_USERS } from "../components/navbar";
import Footer from "../components/footer";
import Header from "../components/header";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

const swapGifts = async (event, newPosition, oldPosition) => {
  event.preventDefault();

  const res = await fetch("/api/backend/swap_gifts", {
    body: JSON.stringify({ newPosition, oldPosition }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  if (res.status === 200) {
    // setFeedback({ variant: "success", message: "New gift created!" });
    mutate("/api/backend/gifts");
    return true;
  }
  // setFeedback({ variant: "danger", message: await res.text() });
  return false;
};

const formatGift = (event, originialGift?: Gift) => {
  return {
    ...(originialGift && {
      id: originialGift.id,
      gift_order: originialGift.gift_order,
    }),
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
    mutate("/api/backend/gifts");
    return;
  }
  setFeedback({ variant: "danger", message: await res.text() });
};

const createGift = async (event, setFeedback, giftOrder) => {
  event.preventDefault();
  const newGift: Gift = { ...formatGift(event), gift_order: giftOrder };

  const res = await fetch("/api/backend/gifts", {
    body: JSON.stringify(newGift),
    headers: { "Content-Type": "application/json" },
    method: "PUT",
  });
  if (res.status === 200) {
    setFeedback({ variant: "success", message: "New gift created!" });
    mutate("/api/backend/gifts");
    return true;
  }
  setFeedback({ variant: "danger", message: await res.text() });
  return false;
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

const EditForm = ({
  onSubmit,
  gift,
  giftBefore = undefined,
  giftAfter = undefined,
}) => {
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
      <>
        <Button variant="primary" type="submit">
          {gift ? "Update" : "Create"}
        </Button>
        {gift && (
          <>
            {" "}
            <Button
              variant="danger"
              onClick={(e) => deleteGift(e, setFeedback, gift)}
            >
              Delete <Trash />
            </Button>{" "}
            {giftBefore && (
              <Button
                variant="info"
                onClick={(e) => swapGifts(e, giftBefore, gift.gift_order)}
              >
                <CaretUpFill />
              </Button>
            )}{" "}
            {giftAfter && (
              <Button
                variant="info"
                onClick={(e) => swapGifts(e, giftAfter, gift.gift_order)}
              >
                <CaretDownFill />
              </Button>
            )}
          </>
        )}
      </>
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

const renderGift = (gift: Gift, giftBefore?: number, giftAfter?: number) => {
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
        <EditForm
          onSubmit={updateGift}
          gift={gift}
          giftBefore={giftBefore}
          giftAfter={giftAfter}
        />
      </Media.Body>
    </Media>
  );
};

const renderAllGift = (gifts) => {
  const { length } = gifts;
  const result = new Array(length);
  result[0] = renderGift(gifts[0], undefined, gifts[1].gift_order);
  for (let i = 1; i < length - 1; i += 1) {
    result[i] = renderGift(
      gifts[i],
      gifts[i - 1].gift_order,
      gifts[i + 1].gift_order
    );
  }
  result[length - 1] = renderGift(
    gifts[length - 1],
    gifts[length - 2].gift_order,
    undefined
  );

  return result;
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

  if (!data || loading) return <div>loading...</div>;
  if (!ALLOWED_EDIT_USERS.includes(session?.user.email)) {
    if (typeof window !== "undefined") {
      Router.push("/");
    }
    return <div>You're not allowed!!! Ya punchy bastard!!!!</div>;
  }
  if (error) return <div>failed to load</div>;
  const reducer = (acc: number, gift: Gift) => Math.max(acc, gift.gift_order);

  const curriedGiftCreater = async (event, setFeedback) => {
    const successfullSubmit = await createGift(
      event,
      setFeedback,
      data.reduce(reducer, 0) + 1
    );

    if (successfullSubmit) {
      setNewGiftCount(newGiftCount + 1); // increment gift count to empty bottom form after submit
    }
  };

  return (
    <>
      <MyNavbar />
      <Header />
      <Container>
        {renderAllGift(data)}
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
