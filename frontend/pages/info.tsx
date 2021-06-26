import Container from "react-bootstrap/Container";
import MyNavbar from "../components/navbar";
import Footer from "../components/footer";
import Header from "../components/header";

import styles from "../styles/Home.module.scss";

export default function Info(): React.ReactNode {
  // const [session, loading] = useSession();
  // if (loading) return <div>loading...</div>;

  return (
    <>
      <div className={styles.container}>
        <MyNavbar />
        <Header />
        <main className={styles.main}>
          <h1 className={styles.title}>Practicalities</h1>
          {/* <Button href="/location">To Location</Button> */}
          <Container>
            <p className={styles.description}>Here will be a bunch of info!</p>
          </Container>
        </main>
        <Footer />
      </div>
    </>
  );
}
