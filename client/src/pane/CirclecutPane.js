import React from 'react';
import _ from 'lodash';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LazyLoad from 'react-lazyload';

function CirclecutPane({ circles, favorites, loadings, showChecklistComponent, onImageClick, onAddFavorite, onRemoveFavorite }) {
  const circleList = _.cloneDeep(circles);

  for (const c of circleList) {
    if (favorites[c.circle_id]) {
      c.favorite = favorites[c.circle_id];
    }
  }

  return <div>
    <div className="text-muted mt1e">
      <FontAwesomeIcon icon={['fas', 'info-circle']} /> 画像をクリックすると詳細画面が開きます。
    </div>
    <div className="circleCutWrapper">
      {
        circleList.map(c => {
          let spaceClass = (c.space_count === "1") ? 'space-normal' : 'space-wide';
          if (c.favorite) spaceClass += ' is--favorite';

          return (
            <div
              key={c.circlecut || c.circle_id}
              className={spaceClass + " circleCut-item"}
              onClick={() => onImageClick(c)}>
              <div className="circleCut-image">
                <LazyLoad height={200} offset={0} once>
                  <img
                    src={c.circlecut ? c.circlecut.replace('http:', 'https:') : null}
                    className="circleCut-img"
                    alt={c.circle_name}
                  />
                </LazyLoad>
              </div>
              <div className="circleCut-space">
                {c.space_sym}<br/>{c.space_num.replace('-', ',')}
              </div>
                <div className="circleCut-detail">
                  <div className="circleCut-name">
                    {c.circle_name}
                  </div>
                  {
                    showChecklistComponent &&
                    <div className="circleCut-favorite">
                      {
                        loadings[c.circle_id]
                          ? <Button variant="warning" size="sm" onClick={e => { e.stopPropagation(); }}>
                            <FontAwesomeIcon icon={['fas', 'spinner']} spin pulse={true} /> 処理中
                          </Button>
                          : c.favorite
                            ? <Button variant="danger" size="sm" onClick={e => { e.stopPropagation(); onRemoveFavorite(c) }}>
                              <FontAwesomeIcon icon={['fas', 'star']} /> 削除
                            </Button>
                            : <Button variant="primary" size="sm" onClick={e => { e.stopPropagation(); onAddFavorite(c) }}>
                              <FontAwesomeIcon icon={['far', 'star']} /> 追加
                            </Button>
                      }
                    </div>
                  }
                </div>
            </div>
          );
        })
      }
    </div>
  </div>;
}

export default CirclecutPane;
