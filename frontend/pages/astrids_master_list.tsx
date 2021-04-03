import Head from "next/head";

import { useSession } from "next-auth/client";
import React from "react";
import {
  Media,
  Navbar,
  Nav,
  NavDropdown,
  Button,
  Form,
  FormControl,
  Container,
  Col,
  Row,
} from "react-bootstrap";
import useSWR from "swr";

import MyNavbar from "../components/navbar";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export default function AstridList() {
  const [session, loading] = useSession();
  const { data, error } = useSWR("/api/backend/gifts", fetcher);

  if (error) return <div>failed to load</div>;
  if (!data || loading) return <div>loading...</div>;

  if (session?.user.email === "astridhult4@gmail.com") {
    return (
      <>
        <MyNavbar />
        <Head>
          <title>Roald & Astrid</title>
          <link href="/favicon.ico" rel="icon" />
        </Head>
        <Container>
          {data.map((gift) => {
            return (
              <Media key={gift.name}>
                <img
                  width={128}
                  height={128}
                  className="mr-3"
                  src={gift.image_url}
                  alt="thumbnail"
                />
                <Media.Body>
                  <Form>
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
                          rows={2}
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
                        <Form.Control
                          defaultValue={gift?.image_url}
                          size="sm"
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="numberWished">
                      <Form.Label column sm={2}>
                        Desired
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          defaultValue={gift?.desired_amount}
                          size="sm"
                        />
                      </Col>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                      Update
                    </Button>
                  </Form>
                </Media.Body>
              </Media>
            );
          })}
        </Container>
      </>
    );
  }
  return <div>You're not allowed!!! Ya punchy bastard!!!!</div>;
}
