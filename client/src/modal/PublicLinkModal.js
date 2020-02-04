import React from 'react';
import { Button, Modal, Badge, Card, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import Toggle from 'react-bootstrap-toggle';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default ({ show, config, me, onPublicLinkClick, onClose }) => {
    if (!config) {
      return <div/>;
    }

    const param = new window.URLSearchParams(window.location.search);
    const publicUrl = window.location.origin
      + (window.location.path || '')
      + `?e=${param.get('e')}`
      + `&id=${me ? me.screen_name : ''}`;

    return <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={['fas', 'link']} /> チェックリストの公開設定
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <Card.Header>
            <div>
              チェックリストの共有
              &nbsp;&nbsp;
              <ToggleButtonGroup type="radio" name="publish" defaultValue={config.public ? 'published' : 'notPublished'}>
                <ToggleButton
                    onClick={onPublicLinkClick.bind(this, true)}
                    value={'published'}
                    variant="outline-primary">{config.public}公開する</ToggleButton>
                <ToggleButton
                    onClick={onPublicLinkClick.bind(this, false)}
                    value={'notPublished'}
                    variant="outline-secondary">公開しない</ToggleButton>
              </ToggleButtonGroup>
            </div>
          </Card.Header>
          <Card.Body>
            <div>
              {
                config.public
                  ? <span>
                      チェックリストは <Badge variant="primary">公開</Badge> に設定されています。
                      <br/><br/>
                      <h4>
                        チェックリストの公開URL&nbsp;
                        <CopyToClipboard text={publicUrl}>
                          <Button variant="success" size="sm"><FontAwesomeIcon icon={['far', 'copy']} /> クリップボードにコピー</Button>
                        </CopyToClipboard>
                      </h4>
                      <b><a href={publicUrl} target="_blank">{publicUrl}</a></b>
                    </span>
                  : <span>チェックリストは <Badge variant="secondary">非公開</Badge> に設定されています。</span>
              }
            </div>
          </Card.Body>
        </Card>
        <ul>
          <li>上のボタンを押すことで共有・非共有が設定されます。共有ボタンを押していない場合は公開されません。</li>
          <li>公開状態から非公開状態に戻すことも可能です。</li>
          <li>公開したチェックリストを自分以外の人が編集することはできません。</li>
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button block variant="success" onClick={onClose}>閉じる</Button>
      </Modal.Footer>
    </Modal>;
};
