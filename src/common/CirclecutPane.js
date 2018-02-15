import React from 'react';
import PropTypes from 'prop-types';
import { Glyphicon, Button, Col, Image } from 'react-bootstrap';

class CirclecutPane extends React.Component {
  addFavorite(circle) {
    this.props.onAddFavorite(circle);
  }

  removeFavorite(circle) {
    this.props.onRemoveFavorite(circle);
  }

  imageClick(circle) {
    this.props.onImageClick(circle);
  }

  render() {
    const { circles, showChecklistComponent } = this.props;

    return <div style={{ minWidth: "" }}>
      {
        circles.map(c => {
          const s = c.space_count === "1"
            ? { xs: 12, sm: 6,  md: 4, lg: 3, width: "255px" }
            : { xs: 12, sm: 12, md: 8, lg: 6, width: "510px" };

          return <Col key={c.circlecut} xs={s.xs} sm={s.sm} md={s.md} lg={s.lg}>
            <div style={{ minWidth: s.width, maxWidth: s.width }} onClick={this.imageClick.bind(this,c)}>
              <Image
                responsive
                src={c.circlecut}
                style={{
                  display: "inline-block",
                  border: c.favorite ? "5px solid aqua" : "5px solid transparent",
                }}/>
              <div style={{ marginTop: "5px", marginBottom: "25px", fontSize: "12px" }}>
                <Col xs={3} sm={3} md={3} lg={3}>
                  {c.space_sym} {c.space_num}
                </Col>
                <Col xs={6} sm={6} md={6} lg={6}>
                  {c.circle_name}
                </Col>
                {
                  showChecklistComponent &&
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
                }
              </div>
            </div>
          </Col>;
        })
      }
    </div>;
  }
}

CirclecutPane.propTypes = {
  circles: PropTypes.array.isRequired,
  onImageClick: PropTypes.func.isRequired,
  onAddFavorite: PropTypes.func.isRequired,
  onRemoveFavorite: PropTypes.func.isRequired,
  showChecklistComponent: PropTypes.bool,
};

export default CirclecutPane;