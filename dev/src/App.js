import React, { useState, useEffect } from 'react';
import { sprintf } from 'sprintf-js';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import styled from 'styled-components';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

const CirclePositionElement = styled.div`
  @keyframes pointerBlink {
    0% {
      opacity: 0.9;
      transform: scale(1.8, 1.8);
      border-radius: 50%;
    }
    99% {
      border-radius: 0;
    }
    100% {
      opacity: 0.5;
      transform: scale(0.9, 0.9);
      border-radius: 50%;
    }
  }

  animation-name: ${props => props.blink ? 'pointerBlink' : ''};
  animation-duration: 1s;
  animation-iteration-count: infinite;

  background-color: ${props => props.bgColor};
  position: absolute;
  width: ${props => props.width || 5}px;
  height: ${props => props.height || 5}px;
  top: ${props => props.top};
  left: ${props => props.left};
  cursor: pointer;
`;

function MapPane({ image, maps, circles, favorites, onCircleClick }) {
  if (!maps) {
    return <div />;
  }

  const circleIdx = {};

  for (const c of circles) {
    const numbers = (c.space_num || '').split('-');
    for (const n of numbers) {
      circleIdx[c.space_sym + n] = c;
    }
  }

  return (
    <div className="px-3 py-3">
      <div className="pre-scrollable mt1e" style={{ height: parseInt(maps.image_height, 10) + 10 + "px", maxHeight: parseInt(maps.image_height, 10) + 10 + "px" }}>
        <div style={{
          display: "inline-block",
          border: "1px solid black",
          height: maps.image_height + "px",
          width: maps.image_width + "px",
          background: `url(${image}) 0 0 no-repeat`,
          position: "relative"
        }}>
          {
            maps.mappings.map(pos => {
              const circle = circleIdx[pos.s + sprintf('%02d', pos.n)];

              if (!circle) {
                return null;
              }

              const bgColor = circle && favorites[circle.circle_id]
                ? "rgba(255,0,0,0.3)"
                : circle
                  ? "rgba(128,128,128,0.7)"
                  : "rgba(64,64,64,0.3)";

              return <OverlayTrigger
                key={pos.s + pos.n}
                placement="left"
                overlay={
                  <Tooltip id="tooltip">
                    {circle ? `${circle.space_sym}-${circle.space_num} : ${circle.circle_name} (${circle.penname})` : ''}
                  </Tooltip>
                }>
                <CirclePositionElement
                  top={pos.t + "px"}
                  left={pos.l + "px"}
                  width={pos.w}
                  height={pos.h}
                  bgColor={bgColor}
                  blink={false}
                  onClick={() => onCircleClick(circle)} />
              </OverlayTrigger>;
            })
          }
        </div>
      </div>
    </div>
  )
}

function App() {
  const [maps, setMaps] = useState();
  const [circles, setCircles] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const exhibition = q.get("e");

    window.fetch(`${window.location.origin}/${exhibition}.json`, { credentials: 'include' })
      .then(data => data.json())
      .then(data => {
        setMaps(data.map);
      })
      .catch(err => {
        console.log(err);
        setError("Error1");
      });

    fetch('https://data.familiar-life.info/' + exhibition + '.json')
      .then(data => data.ok ? data : Promise.reject(data))
      .then(data => data.json())
      .then(data => {
        setCircles(data.circles);
      })
      .catch(err => {
        console.log(err);
        setError("Error2");
      });
  }, []);

  return (
    <>
      <div>{error}</div>
      <MapPane
        maps={maps}
        image={"map.png"}
        circles={circles}
        favorites={[]}
        onCircleClick={() => { alert(1) }}
      />
    </>
  );
}

export default App;
