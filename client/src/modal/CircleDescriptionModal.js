import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import _ from 'lodash';
import {Row, Col, Button, FormControl, Modal, Image, Badge, Card} from 'react-bootstrap';

function generateTweetLink(tweetParams, text, url) {
  const param = {
    ...tweetParams,
    text,
    url,
  };
  return  'https://twitter.com/intent/tweet?' + _.reduce(
    param,
    (result, value, key) => result += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`,
    ''
  ).slice(0, -1);
}

export default ({ show, showChecklistComponent, circle, favorite, loadings, onClose, onUpdateComment, onAddFavorite, onRemoveFavorite, tweetParams, exhibitionName, exhibitionID }) => {
    const [comment, setComment] = useState(favorite ? favorite.comment : null);

    return <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {
            circle && <div>
              <FontAwesomeIcon icon={['far', 'clipboard']} />&ensp;
              {circle.circle_name}&emsp;
              {
                favorite &&
                  <Button variant="warning" size="sm" onClick={e => { e.stopPropagation(); onRemoveFavorite(circle) }}>
                    <FontAwesomeIcon icon={['fas', 'star']} /> お気に入り
                  </Button>
              }
            </div>
          }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          circle && <div>
            <div className={'circleCut-parent ev_' + exhibitionID}>
              <div className={"circleCut text-center space-" + circle.space_count}>
                <Image src={circle.circlecut} style={{ border: favorite ? "7px solid #f00" : "none" }}/>

                {
                  circle.space_sym &&
                    <span className='place'>{circle.space_sym}<br/>{circle.space_num.replace('-', ',')}</span>
                }
              </div>
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
                                ? <Button block variant="warning">
                                    <FontAwesomeIcon icon={['fas', 'spinner']} spin pulse={true} /> 処理中
                                  </Button>
                                : <Button block variant="danger" onClick={() => onRemoveFavorite(circle)}>
                                    <FontAwesomeIcon icon={['fas', 'minus']} /> お気に入りから削除する
                                  </Button>
                            }
                            <br/>
                            <Row>
                              <Col xs={12} sm={12} md={8} lg={8}>
                                <FormControl
                                  componentClass="textarea"
                                  placeholder="(コメントが未記入です)"
                                  value={comment || ''}
                                  onChange={e => setComment(e.target.value)}/>
                              </Col>
                              <Col xs={12} sm={12} md={4} lg={4}>
                                <Button className="circleDescripton-renewComment" block variant="primary" onClick={() => onUpdateComment(circle, comment)}>
                                  <FontAwesomeIcon icon={['fas', 'sync-alt']} /> コメント更新
                                </Button>
                              </Col>
                            </Row>
                          </div>
                        : loadings[circle.circle_id]
                            ? <Button block variant="warning">
                                <FontAwesomeIcon icon={['fas', 'spinner']} spin pulse={true} /> 処理中
                              </Button>
                            : <Button block variant="primary" onClick={() => onAddFavorite(circle)}>
                                <FontAwesomeIcon icon={['far', 'star']}  /> お気に入りに追加する
                              </Button>
                  }
                </div>
            }
            <br/>

            <h4 className="text-center">サークルの情報</h4>
            <Card body bg="">
                <dl className="circle-name">
                  {
                    circle.space_sym &&
                      <dt><Badge variant="primary">{circle.space_sym}-{circle.space_num}</Badge>&nbsp;</dt>
                  }
                  <dd>{circle.circle_name} ({circle.penname})</dd>
                </dl>
                {
                  circle.pixiv_url &&
                    <dl className="circle-link">
                      <dt>
                        <Badge pill bg="secondary"><FontAwesomeIcon icon={['fas', 'palette']} /> Pixiv</Badge>
                      </dt>
                      <dd>
                        <a href={circle.pixiv_url} target="_blank" rel="noopener noreferrer">{circle.pixiv_url}</a>
                      </dd>
                    </dl>
                }
                {
                  circle.site_url &&
                  <dl className="circle-link">
                  <dt>
                      <Badge pill bg="secondary"><FontAwesomeIcon icon={['fas', 'link']} /> Web</Badge>
                  </dt>
                    <dd>
                      <a href={circle.site_url} target="_blank" rel="noopener noreferrer">{circle.site_url}</a>
                    </dd>
                  </dl>
                }
                {
                  circle.twitter_id &&
                  <dl className="circle-link">
                    <dt>
                      <Badge pill variant="secondary"> 𝕏</Badge>
                    </dt>
                    <dd>
                        <a href={"https://twitter.com/" + circle.twitter_id} target="_blank" rel="noopener noreferrer">{circle.twitter_id}</a>
                    </dd>
                  </dl>
                }
            </Card>

            <h4 className="text-center mt1e">サークルのお品書き</h4>
            <Card body>
              <p style={{ whiteSpace: "pre" }}>{
                circle.circle_comment
                  ? circle.circle_comment.split('\n').map(l => <div style={{ wordWrap: 'break-word' }}>{l}</div>)
                  : <Badge bg="secondary">お品書きコメント未記入</Badge>

              }</p>
              {
                circle.circle_link
                  ? <a href={circle.circle_link} target="_blank" rel="noopener noreferrer">{circle.circle_link}</a>
                  : <Badge bg="secondary">お品書きリンク未記入</Badge>
              }
            </Card>
            {
              circle &&
                <Button
                    block
                    className="mt1e"
                    variant="primary"
                    size="small"
                    href={generateTweetLink(
                        tweetParams,
                        `${exhibitionName} ` + (circle.space_sym && circle.space_num ? `【${circle.space_sym}-${circle.space_num}】 ` : '')
                        + `${circle.circle_name} のサークル情報です。`,
                        window.location.href,
                    )}
                    target="_blank">
                  <FontAwesomeIcon icon={['fav', 'twitter']} /> {' '}Xでサークルの情報をポストする（別画面が開きます）
                </Button>
            }
          </div>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button block variant="success" onClick={onClose}>閉じる</Button>
      </Modal.Footer>
    </Modal>;
};
