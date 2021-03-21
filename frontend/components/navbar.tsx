import { useSession, signIn, signOut } from "next-auth/client";
import {
  Navbar,
  Nav,
  NavDropdown,
  Button,
  Form,
  FormControl,
  Container,
} from "react-bootstrap";

function UserNavBarSnippet(): JSX.Element {
  const [session, loading] = useSession();
  if (session) {
    return (
      <>
        <Navbar.Text className="mr-sm-2">
          Signed in as {session.user.email}
        </Navbar.Text>
        <Button variant="outline-primary" onClick={() => signOut()}>
          Sign out
        </Button>
      </>
    );
  }
  return (
    <>
      <Button variant="outline-primary" onClick={() => signIn()}>
        Sign in
      </Button>
    </>
  );
}

export default function MyNavbar(): JSX.Element {
  const [session, loading] = useSession();

  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Container>
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/location">Party location!</Nav.Link>
            <Nav.Link href="/wishlist">Wishlist</Nav.Link>
            {session?.user.email === "astridhult4@gmail.com" ? (
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
