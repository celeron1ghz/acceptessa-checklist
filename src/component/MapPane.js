import React from 'react';
import PropTypes from 'prop-types';
import { sprintf } from 'sprintf-js'

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
      circleIdx[c.space_sym + c.space_num] = c;
    }

    return <div>
      <div style={{
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
              console.log("NOT FOUND", pos.sym, pos.num);
            }

            const bgColor = circle && favorites[circle.circle_id]
              ? "rgba(255,255,0,0.3)"
              : circle
                ? "rgba(255,0,0,0.3)"
                : "rgba(0,0,255,0.3)";

            return <CirclePositionElement
              key={pos.sym + pos.num}
              top={pos.top}
              left={pos.left}
              bgColor={bgColor}
              blink={false}
              onClick={this.onClick.bind(this,circle)}/>;
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