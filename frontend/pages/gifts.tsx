import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import { Card, Icon, Image, Container, Button } from "semantic-ui-react";

import styles from "../styles/Home.module.css";
import "semantic-ui-css/semantic.min.css";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export default function Gifts(): React.ReactNode {
  console.log("test");
  const { data, error } = useSWR("/api/backend/gifts", fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  console.log(data);
  console.log(data[0].image_url);
  const yada = data[0].image_url; // "https://react.semantic-ui.com/images/avatar/large/matthew.png";

  return (
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
          <Card.Group itemsPerRow={3}>
            {data.map((gift) => {
              return (
                <Card key={gift.name}>
                  <Image src={gift.image_url} wrapped className="card-img" />
                  <Card.Content>
                    <Card.Header>{gift.name}</Card.Header>
                    <Card.Meta>
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
                    </Card.Meta>
                    <Card.Description>{gift.description}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <a>
                      <Icon name="gift" />
                      wished: {gift.desired_amount}
                    </a>
                  </Card.Content>
                </Card>
              );
            })}
          </Card.Group>
        </Container>
      </main>
    </div>
  );
}
