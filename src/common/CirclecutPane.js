import React from 'react';
import PropTypes from 'prop-types';
import { Label, Glyphicon, Button, Col, Image } from 'react-bootstrap';

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

    return <div>
      {
        circles.map(c => {
          const s = c.space_count === "1"
            ? { xs: 12, sm: 6,  md: 4, lg: 3, width: "255px" }
            : { xs: 12, sm: 12, md: 8, lg: 6, Wwidth: "510px" };

          return <Col key={c.circlecut} xs={s.xs} sm={s.sm} md={s.md} lg={s.lg}>
            <div style={{ minWidth: s.width, maxWidth: s.width }} onClick={this.imageClick.bind(this,c)}>
              <Image
                responsive
                src={c.circlecut}
                style={{
                  display: "inline-block",
                  height: "100%",
                  border: c.favorite ? "4px solid aqua" : "4px solid black",
                }}/>
              <div className="clearfix" style={{
                marginTop: "0px",
                marginBottom: "25px",
                marginLeft: "0px",
                marginRight: "0px",
                padding: "5px 5px",
                fontSize: "12px",
                border: "1px solid gray",
                height: "60px",
              }}>
                <div>
                  <Label>{c.space_sym}-{c.space_num}</Label>
                  {' '}
                  {c.circle_name}
                  {
                    showChecklistComponent &&
                      <span className="pull-right">
                        {
                          c.favorite
                            ? <Button bsStyle="danger" bsSize="xs" onClick={e => { e.stopPropagation(); this.removeFavorite(c) }}>
                                <Glyphicon glyph="minus"/> 削除
                              </Button>
                            : <Button bsStyle="primary" bsSize="xs" onClick={e => { e.stopPropagation(); this.addFavorite(c) }}>
                                <Glyphicon glyph="plus"/> 追加
                              </Button>
                        }
                      </span>
                  }
                </div>
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