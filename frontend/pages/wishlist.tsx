import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Gift } from "react-bootstrap-icons";
import MyNavbar from "../components/navbar";

import styles from "../styles/Home.module.css";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export default function Gifts(): React.ReactNode {
  const { data, error } = useSWR("/api/backend/gifts", fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <>
      <MyNavbar />
      <div className={styles.container}>
        <Head>
          <title>Roald & Astrid</title>
          <link href="/favicon.ico" rel="icon" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>Gifts</h1>
          <Button href="/location">To Location</Button>
          <p className={styles.description}>
            Get started by editing{" "}
            <Link href="/location">
              <a>location</a>
            </Link>
            <code className={styles.code}>pages/index.js</code>
          </p>
          <Container>
            <Row xs={1} sm={1} md={2} lg={3} xl={4}>
              {data.map((gift) => {
                return (
                  <Col
                    key={gift.name}
                    className="align-items-stretch d-flex py-2"
                  >
                    <Card border="default">
                      <Card.Img variant="top" src={gift.image_url} />
                      <Card.Body>
                        <Card.Title>{gift.name}</Card.Title>
                        <Card.Text>{gift.description}</Card.Text>
                        {/* <Button variant="primary">Go somewhere</Button> */}
                        {/* <Card.Footer>
                      <small className="text-muted">
                        {gift.urls.map((link: string, i: number) => {
                          return (
                            <a
                              key={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              href={link}
                            >
                              {`link ${i + 1}`}
                            </a>
                          );
                        })}
                      </small>
                    </Card.Footer> */}
                        <Card.Footer className="text-muted">
                          <Gift className="mr-2" />
                          wished: {gift.desired_amount}
                        </Card.Footer>
                      </Card.Body>
                    </Card>
                  </Col>
                  // <Card key={gift.name}>
                  //   <Image src={gift.image_url} wrapped className="card-img" />
                  //   <Card.Content>
                  //     <Card.Header>{gift.name}</Card.Header>
                  //     <Card.Meta>
                  //       {gift.urls.map((link: string, i: number) => {
                  //         return (
                  //           <a
                  //             key={link}
                  //             target="_blank"
                  //             rel="noopener noreferrer"
                  //             href={link}
                  //           >
                  //             {`link ${i + 1}`}
                  //           </a>
                  //         );
                  //       })}
                  //     </Card.Meta>
                  //     <Card.Description>{gift.description}</Card.Description>
                  //   </Card.Content>
                  //   <Card.Content extra>
                  //     <a>
                  //       <Icon name="gift" />
                  //       wished: {gift.desired_amount}
                  //     </a>
                  //   </Card.Content>
                  // </Card>
                );
              })}
            </Row>
          </Container>
        </main>
      </div>
    </>
  );
}
