import { faClipboard, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Modal } from "react-bootstrap";

export default function CircleDescModal(param: { circle: Circle | null, show: boolean, onHide: () => void }) {
  const c = param.circle;

  if (!c) {
    return <>NO_SELECTED_CIRCLE</>;
  }

  return (
    <Modal show={param.show} onHide={param.onHide}>
      <Modal.Header closeButton>
        <FontAwesomeIcon icon={faClipboard} />&nbsp;{c.circle_name}
      </Modal.Header>
      <Modal.Body>
        {c.space_sym}
        {c.space_num}
        {c.penname}

        <h4>サークルの情報</h4>
        <Card>
          <Card.Body>
            aa
          </Card.Body>
        </Card>

        <h4 className='mt-3'>サークルのお品書き</h4>
        <Card>
          <Card.Body>
            <div key={"comment-" + c.circle_id}>
              {
                c.circle_comment
                  ? c.circle_comment.split('\n').map(l => <div style={{ wordWrap: 'break-word' }}>{l}</div>)
                  : <span className="text-info"><FontAwesomeIcon icon={faExclamationCircle} /> お品書きコメントを記入していません</span>
              }
            </div>
            <div key={"link-" + c.circle_id}>
              {
                c.circle_link
                  ? <a href={c.circle_link} target="_blank" rel="noopener noreferrer">{c.circle_link}</a>
                  : <span className="text-info"><FontAwesomeIcon icon={faExclamationCircle} /> お品書きリンクを記入していません</span>
              }
            </div>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={param.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}