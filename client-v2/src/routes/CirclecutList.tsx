import { ReactElement, Suspense, useState } from 'react';
import { useRoute } from 'wouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faClipboard, faExclamationCircle, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Alert, Button, Card, Container, Modal } from 'react-bootstrap';
import LazyLoad from 'react-lazyload';

import Header from '../component/Header';
import { getCircleData, getExhibitionData } from '../component/Client';
import Loading from '../component/Loading';

function Circlecut() {
  return <div className='circlecut-lazy'>
    <FontAwesomeIcon icon={faCircleNotch} spin />
  </div>
}

function CircleDescModal(param: { circle: Circle | null, show: boolean, onHide: () => void }) {
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

function Content(): ReactElement {
  const [, param] = useRoute("/:exhibition_id/circlecut");

  if (!param) {
    return <>SETTING_FAILED</>;
  }

  const { data } = getCircleData(param.exhibition_id);

  if (data.type === 'error') {
    return (
      <Alert variant="danger" className='my-3'>
        <FontAwesomeIcon icon={faExclamationTriangle} /> 即売会が存在しません。(id={param.exhibition_id})
      </Alert>
    );
  }

  const { data: data2 } = getExhibitionData(param.exhibition_id);

  if (data2.type === 'error') {
    return (
      <Alert variant="danger" className='my-3'>
        <FontAwesomeIcon icon={faExclamationTriangle} /> 即売会が存在しません。(id={param.exhibition_id})
      </Alert>
    );
  }
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const circleListBySym: { [sym: string]: Circle[] } = {};

  for (const c of data.circleList) {
    if (!circleListBySym[c.space_sym]) {
      circleListBySym[c.space_sym] = [];
    }

    circleListBySym[c.space_sym].push(c);
  }

  return <>
    <Header exhibition={data.exhibition} count={data.circleList.length}></Header>
    <div className='my-3'>
      <CircleDescModal circle={selectedCircle} show={!!selectedCircle} onHide={() => setSelectedCircle(null)} />
      <div className='text-secondary my-2'><FontAwesomeIcon icon={faInfoCircle} />  画像をクリックすると詳細画面が開きます。</div>
      <div className="circlecuts">
        {
          Object.entries(circleListBySym).map(([sym, circles]) => {
            return <>
              <h2>{sym}</h2>
              {
                circles.map(c => {
                  let spaceClass = (c.space_count === "1") ? 'space-1sp' : 'space-2sp';

                  return (
                    <div className={spaceClass + " circlecut"} key={c.circlecut || c.circle_id} onClick={() => setSelectedCircle(c)}>
                      <LazyLoad height={200} offset={-100} placeholder={<Circlecut />} once>
                        <img
                          src={c.circlecut ? c.circlecut.replace('http:', 'https:') : ''}
                          className="circleCut-img"
                          alt={c.circle_name}
                        />
                      </LazyLoad>
                      <div className="circleCut-space" style={{ width: '50px', height: '23px' }}>
                        {c.space_sym}{c.space_num ? c.space_num.replace('-', ',') : ''}
                      </div>
                      <div className="circleCut-detail">
                        <div className="circleCut-name">
                          {c.circle_name}
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </>
          })
        }
      </div>
    </div>
  </>;
}

export default function Root(): ReactElement {
  return (
    <Container>
      <Suspense fallback={<Loading />}>
        <Content />
      </Suspense>
    </Container>
  )
}