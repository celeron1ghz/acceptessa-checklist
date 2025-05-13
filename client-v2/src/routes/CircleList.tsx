import { ReactElement, Suspense, useState } from 'react';
import { useRoute } from 'wouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faInfoCircle, faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import { Alert, Badge, Container, ListGroup } from 'react-bootstrap';

import Header from '../component/Header';
import Loading from '../component/Loading';
import { getCircleData, getExhibitionData } from '../component/Client';

import CircleDescModal from '../component/CircleDescModal';
import { CircleListTable } from '../component/CircleList/Table/CircleListTable';

function Content(): ReactElement {
  const [, param] = useRoute("/:exhibition_id/list");

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
  const circles = data.circleList;

  const circleListBySym: { [sym: string]: Circle[] } = {};

  for (const c of data.circleList) {
    if (!circleListBySym[c.space_sym]) {
      circleListBySym[c.space_sym] = [];
    }

    circleListBySym[c.space_sym].push(c);
  }

  return <>
    <Header exhibition={data.exhibition} count={circles.length}><span>aaa</span></Header>
    <div className='my-3'>
      {/* <div className='sticky-top'>
        ブロックに移動：
        {
          Object.keys(circleListBySym).map(s => {
            return <a href={"#block-" + s}><Badge className='mr-2'>{s}</Badge>&nbsp;</a>;
          })
        }
      </div> */}
      <CircleDescModal exhibiton={data.exhibition} circle={selectedCircle} show={!!selectedCircle} onHide={() => setSelectedCircle(null)} tweetParams={data2.tweet}/>
      <div className='d-block d-md-none'>
        <div className='text-secondary my-2'><FontAwesomeIcon icon={faInfoCircle} /> リストの行をクリックすると詳細画面が開きます。</div>
        <ListGroup>
          {
            Object.entries(circleListBySym).map(([sym, circles]) => {
              return <>
                <ListGroup.Item variant="info" className="text-center">{sym}ブロック</ListGroup.Item>
                {
                  circles.map(c => {
                    return <ListGroup.Item onClick={() => setSelectedCircle(c)} className='d-flex justify-content-between align-items-center'>
                      <span><Badge bg="info">{c.space_sym}-{c.space_num}</Badge> {c.circle_name}({c.penname})</span>
                      <span>
                        {
                          (c.circle_comment || c.circle_link) && <FontAwesomeIcon icon={faNoteSticky} className='text-info' />
                        }
                      </span>
                    </ListGroup.Item>;
                  })
                }
              </>
            })
          }
        </ListGroup>
      </div>
      <div className='d-none d-md-block'>
        <div className='text-secondary my-2'><FontAwesomeIcon icon={faInfoCircle} /> テーブルの行をクリックすると詳細画面が開きます。</div>
        <CircleListTable circles={circles} onSelectedCircle={(c: Circle) => setSelectedCircle(c)} />
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
