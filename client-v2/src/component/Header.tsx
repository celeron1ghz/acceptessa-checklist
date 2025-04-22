import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function Header(param: { exhibition_id: string }) {
  return (
    <Navbar bg="light" variant="light" expand="lg" className="bg-body-tertiary_">
      <Container>
        <Navbar.Brand href="#/">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href={`#/${param.exhibition_id}/circleList`}>サークル一覧</Nav.Link>
            <Nav.Link href={`#/${param.exhibition_id}/circlecutList`}>サークルカット一覧</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
