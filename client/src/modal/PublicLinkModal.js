import React from 'react';
import PropTypes from 'prop-types';
import { Label, Button, Glyphicon, Modal, Panel } from 'react-bootstrap';
import Toggle from 'react-bootstrap-toggle';

class PublicLinkModal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { comment: null };
    this.close = this.close.bind(this);
  }

  publicLinkClick(isPublic) {
    this.props.onPublicLinkClick(isPublic);
  }

  close() {
    this.props.onClose();
  }

  render() {
    const { show, config, me } = this.props;

    if (!config) {
      return <div/>;
    }

    const publicUrl = window.location.origin + (window.location.path || '') + "?id=" + (me ? me.screen_name : "");

    return <Modal show={show} onHide={this.close}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Glyphicon glyph="link"/> チェックリストの公開設定
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Panel>
          <Panel.Body>
            <div>
              チェックリストの共有
              &nbsp;&nbsp;
              <Toggle
                width={120}
                height={30}
                on={<span>公開する</span>}
                off={<span>公開しない</span>}
                active={config.public}
                onClick={this.publicLinkClick.bind(this,!config.public)}/>
            </div>
            <hr/>
            <div>
              {
                config.public
                  ? <span>
                      チェックリストは <Label bsStyle="primary">公開</Label> に設定されています。
                      <br/><br/>
                      チェックリストの公開URL：
                      <b><a href={publicUrl} target="_blank">{publicUrl}</a></b>
                    </span>
                  : <span>チェックリストは <Label>非公開</Label> に設定されています。</span>
              }
            </div>
          </Panel.Body>
        </Panel>
        <ul>
          <li>上のボタンを押すことで共有・非共有が設定されます。共有ボタンを押していない場合は公開されません。</li>
          <li>公開状態から非公開状態に戻すことも可能です。</li>
          <li>公開したチェックリストを自分以外の人が編集することはできません。</li>
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button block bsStyle="success" onClick={this.close}>閉じる</Button>
      </Modal.Footer>
    </Modal>;
  }
}

PublicLinkModal.propTypes = {
  show: PropTypes.bool,
  me: PropTypes.object,
  config: PropTypes.object,
  //loadings: PropTypes.object.isRequired,
  onPublicLinkClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PublicLinkModal;