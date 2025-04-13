import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Badge,
  Card,
  Tab,
  Nav,
} from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import _ from 'lodash';

import CircleListPane from '../pane/CircleListPane';
import CirclecutPane from '../pane/CirclecutPane';
import MapPane from '../pane/MapPane';

import CircleDescriptionModal from '../modal/CircleDescriptionModal';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-toggle/dist/bootstrap2-toggle.css';
import 'font-awesome/css/font-awesome.min.css';
library.add(fab, fas, far);

class AdminRoot extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
        circleList:  [],
        circleIdx:   {},
        favoriteIdx: {},
        loading:     {},

        showCircleDescModal: false,

        exhibition:  null,
        me: null,
        config: null,
        param: null,

        spaceSymSorter: null,
        map: null,
        selectedCircle: null,
    };

    this.ENDPOINT = "https://checklist.familiar-life.info/api/";

    this.openCircleDescModal      = this.openCircleDescModal.bind(this);
    this.closeCircleDescModal     = this.closeCircleDescModal.bind(this);
    this.addLoading               = this.addLoading.bind(this);
    this.removeLoading            = this.removeLoading.bind(this);

    this.getCircleList      = this.getCircleList.bind(this);
  }

  addLoading(key) {
    const { loading } = this.state;
    loading[key] = 1;
    this.setState({ loading });
  }

  removeLoading(key) {
    const { loading } = this.state;
    delete loading[key];
    this.setState({ loading });
  }

  componentWillReceiveProps(props){
    const param = new URLSearchParams(props.location.search);
    const circle_id = param.get("circle_id");
    const circle = this.state.circleList.filter(c => c.circle_id === circle_id)[0];

    if (circle) {
      this.setState({ selectedCircle: circle, showCircleDescModal: true });
    } else {
      this.setState({ showCircleDescModal: false });
    }
  }

  componentDidMount() {
    const param = new window.URLSearchParams(window.location.search);
    const exhibition = param.get('e');

    // load setting
    window.fetch(`${window.location.origin}/${exhibition}.json`, { credentials: 'include' })
      .then(data => data.json())
      .then(data => {
        this.setState({ param: data });
      })
      .catch(err => {
        console.log("config load fail. continue with default value");
        this.setState({ param: {} });
      })
      .then(this.getCircleList)
  }

  getCircleList() {
    const param = new URLSearchParams(location.search); // eslint-disable-line no-restricted-globals
    const exhibition = param.get('e');
    this.addLoading("circle");
    return fetch('https://data.familiar-life.info/' + exhibition + '.json')
      .then(data => data.ok ? data : Promise.reject(data))
      .then(data => data.json())
      .then(data => {
        this.removeLoading("circle");
        console.log("CIRCLE_DATA_OK:", data.circles.length);

        let circleList = data.circles;

        // for circle of not upload circlecut, padding not uploaded image.
        for (const c of circleList) {
          if (!c.circlecut) {
            c.circlecut = `/${exhibition}/not_uploaded.png?_=${c.circle_id}`;
          }
        }

        let sorter;
        if (data.sort_order) {
          const sortMap = _.zipObject(data.sort_order, _.range(data.sort_order.length));
          sorter = (a,b) => {
            if (sortMap[a] && !sortMap[b]) {
              return 1;
            }
            if (!sortMap[a] && sortMap[b]) {
              return -1;
            }
            if (sortMap[a] > sortMap[b]) {
              return 1;
            }
            if (sortMap[a] < sortMap[b]) {
              return -1;
            }
            return 0;
          };

          circleList = circleList.sort((a,b) => {
            const sym = sorter(a.space_sym, b.space_sym);
            if (sym !== 0) return sym;

            if (a.space_num > b.space_num) {
              return 1;
            }
            if (a.space_num < b.space_num) {
              return -1;
            }
            return 0;
          });
        }

        this.setState({
          circleList,
          spaceSymSorter: sorter,
          exhibition: data.exhibition,
          map: data.map,
        });
        this.componentWillReceiveProps(this.props);
      })
      .catch(err => {
        //alert(`即売会のデータが存在しません。(eid=${exhibition})`);
        this.setState({ circleList: null });
        console.error("ERROR:", exhibition + '.json', err.status);
      });
  }

  openCircleDescModal(selectedCircle) {
    const param = new URLSearchParams(location.search); // eslint-disable-line no-restricted-globals
    param.append("circle_id", selectedCircle.circle_id);
    this.props.history.push("?" + param.toString());
  }

  closeCircleDescModal() {
    const param = new URLSearchParams(location.search); // eslint-disable-line no-restricted-globals
    param.delete("circle_id");
    this.props.history.push("?" + param.toString());
  }

  render() {
    const {
      circleList, favoriteIdx, loading,
      showCircleDescModal,
      selectedCircle, me, config, exhibition, spaceSymSorter, param,
    } = this.state;

    if (circleList instanceof Array && circleList.length === 0) {
      return <div className="container text-center">
        <h3>サークルデータを読み込んでいます...</h3>
      </div>;
    }

    if (!circleList) {
      return <div className="container text-center">
        <h2>404 Not Found</h2>
        <br/>
        <h4>サークルのデータが見つかりません</h4>
      </div>;
    }

    return <div className={'container ev_' + exhibition.id}>
      <br/>
      <Card body bg="light">
        <span>
          {
            exhibition
              ? <span> {exhibition.exhibition_name} サークル一覧 <Badge pill variant="secondary">{circleList.length}</Badge></span>
              : 'サークル一覧'
          }
        </span>
      </Card>
      <Tab.Container id="mainContainer" defaultActiveKey="circlecut">
        <div className="mt1e">
          <Nav variant="pills">
            <Nav.Item>
              <Nav.Link eventKey="list"><FontAwesomeIcon icon={['fas', 'list']} /> リスト表示</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="circlecut"><FontAwesomeIcon icon={['fas', 'images']} /> サークルカット</Nav.Link>
            </Nav.Item>
            {
              param.map &&
                <Nav.Item>
                  <Nav.Link eventKey="map"><FontAwesomeIcon icon={['fas', 'map-marked-alt']} /> マップ</Nav.Link>
                </Nav.Item>
            }
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="list">
              <CircleListPane
                circles={circleList}
                favorites={favoriteIdx}
                publicChecklist={false}
                loadings={loading}
                onRowClick={this.openCircleDescModal}
                onAddFavorite={() => {}}
                onRemoveFavorite={() => {}}
                onRemovePublicChecklist={() => {}}
                showChecklistComponent={!!me}
                enableChecklist={false}
                spaceSymSorter={spaceSymSorter}/>
            </Tab.Pane>
            <Tab.Pane eventKey="circlecut">
              <CirclecutPane
                circles={circleList}
                favorites={favoriteIdx}
                loadings={loading}
                onImageClick={this.openCircleDescModal}
                onAddFavorite={() => {}}
                onRemoveFavorite={() => {}}
                showChecklistComponent={!!me}
                spaceSymSorter={spaceSymSorter}/>
            </Tab.Pane>
            {
              param.map &&
                <Tab.Pane eventKey="map">
                  <MapPane
                    image={`/${exhibition.id}/map.png`}
                    maps={param.map}
                    circles={circleList}
                    favorites={favoriteIdx}
                    onCircleClick={this.openCircleDescModal}/>
                </Tab.Pane>
            }
          </Tab.Content>
        </div>
      </Tab.Container>

      <CircleDescriptionModal
        show={showCircleDescModal}
        circle={selectedCircle}
        favorite={selectedCircle ? favoriteIdx[selectedCircle.circle_id] : null}
        loadings={loading}
        onClose={this.closeCircleDescModal}
        onUpdateComment={() => {}}
        onAddFavorite={() => {}}
        onRemoveFavorite={() => {}}
        showChecklistComponent={!!me}
        tweetParams={param.tweet}
        exhibitionName={exhibition.exhibition_name}
        exhibitionID={exhibition.id}/>
    </div>;
  }
}

export default withRouter(AdminRoot);
