import { faImage, faList, faMap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function Header(param: { exhibition: Exhibition, count: number }) {
  return (
    <Navbar bg="light" variant="light" expand="md" className="bg-body-tertiary_">
      <Container>
        <Navbar.Brand>{param.exhibition.exhibition_name} サークル一覧({param.count})</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href={`#/${param.exhibition.id}/list`}><FontAwesomeIcon icon={faList}/> リストで表示</Nav.Link>
            <Nav.Link href={`#/${param.exhibition.id}/circlecut`}><FontAwesomeIcon icon={faImage}/> サークルカットで表示</Nav.Link>
            <Nav.Link href={`#/${param.exhibition.id}/map`}><FontAwesomeIcon icon={faMap}/> マップで表示</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
