import { ReactElement, Suspense } from 'react';
import { useRoute } from 'wouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Alert, Container } from 'react-bootstrap';
import LazyLoad from 'react-lazyload';

import Header from '../component/Header';
import { getCircleData, getExhibitionData } from '../component/Client';
import Loading from '../component/Loading';

function Circlecut() {
  return <div className='circlecut-lazy'>
    <FontAwesomeIcon icon={faCircleNotch} spin />
  </div>
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

  console.log(data);

  return <>
    <Header exhibition={data.exhibition} count={data.circleList.length}></Header>
    <div className='my-3'>
      <div className='text-secondary my-2'><FontAwesomeIcon icon={faInfoCircle} />  画像をクリックすると詳細画面が開きます。</div>
      <div className="circlecuts">
        {
          data.circleList.map(c => {
            let spaceClass = (c.space_count === "1") ? 'space-1sp' : 'space-2sp';

            return (
              <div className={spaceClass + " circlecut"} key={c.circlecut || c.circle_id}>
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