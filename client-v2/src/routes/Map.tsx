import { ReactElement, Suspense } from 'react';
import { useRoute } from 'wouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Alert, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { sprintf } from 'sprintf-js';

import Header from '../component/Header';
import { getCircleData, getExhibitionData } from '../component/Client';
import Loading from '../component/Loading';

function Content(): ReactElement {
  const [, param] = useRoute("/:exhibition_id/map");

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

  const map = data2.map;
  const circleIdxBySpace: { [space: string]: Circle } = {};

  for (const c of data.circleList) {
    const space = sprintf("%s%s", c.space_sym, c.space_num);
    circleIdxBySpace[space] = c;
  }

  return <>
    <Header exhibition_id={param.exhibition_id} count={data.circleList.length}></Header>
    <div className='my-3'>
      <div className='text-secondary my-2'>
        <FontAwesomeIcon icon={faInfoCircle} />  サークルのスペースをクリックすると詳細画面が開きます。画像は上下にスクロールが可能です。
      </div>
      <div className="overflow-scroll" style={{ height: "78vh", border: "3px solid #ccc", borderRadius: '0.5rem' }}>
        <div style={{
          height: map.image_height + "px",
          width: map.image_width + "px",
          background: `url(${param.exhibition_id}/map.png) 0 0 no-repeat`,
          position: "relative",
        }}>
          {
            map.mappings.map(pos => {
              const space = pos.s + sprintf('%02d', pos.n);
              const circle = circleIdxBySpace[space];

              if (!circle) {
                return null;
              }

              return <OverlayTrigger
                key={pos.s + pos.n}
                placement="left"
                overlay={
                  <Tooltip id="tooltip">
                    {circle.space_sym}-{circle.space_num} : {circle.circle_name} ({circle.penname})
                  </Tooltip>
                }>
                <div
                  key={space}
                  style={{
                    position: 'absolute',
                    backgroundColor: "rgba(255,0,0,0.3)",
                    border: '1px solid red',
                    cursor: 'pointer',
                    left: `${pos.l}px`,
                    top: `${pos.t}px`,
                    width: `${pos.w}px`,
                    height: `${pos.h}px`,
                    // onClick={() => onCircleClick(circle)}
                  }}
                />
              </OverlayTrigger>;
            })
          }
        </div>
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