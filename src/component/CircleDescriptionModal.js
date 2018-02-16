import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Alert, Button, Glyphicon, Panel, Label, FormControl, Modal, Image } from 'react-bootstrap';

class CircleDescriptionModal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { comment: null };
    this.close = this.close.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.updateComment = this.updateComment.bind(this);
  }

  updateComment() {
    this.props.onUpdateComment(this.props.circle, this.state.comment);
  }

  addFavorite(circle) {
    this.props.onAddFavorite(circle);
  }

  removeFavorite(circle) {
    this.props.onRemoveFavorite(circle);
  }

  close() {
    this.props.onClose();
  }

  updateInput(e) {
    this.setState({ comment: e.target.value });
  }

  render() {
    const { show, circle, favorite, comment } = this.props;

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
              <Image thumbnail src={circle.circlecut} style={{ border: favorite ? "4px solid aqua" : "4px solid transparent" }}/>
            </div>

            <br/>
            {
              favorite
                ? <Button block bsStyle="warning" onClick={this.removeFavorite.bind(this,circle)}><Glyphicon glyph="remove"/> お気に入りから削除する</Button>

                : <Button block bsStyle="primary" onClick={this.addFavorite.bind(this,circle)}><Glyphicon glyph="plus"/> お気に入りに追加する</Button>

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

            <h4>自分のコメント</h4>
            {
              !favorite &&
                <div className="text-muted">
                  <Glyphicon glyph="exclamation-sign"/> ログインしてお気に入りに追加すると、メモを記入できるようになります。
                </div>
            }
            {
              favorite &&
                <div>
                  <FormControl
                    componentClass="textarea"
                    placeholder="(コメントが未記入です)"
                    value={comment}
                    onChange={this.updateInput}/>
                  <Button block bsStyle="primary" onClick={this.updateComment}><Glyphicon glyph="refresh"/> コメントを更新する</Button>
                </div>
            }
          </div>
        }
      </Modal.Body>
    </Modal>;
  }
}


CircleDescriptionModal.propTypes = {
  show: PropTypes.bool,
  circle: PropTypes.object,
  favorite: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onUpdateComment: PropTypes.func.isRequired,
  onAddFavorite: PropTypes.func.isRequired,
  onRemoveFavorite: PropTypes.func.isRequired,
};

export default CircleDescriptionModal;