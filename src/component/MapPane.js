import React from 'react';
import PropTypes from 'prop-types';
import { sprintf } from 'sprintf-js'
import { OverlayTrigger, Tooltip, Glyphicon } from 'react-bootstrap';

import CirclePositionElement from '../common/CirclePositionElement';

class MapPane extends React.Component {
  onClick(circle) {
    this.props.onCircleClick(circle);
  }

  render(){
    const { circles, favorites, maps } = this.props;

    if (!maps) {
      return <div/>
    }

    const circleIdx = {};

    for (const c of circles) {
      const numbers = c.space_num.split('-');
      for (const n of numbers) {
        circleIdx[c.space_sym + n] = c;
      }
    }

    return <div className="text-center">
      <div className="text-muted">
        <Glyphicon glyph="exclamation-sign"/> サークルのスペースをクリックすると詳細画面が開きます。
      </div>
      <div style={{
        display: "inline-block",
        border: "1px solid black",
        height: "800px",
        width: "500px",
        minWidth: "500px",
        background: "url(/map.png) 0 0 no-repeat",
        position: "relative" }}>
        {
          maps.map(pos => {
            const circle = circleIdx[pos.sym + sprintf('%02d', pos.num)];

            if (!circle) {
              //console.log("NOT FOUND", pos.sym, pos.num);
              return null;
            }

            const bgColor = circle && favorites[circle.circle_id]
              ? "rgba(255,255,0,0.3)"
              : circle
                ? "rgba(255,0,0,0.3)"
                : "rgba(0,0,255,0.3)";

            return <OverlayTrigger
              placement="left"
              overlay={
                <Tooltip id="tooltip">
                  {circle ? `${circle.space_sym}-${circle.space_num} : ${circle.circle_name} (${circle.penname})` : ''}
                </Tooltip>
              }>
                <CirclePositionElement
                  key={pos.sym + pos.num}
                  top={pos.top}
                  left={pos.left}
                  bgColor={bgColor}
                  blink={false}
                  onClick={this.onClick.bind(this,circle)}/>
            </OverlayTrigger>
          })
        }
      </div>
    </div>
  }
}

MapPane.propTypes = {
  maps: PropTypes.array,
  circles: PropTypes.array.isRequired,
  favorites: PropTypes.object.isRequired,
  onCircleClick: PropTypes.func.isRequired,
};

export default MapPane;