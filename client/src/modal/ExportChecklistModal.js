import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default ({ show, loadings, checklistUrl, onClose, onExport }) => {
    return <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={['far', 'export']} /> チェックリストのダウンロード
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          checklistUrl &&
          <Button block variant="outline-success" size="lg">
            <a href={checklistUrl}><FontAwesomeIcon icon={['fas', 'file-download']} />  チェックリストのダウンロード</a>
          </Button>
        }
        {
          loadings.export &&
            <Button block variant="warning" size="lg">
              <FontAwesomeIcon icon={['fas', 'spinner']} spin pulse={true} /> 作成中
            </Button>
        }
        {
          !loadings.export && !checklistUrl && <Button block variant="primary" size="lg" onClick={onExport}>
            <FontAwesomeIcon icon={['fas', 'file-alt']} /> チェックリストを作成する
          </Button>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button block variant="success" onClick={onClose}>閉じる</Button>
      </Modal.Footer>
    </Modal>;
};
