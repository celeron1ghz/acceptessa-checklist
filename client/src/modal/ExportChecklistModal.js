import React from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon, Modal } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

class ExportChecklistModal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { clicked: false };
    this.close  = this.close.bind(this);
    this.export = this.export.bind(this);
  }

  close() {
    this.props.onClose();
  }

  export() {
    this.props.onExport();
    this.setState({ clicked: true });
  }

  render() {
    const { show, loadings, checklistUrl } = this.props;
    const { clicked } = this.state;

    return <Modal show={show} onHide={this.close}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Glyphicon glyph="export"/> チェックリストのダウンロードダウンロード
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          checklistUrl &&
            <h4><a href={checklistUrl}><Glyphicon glyph="download"/> チェックリストのダウンロード</a></h4>
        }
        {
          loadings.export &&
            <Button block bsStyle="warning"　bsSize="lg">
              <FontAwesome name="spinner" spin pulse={true} /> 作成中
            </Button>
        }
        {
          !loadings.export && !checklistUrl && <Button block bsStyle="primary"　bsSize="lg" onClick={this.export}>
            <Glyphicon glyph="export"/> チェックリストを作成する
          </Button>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button block bsStyle="success" onClick={this.close}>閉じる</Button>
      </Modal.Footer>
    </Modal>;
  }
}

ExportChecklistModal.propTypes = {
  show: PropTypes.bool,
  loadings: PropTypes.object.isRequired,
  checklistUrl: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
};

export default ExportChecklistModal;