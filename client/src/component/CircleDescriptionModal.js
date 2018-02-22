import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Row, Col, Button, Glyphicon, Panel, Label, FormControl, Modal, Image } from 'react-bootstrap';

class CircleDescriptionModal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { comment: null };

    this.addFavorite    = this.addFavorite.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
    this.updateComment  = this.updateComment.bind(this);
    this.close          = this.close.bind(this);
    this.updateInput    = this.updateInput.bind(this);
  }

  addFavorite() {
    this.props.onAddFavorite(this.props.circle);
  }

  removeFavorite() {
    this.props.onRemoveFavorite(this.props.circle);
  }

  updateComment() {
    this.props.onUpdateComment(this.props.circle, this.state.comment);
  }

  close() {
    this.props.onClose();
  }

  updateInput(e) {
    this.setState({ comment: e.target.value });
  }

  componentWillReceiveProps(p) {
    this.setState({ comment: p.favorite ? p.favorite.comment : null });
  }

  render() {
    const { show, circle, favorite, showChecklistComponent, loadings } = this.props;
    const { comment } = this.state;

    return <Modal show={show} onHide={this.close}>
      <Modal.Header closeButton>
        <Modal.Title>
          {
            circle && <div>
              {circle.circle_name}{' '}
              {
                favorite && <Label bsStyle="warning"><Glyphicon glyph="star"/> お気に入り</Label>
              }
            </div>
          }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          circle && <div>
            <div className="text-center">
              <Image src={circle.circlecut} style={{ border: favorite ? "4px solid aqua" : "4px solid transparent" }}/>
            </div>

            <br/>
            {
              showChecklistComponent &&
                <div>
                  {
                    favorite
                        ? <div>
                            {
                              loadings[circle.circle_id]
                                ? <Button block bsStyle="warning">
                                    <FontAwesome name="spinner" spin pulse={true} /> 処理中
                                  </Button>
                                : <Button block bsStyle="danger" onClick={this.removeFavorite}>
                                    <Glyphicon glyph="minus"/> お気に入りから削除する
                                  </Button>
                            }
                            <br/>
                            <Row>
                              <Col xs={12} sm={8} md={8} lg={8}>
                                <FormControl
                                  componentClass="textarea"
                                  placeholder="(コメントが未記入です)"
                                  value={comment}
                                  onChange={this.updateInput}/>
                              </Col>
                              <Col xs={12} sm={4} md={4} lg={4}>
                                <Button block bsStyle="primary" onClick={this.updateComment} style={{ height: "55px" }}>
                                  <Glyphicon glyph="refresh"/> コメントを更新する
                                </Button>
                              </Col>
                            </Row>
                          </div>
                        : loadings[circle.circle_id]
                            ? <Button block bsStyle="warning">
                                <FontAwesome name="spinner" spin pulse={true} /> 処理中
                              </Button>
                            : <Button block bsStyle="primary" onClick={this.addFavorite}>
                                <Glyphicon glyph="plus"/> お気に入りに追加する
                              </Button>
                  }
                </div>
            }
            <br/>

            <h4>サークルの情報</h4>
            <Panel>
              <Panel.Body>
                <p>
                  <Label bsStyle="primary">{circle.space_sym}-{circle.space_num}</Label>
                  &nbsp;
                  {circle.circle_name} ({circle.penname})
                </p>
                {
                  circle.pixiv_id &&
                    <p><Label><FontAwesome name="link"/> Pixiv</Label> <a href={circle.pixiv_id} target="_blank">{circle.pixiv_id}</a></p>
                }
                {
                  circle.site_url &&
                    <p><Label><FontAwesome name="link"/> ホームページ</Label> <a href={circle.site_url} target="_blank">{circle.site_url}</a></p>
                }
                {
                  circle.twitter_id &&
                    <p><Label><FontAwesome name="twitter"/> Twitter</Label> <a href={"https://twitter.com/" + circle.twitter_id} target="_blank">@{circle.twitter_id}</a></p>
                }
              </Panel.Body>
            </Panel>

            <h4>サークルのお品書き</h4>
            <Panel>
              <Panel.Body>
                <p style={{ whiteSpace: "pre" }}>{
                  circle.circle_comment || <Label>お品書きコメント未記入</Label>

                }</p>
                {
                  circle.circle_link
                    ? <a href={circle.circle_link} target="_blank">{circle.circle_link}</a>
                    : <Label>お品書きリンク未記入</Label>
                }
              </Panel.Body>
            </Panel>
          </div>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button block bsStyle="success" onClick={this.close}>閉じる</Button>
      </Modal.Footer>
    </Modal>;
  }
}


CircleDescriptionModal.propTypes = {
  show: PropTypes.bool,
  circle: PropTypes.object,
  favorite: PropTypes.object,
  loadings: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateComment: PropTypes.func.isRequired,
  onAddFavorite: PropTypes.func.isRequired,
  onRemoveFavorite: PropTypes.func.isRequired,
  showChecklistComponent: PropTypes.bool,
};

export default CircleDescriptionModal;