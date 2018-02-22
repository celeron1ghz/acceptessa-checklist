import React from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon, Modal, Panel } from 'react-bootstrap';

class PublicLinkModal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { comment: null };
    this.close = this.close.bind(this);
  }

  close() {
    this.props.onClose();
  }

  render() {
    const { show } = this.props;

    return <Modal show={show} onHide={this.close}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Glyphicon glyph="link"/> チェックリストの公開設定
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          自分が作成したチェックリストを公開して共有することができます。
        </p>

        <Panel>
          <Panel.Body>
            現在の共有の状態は 「<b>オフ</b>」 です。
          </Panel.Body>
        </Panel>

        <Panel>
          <Panel.Body>
            チェックリストの公開URLは <b><a href="#/" target="_blank">http://loclahost:5000</a></b> です。
          </Panel.Body>
        </Panel>

        <Button block bsStyle="primary"　bsSize="lg">
          <Glyphicon glyph="link"/> チェックリストを公開設定にする
        </Button>
        <br/>

        <ul>
          <li>上のボタンを押すことで共有ができるようになります。共有ボタンを押していない場合は公開されません。</li>
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
  //loadings: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PublicLinkModal;