import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Glyphicon, Modal, Panel } from 'react-bootstrap';

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
    const { show, config } = this.props;

    if (!config) {
      return <div/>;
    }

    return <Modal show={show} onHide={this.close}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Glyphicon glyph="link"/> チェックリストの公開設定
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          config.public
            ? <div>
                <Alert bsStyle="warning">
                    現在の共有の状態は 「<b>オン</b>」 です。
                </Alert>
                <Panel>
                  <Panel.Body>
                    チェックリストの公開URLは <b><a href="#/" target="_blank">http://loclahost:5000</a></b> です。
                  </Panel.Body>
                </Panel>
                <Button block bsStyle="primary"　bsSize="lg" onClick={this.publicLinkClick.bind(this,false)}>
                  <Glyphicon glyph="link"/> チェックリストを非公開にする
                </Button>
              </div>
            : <div>
                <Alert bsStyle="info">
                    現在の共有の状態は 「<b>オフ</b>」 です。
                </Alert>
                <Button block bsStyle="warning"　bsSize="lg" onClick={this.publicLinkClick.bind(this,true)}>
                  <Glyphicon glyph="link"/> チェックリストを公開にする
                </Button>
                <br/>
                <ul>
                  <li>上のボタンを押すことで共有・非共有が設定されます。共有ボタンを押していない場合は公開されません。</li>
                  <li>公開状態から非公開状態に戻すことも可能です。</li>
                  <li>公開したチェックリストを自分以外の人が編集することはできません。</li>
                </ul>
              </div>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button block bsStyle="success" onClick={this.close}>閉じる</Button>
      </Modal.Footer>
    </Modal>;
  }
}

PublicLinkModal.propTypes = {
  show: PropTypes.bool,
  config: PropTypes.object,
  //loadings: PropTypes.object.isRequired,
  onPublicLinkClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PublicLinkModal;