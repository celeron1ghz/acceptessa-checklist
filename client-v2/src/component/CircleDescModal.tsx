import { faClipboard, faExclamationCircle, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Button, Card, Modal } from "react-bootstrap";

import './style.css';

export default function CircleDescModal(param: { circle: Circle | null, show: boolean, onHide: () => void }) {
  const c = param.circle;

  return (
    <Modal show={param.show} onHide={param.onHide}>
      <Modal.Header closeButton>
        <FontAwesomeIcon icon={faClipboard} />&nbsp;{c?.circle_name || '...'}
      </Modal.Header>
      <Modal.Body>
        <h4>サークルの情報</h4>
        <Card className="circle_desc">
          <Card.Body>
            <div>
              <Badge>{c?.space_sym}-{c?.space_num}</Badge> {c?.circle_name} ({c?.penname})
            </div>
            {
              c?.pixiv_url && <div>
                <FontAwesomeIcon icon={['fab', 'pixiv']} size="2xl" /> <a href={c.pixiv_url} target="_blank">{c.pixiv_url}</a>
              </div>
            }
            {
              c?.twitter_id && <div>
                <FontAwesomeIcon icon={['fab', 'x-twitter']} size="2xl" /> <a href={'https://twitter.com/' + c.twitter_id} target="_blank">{c.twitter_id}</a>
              </div>
            }
            {
              c?.site_url && <div>
                <FontAwesomeIcon icon={faLink} size="2xl" /> <a href={c.site_url} target="_blank">{c.site_url}</a>
              </div>
            }
          </Card.Body>
        </Card>
        <h4 className='mt-3'>お品書き</h4>
        <Card>
          <Card.Body>
            <div key={"comment-" + c?.circle_id}>
              {
                c?.circle_comment
                  ? c.circle_comment.split('\n').map(l => <div style={{ wordWrap: 'break-word' }}>{l}</div>)
                  : <span className="text-info"><FontAwesomeIcon icon={faExclamationCircle} /> お品書きコメントを記入していません</span>
              }
            </div>
            <div key={"link-" + c?.circle_id}>
              {
                c?.circle_link
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