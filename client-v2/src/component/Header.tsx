import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function Header(param: { exhibition_id: string, count: number }) {
  return (
    <Navbar bg="light" variant="light" expand="md" className="bg-body-tertiary_">
      <Container>
        <Navbar.Brand>xxx サークル一覧({param.count})</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href={`#/${param.exhibition_id}/circleList`}>リストで表示</Nav.Link>
            <Nav.Link href={`#/${param.exhibition_id}/circlecutList`}>サークルカットで表示</Nav.Link>
            <Nav.Link href={`#/${param.exhibition_id}/circlecutList`}>マップで表示</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
