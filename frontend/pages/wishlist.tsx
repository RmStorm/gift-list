import Link from "next/link";
import { GetStaticProps } from "next";
import useSWR from "swr";
import { useSession } from "next-auth/client";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Gift as GiftIcon } from "react-bootstrap-icons";
import { Gift } from "../types";

import MyNavbar from "../components/navbar";
import Footer from "../components/footer";
import Header from "../components/header";

import styles from "../styles/Home.module.css";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export const getStaticProps: GetStaticProps = async () => {
  const url = process.env.WISH_LIST_GIFTS_ENDPOINT
    ? process.env.WISH_LIST_GIFTS_ENDPOINT
    : `http://${process.env.GIFT_LIST_API_SERVICE_HOST}:${process.env.GIFT_LIST_API_SERVICE_PORT}/gifts`;
  if (url) {
    const res = await fetch(url);
    return {
      props: { giftList: await res.json() },
      revalidate: 5,
    };
  }
  return {
    props: { giftList: [] },
    revalidate: 5,
  };
};

type GiftsProps = {
  giftList: Gift[];
};

const wishedAmountFooter = (gift: Gift, firstFetch: boolean) => {
  return (
    <Card.Footer className="text-muted">
      <GiftIcon className="mr-2" />
      {"wished: "}
      {firstFetch ? <div className="spinner" /> : gift.desired_amount}
    </Card.Footer>
  );
};

export default function Gifts({ giftList }: GiftsProps): React.ReactNode {
  const [firstFetch, setFirstFetch] = useState(true);
  // const [session, loading] = useSession();
  const onSuccess = () => {
    // When 'getStaticProps' data is used the number of available present should not yet be displayed
    if (firstFetch) {
      setFirstFetch(false);
    }
  };

  const { data, error } = useSWR("/api/backend/gifts", fetcher, {
    revalidateOnMount: true,
    // refreshInterval: 2,
    initialData: giftList,
    onSuccess,
  });

  if (error) return <div>failed to load</div>;

  return (
    <>
      <MyNavbar />
      <div className={styles.container}>
        <Header />

        <h1 className={styles.title}>Gifts</h1>
        <Button href="/location">To Location</Button>
        <p className={styles.description}>
          Get started by editing{" "}
          <Link href="/location">
            <a>location</a>
          </Link>
          {/* <code className={styles.code}>pages/index.js</code> */}
        </p>
        <Container>
          <Row xs={1} sm={1} md={2} lg={3} xl={3}>
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
                      {wishedAmountFooter(gift, firstFetch)}
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
        <Footer />
      </div>
    </>
  );
}
