import { useSession, signIn, signOut } from "next-auth/client";
import { Navbar, Nav, Button, Container } from "react-bootstrap";

import styles from "../styles/Navbar.module.css";

function UserNavBarSnippet(): JSX.Element {
  const [session] = useSession();
  if (session) {
    return (
      <>
        <Navbar.Text className="mr-sm-2">
          Signed in as {session.user.email}
        </Navbar.Text>
        <Button variant="outline-secondary" onClick={() => signOut()}>
          Sign out
        </Button>
      </>
    );
  }
  return (
    <>
      <Button variant="outline-secondary" onClick={() => signIn()}>
        Sign in
      </Button>
    </>
  );
}

const ADMIN_USERS = ["astridhult4@gmail.com", "roaldstorm@gmail.com"];

export default function MyNavbar(): JSX.Element {
  const [session] = useSession();
  return (
    <Navbar
      collapseOnSelect
      sticky="top"
      expand="lg"
      bg="light"
      variant="light"
      className={styles.navbar}
    >
      <Container>
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/info">Practical information</Nav.Link>
            <Nav.Link href="/venue">Venue</Nav.Link>
            <Nav.Link href="/wishlist">Wish list</Nav.Link>
            {ADMIN_USERS.includes(session?.user.email) ? (
              <Nav.Link href="/astrids_master_list">
                Astrids master list
              </Nav.Link>
            ) : undefined}
          </Nav>
          <Nav>
            <UserNavBarSnippet />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export { ADMIN_USERS };
