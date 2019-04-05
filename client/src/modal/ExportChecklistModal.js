import React from 'react';
import { Button, Glyphicon, Modal } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

export default ({ show, loadings, checklistUrl, onClose, onExport }) => {
    return <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Glyphicon glyph="export"/> チェックリストのダウンロード
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          checklistUrl &&
            <h4><a href={checklistUrl}><Glyphicon glyph="download"/> チェックリストのダウンロード</a></h4>
        }
        {
          loadings.export &&
            <Button block bsStyle="warning" bsSize="lg">
              <FontAwesome name="spinner" spin pulse={true} /> 作成中
            </Button>
        }
        {
          !loadings.export && !checklistUrl && <Button block bsStyle="primary" bsSize="lg" onClick={onExport}>
            <Glyphicon glyph="export"/> チェックリストを作成する
          </Button>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button block bsStyle="success" onClick={onClose}>閉じる</Button>
      </Modal.Footer>
    </Modal>;
};
