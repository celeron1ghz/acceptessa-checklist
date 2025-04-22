import { ReactElement, Suspense } from 'react';
import { useRoute } from 'wouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Alert, Container } from 'react-bootstrap';
import Header from '../component/Header';

function Content(): ReactElement {
  const [, param] = useRoute("/:exhibition_id/circleList");

  if (!param) {
    return <></>;
  }

  //   const { data } = UA.getExhibitionData(param.id);
  // const { data } = { data: [] };

  // if (!data) {
  //   return (
  //     <Alert variant="danger">
  //       <FontAwesomeIcon icon={faExclamationTriangle} /> 即売会が存在しません。(id={param.exhibition_id})
  //     </Alert>
  //   );
  // }

  return <>
    <Header exhibition_id={param.exhibition_id}></Header>
    <div className='text-secondary'><FontAwesomeIcon icon={faInfoCircle} /> テーブルの行をクリックすると詳細画面が開きます。</div>

    サークルリスト一覧
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