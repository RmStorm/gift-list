import { GetStaticProps } from "next";
import useSWR from "swr";
import { useSession } from "next-auth/client";
import React, { useState } from "react";
import Container from "react-bootstrap/Container";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Gift as GiftIcon } from "react-bootstrap-icons";
import { Gift } from "../types";

import MyNavbar from "../components/navbar";
import Footer from "../components/footer";
import Header from "../components/header";

import styles from "../styles/Home.module.scss";

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
  const [session, loading] = useSession();
  const [firstFetch, setFirstFetch] = useState(true);
  const onSuccess = () => {
    // When 'getStaticProps' data is used the number of available present should not yet be displayed
    if (firstFetch) {
      setFirstFetch(false);
    }
  };

  const { data, error } = useSWR("/api/backend/gifts", fetcher, {
    revalidateOnMount: true,
    refreshInterval: 5,
    initialData: giftList,
    onSuccess,
  });

  if (!data || loading) return <div>loading...</div>;

  if (error) return <div>failed to load</div>;

  return (
    <>
      <div className={styles.container}>
        <MyNavbar />
        <Header />

        <h1 className={styles.title}>Wish list</h1>
        <Container>
          <p className={styles.description}>
            If you would like to bring a present to the party, we would greatly
            appreciate a contribution to our little household, or to the
            honeymoon we have planned in Sicily. We plan on going diving,
            sightseeing and eating lots of gelato. We have made a list of
            wishes, but if you have come up with a great idea that is not
            mentioned here, feel free to completely ignore this list.
          </p>
          <p className={styles.description}>
            {"If you would like to give a present from this list, "}
            {session
              ? "click the 'claim' button on one of the gifts to let others know they shouldn't buy it!"
              : "please log in to claim it so gifts are not given multiple times!"}
          </p>
          <Row xs={1} sm={1} md={2} lg={3} xl={3}>
            {data.map((gift) => {
              return (
                <Col key={gift.name} className="d-flex py-2">
                  <Card border="default" className={styles.cardFullWidth}>
                    <Card.Img variant="top" src={gift.image_url} />
                    <Card.Body>
                      <Card.Title>{gift.name}</Card.Title>
                      <Card.Text>{gift.description}</Card.Text>
                      <ul className="list-group list-group-flush">
                        {gift.urls.map((link: string, i: number) => {
                          let url;
                          try {
                            url = new URL(link);
                          } catch (err) {
                            return <></>;
                          }
                          return (
                            <li className="list-group-item p-0" key={link}>
                              <a
                                key={`link ${i + 1}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                href={link}
                              >
                                {url.host.replace("www.", "")}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                      {wishedAmountFooter(gift, firstFetch)}
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
        <Footer />
      </div>
    </>
  );
}
