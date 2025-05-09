import { ReactElement, Suspense } from 'react';
import { useRoute } from 'wouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Alert, Container } from 'react-bootstrap';

import Header from '../component/Header';
import { getCircleData } from '../component/Client';

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

  return <>
    <Header exhibition_id={param.exhibition_id} count={data.circleList.length}></Header>
    <div className='text-secondary my-2'><FontAwesomeIcon icon={faInfoCircle} />  画像をクリックすると詳細画面が開きます。</div>
    サークルカット一覧
  </>;
}

export default function Root(): ReactElement {
  return (
    <Container>
      {/* <Suspense fallback={<Loading />}> */}
      <Suspense fallback={'読み込み中'}>
        <Content />
      </Suspense>
    </Container>
  )
}