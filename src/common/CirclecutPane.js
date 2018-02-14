import React from 'react';
import PropTypes from 'prop-types';
import { Glyphicon, Button, Col, Image } from 'react-bootstrap';

class CirclecutPane extends React.Component {
  addFavorite(circle) {
    this.props.onAddFavorite(circle);
  }

  removeFavorite(circle) {
    this.props.onRemoveFavorite(circle)
  }

  imageClick(circle) {
    this.props.onImageClick(circle);
  }

  render() {
    const { circles } = this.props;

    return <div style={{ minWidth: "" }}>
      {
        circles.map(c =>
          <Col
            key={c.circlecut}
            xs={12} sm={6} md={4} lg={3}
            onClick={this.imageClick.bind(this,c)}
            style={{ textAlign: "" }}>
              <div style={{ minWidth: "255px", maxWidth: "255px" }}>
                <Image src={c.circlecut} responsive style={{ display: "inline-block" }}/>
                <div style={{ marginTop: "5px", marginBottom: "25px" }}>
                  <Col xs={3} sm={3} md={3} lg={3}>
                    {c.space_sym} {c.space_num}
                  </Col>
                  <Col xs={6} sm={6} md={6} lg={6} style={{ fontSize: "12px" }}>
                    {c.circle_name}
                  </Col>
                  <Col xsPush={3} smPush={3} mdPush={3} lgPush={3} className="text-right">
                    {
                      c.favorite
                        ? <Button bsStyle="danger" bsSize="xs" onClick={e => { e.stopPropagation(); this.removeFavorite(c) }}>
                            <Glyphicon glyph="minus"/> 削除
                          </Button>
                        : <Button bsStyle="primary" bsSize="xs" onClick={e => { e.stopPropagation(); this.addFavorite(c) }}>
                            <Glyphicon glyph="plus"/> 追加
                          </Button>
                    }
                  </Col>
                </div>
              </div>
          </Col>
        )
      }
    </div>
  }
}

CirclecutPane.propTypes = {
  circles: PropTypes.array.isRequired,
  onImageClick: PropTypes.func.isRequired,
  onAddFavorite: PropTypes.func.isRequired,
  onRemoveFavorite: PropTypes.func.isRequired,
};

export default CirclecutPane;