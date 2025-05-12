import { faImage, faList, faMap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactElement } from 'react';
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function Header(param: { exhibition: Exhibition, count: number, children?: ReactElement }) {
  return (
    <Navbar bg="light" variant="light" expand="md" className="bg-body-tertiary_">
      <Container>
        <Navbar.Brand>{param.exhibition.exhibition_name} サークル一覧({param.count})</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href={`#/${param.exhibition.id}/list`}>
              <FontAwesomeIcon icon={faList} /><span className='d-inline d-md-none d-lg-inline'> リストで表示</span>
            </Nav.Link>
            <Nav.Link href={`#/${param.exhibition.id}/circlecut`}>
              <FontAwesomeIcon icon={faImage} /><span className='d-inline d-md-none d-lg-inline'> サークルカットで表示</span>
            </Nav.Link>
            <Nav.Link href={`#/${param.exhibition.id}/map`}>
              <FontAwesomeIcon icon={faMap} /> <span className='d-inline d-md-none d-lg-inline'> マップで表示</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
