import React from 'react';
import PropTypes from 'prop-types';
import { sprintf } from 'sprintf-js'

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
              ? "rgba(255,255,0,0.5)"
              : circle
                ? "rgba(255,0,0,0.5)"
                : "rgba(0,0,255,0.5)";

            return <div key={pos.sym + pos.num}
              onClick={this.onClick.bind(this,circle)}
              style={{
                border: "1px solid black",
                backgroundColor: bgColor,
                position: "absolute",
                width: "15px",
                height: "19px",
                top: pos.top,
                left: pos.left
              }}>
            </div>
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