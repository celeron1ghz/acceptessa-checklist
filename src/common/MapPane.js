import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Label, Glyphicon, Button, Col, Image } from 'react-bootstrap';

class MapPane extends React.Component {
  render(){
    return <div>
      Hello!!
    </div>
  }
}

MapPane.propTypes = {
  circles: PropTypes.array.isRequired,
  favorites: PropTypes.object.isRequired,
};

export default MapPane;