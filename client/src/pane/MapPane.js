import React from 'react';
import PropTypes from 'prop-types';
import { sprintf } from 'sprintf-js';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import CirclePositionElement from '../common/CirclePositionElement';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class MapPane extends React.Component {
  onClick(circle) {
    this.props.onCircleClick(circle);
  }

  render(){
    const { circles, favorites, maps, image } = this.props;

    if (!maps) {
      return <div/>;
    }

    const circleIdx = {};

    for (const c of circles) {
      const numbers = (c.space_num || '').split('-');
      for (const n of numbers) {
        circleIdx[c.space_sym + n] = c;
      }
    }

    return <div className="">
      <div className="text-muted mt1e">
        <FontAwesomeIcon icon={['fas', 'info-circle']} /> サークルのスペースをクリックすると詳細画面が開きます。
      </div>
      <div className="pre-scrollable mt1e" style={{ height: parseInt(maps.image_height, 10) + 10 + "px", maxHeight: parseInt(maps.image_height, 10) + 10 + "px" }}>
        <div style={{
          display: "inline-block",
          border: "1px solid black",
          height: maps.image_height + "px",
          width:  maps.image_width + "px",
          background: `url(${image}) 0 0 no-repeat`,
          position: "relative" }}>
          {
            maps.mappings.map(pos => {
              const circle = circleIdx[pos.s + sprintf('%02d', pos.n)];

              if (!circle) {
                //console.log("NOT FOUND", pos.sym, pos.num);
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
                    onClick={this.onClick.bind(this,circle)}/>
              </OverlayTrigger>;
            })
          }
        </div>
      </div>
    </div>;
  }
}

MapPane.propTypes = {
  image: PropTypes.string,
  maps: PropTypes.object,
  circles: PropTypes.array.isRequired,
  favorites: PropTypes.object.isRequired,
  onCircleClick: PropTypes.func.isRequired,
};

export default MapPane;
