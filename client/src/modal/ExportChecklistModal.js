import React from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon, Modal } from 'react-bootstrap';

class ExportChecklistModal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { comment: null };
    this.close  = this.close.bind(this);
    this.export = this.export.bind(this);
  }

  close() {
    this.props.onClose();
  }

  export() {
    this.props.onExport();
  }

  render() {
    const { show } = this.props;

    return <Modal show={show} onHide={this.close}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Glyphicon glyph="export"/> チェックリストの公開設定
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
        </p>

        <Button block bsStyle="primary"　bsSize="lg" onClick={this.export}>
          <Glyphicon glyph="export"/> チェックリストをエクスポートする
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button block bsStyle="success" onClick={this.close}>閉じる</Button>
      </Modal.Footer>
    </Modal>;
  }
}

ExportChecklistModal.propTypes = {
  show: PropTypes.bool,
  //loadings: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
};

export default ExportChecklistModal;