import { ReactElement, Suspense, useState } from 'react';
import { useRoute } from 'wouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Alert, Container } from 'react-bootstrap';

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

  return <>
    <Header exhibition={data.exhibition} count={circles.length}></Header>
    <div className='my-3'>
      <CircleDescModal circle={selectedCircle} show={!!selectedCircle} onHide={() => setSelectedCircle(null)} />
      <div className='text-secondary my-2'><FontAwesomeIcon icon={faInfoCircle} /> テーブルの行をクリックすると詳細画面が開きます。</div>
      {
        selectedCircle && selectedCircle.circle_id
      }
      <div className='d-block d-md-none'>
        小さいときに表示
      </div>
      <div className='d-none d-md-block'>
        大きいときに表示
      </div>
      <CircleListTable circles={circles} onSelectedCircle={(c: Circle) => setSelectedCircle(c)} />
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
