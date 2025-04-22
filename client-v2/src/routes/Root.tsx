import { Alert, Container } from "react-bootstrap";

export default function Root() {
  return (
    <Container className="py-4 px-3 mx-auto">
      {/* <LinkButton href="/qrReader/jsQr"><FontAwesomeIcon icon={faCamera} /> ブラウザでQRリーダーを起動</LinkButton> */}
      Hello!
      <Alert>aaa</Alert>
    </Container>
  )
}