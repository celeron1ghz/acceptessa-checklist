import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class MapPane extends React.Component {
  render(){
    const { maps } = this.props;

    return <div>
      {
        maps &&
        <div style={{
          border: "1px solid black",
          height: "800px",
          width: "500px",
          minWidth: "500px",
          background: "url(/map.png) 0 0 no-repeat",
          position: "relative" }}>
          {
            maps.map(pos =>
              <div key={pos.sym + pos.num} style={{
                border: "1px solid black",
                backgroundColor: "rgba(255,0,0,0.5)",
                position: "absolute",
                width: "15px",
                height: "19px",
                top: pos.top,
                left: pos.left }}>
              </div>
            )
          }
        </div>
      }
    </div>
  }
}

MapPane.propTypes = {
  maps: PropTypes.array,
  circles: PropTypes.array.isRequired,
  favorites: PropTypes.object.isRequired,
};

export default MapPane;