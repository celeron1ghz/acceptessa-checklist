import { ReactElement, Suspense, useState } from 'react';
import { useRoute } from 'wouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Alert, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { sprintf } from 'sprintf-js';

import Header from '../component/Header';
import { getCircleData, getExhibitionData } from '../component/Client';
import Loading from '../component/Loading';
import CircleDescModal from '../component/CircleDescModal';

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

  const [imageScale, setImageScale] = useState<number>(0.75);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);

  const map = data2.map;
  const circleIdxBySpace: { [space: string]: Circle } = {};

  for (const c of data.circleList) {
    for (const num of c.space_num.split('-')) {
      const space = sprintf("%s%s", c.space_sym, num);
      circleIdxBySpace[space] = c;
    }
  }

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageScale(Number(event.target.value));
  };

  return <>
    <Header exhibition={data.exhibition} count={data.circleList.length}></Header>
    <div className='my-3'>
      <CircleDescModal circle={selectedCircle} show={!!selectedCircle} onHide={() => setSelectedCircle(null)} />
      <div className='text-secondary my-2'>
        <FontAwesomeIcon icon={faInfoCircle} />  サークルのスペースをクリックすると詳細画面が開きます。画像は上下にスクロール、または拡大/縮小が可能です。
      </div>
      <div className='my-2'>
        <small>
          マップを拡大/縮小する：
        </small>
        <input
          type="range"
          min="0.3"
          max="1.5"
          step="0.1"
          value={imageScale}
          onChange={handleScaleChange}
          style={{ width: '200px' }}
        />
      </div>
      <div className="overflow-scroll" style={{ height: "70vh", border: "3px solid #ccc", borderRadius: '0.5rem' }}>
        <div style={{ position: "relative" }}>
          <img src={param.exhibition_id + "/map.png"} style={{ height: map.image_height * imageScale + "px", width: map.image_width * imageScale + "px", }} />
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
                  onClick={() => setSelectedCircle(circle)}
                  style={{
                    position: 'absolute',
                    backgroundColor: "rgba(255,0,0,0.3)",
                    border: '1px solid red',
                    cursor: 'pointer',
                    left: `${pos.l * imageScale}px`,
                    top: `${pos.t * imageScale}px`,
                    width: `${pos.w * imageScale}px`,
                    height: `${pos.h * imageScale}px`,
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