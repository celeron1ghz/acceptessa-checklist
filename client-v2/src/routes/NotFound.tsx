import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Container } from "react-bootstrap";

export default function Root() {
  return (
    <Container className='my-3'>
      <Alert variant="danger">
        <FontAwesomeIcon icon={faExclamationTriangle} /> サークルのデータが存在しないか、公開状態になっていません。
      </Alert>
    </Container>
  );
}