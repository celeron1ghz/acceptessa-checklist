import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Image,
  ButtonToolbar,
  Dropdown,
  DropdownButton,
  Badge,
  Card,
  Tab,
  Nav,
  // NavItem,
  Button,
  // ToggleButton,
  // ToggleButtonGroup,
  // ButtonGroup
} from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import _ from 'lodash';

import CircleListPane from '../pane/CircleListPane';
import CirclecutPane from '../pane/CirclecutPane';
import FavoriteListPane from '../pane/FavoriteListPane';
import MapPane from '../pane/MapPane';

import CircleDescriptionModal from '../modal/CircleDescriptionModal';
import PublicLinkModal from '../modal/PublicLinkModal';
import ExportChecklistModal from '../modal/ExportChecklistModal';

import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/css/bootstrap-theme.min.css';
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
        showPublicLinkModal: false,
        showExportChecklistModal: false,

        exhibition:  null,
        me: null,
        config: null,
        param: null,

        spaceSymSorter: null,
        publicChecklist: null,
        map: null,
        selectedCircle: null,
        enableChecklist: false,
        exportChecklistUrl: false,
    };

    this.ENDPOINT = "https://api.familiar-life.info/api/";

    this.openCircleDescModal      = this.openCircleDescModal.bind(this);
    this.closeCircleDescModal     = this.closeCircleDescModal.bind(this);
    this.addFavorite              = this.addFavorite.bind(this);
    this.removeFavorite           = this.removeFavorite.bind(this);
    this.updateFavoriteComment    = this.updateFavoriteComment.bind(this);
    this.updatePublicLinkSetting  = this.updatePublicLinkSetting.bind(this);
    this.login                    = this.login.bind(this);
    this.logout                   = this.logout.bind(this);
    this.addLoading               = this.addLoading.bind(this);
    this.removeLoading            = this.removeLoading.bind(this);
    this.exportChecklist          = this.exportChecklist.bind(this);

    this.openPublicLinkModal          = this.openPublicLinkModal.bind(this);
    this.closePublicLinkModal         = this.closePublicLinkModal.bind(this);
    this.openExportChecklistModal     = this.openExportChecklistModal.bind(this);
    this.closeExportChecklistModal    = this.closeExportChecklistModal.bind(this);
    this.removePublicChecklistDisplay = this.removePublicChecklistDisplay.bind(this);

    this.getCircleList      = this.getCircleList.bind(this);
    this.getUserData        = this.getUserData.bind(this);
    this.getShareChecklist  = this.getShareChecklist.bind(this);
  }

  callChecklistApi(args, load_type) {
    const token = localStorage.getItem("token");

    if (!token) return Promise.reject("No access_token. Please login!!");

    if (load_type) this.addLoading(load_type);

    return fetch(this.ENDPOINT + "endpoint", {
      headers: new Headers({ 'Authorization': "Bearer " + token }),
      method: 'POST',
      body: JSON.stringify(args),
      cors: true,
    })
    .then(data => data.json())
    .catch(err => {
      alert(`サーバでエラーが発生しました。しばらく経ってもエラーが続く場合は管理者にお問い合わせください。(${err})`);
      return;
    })
    .then(data => {
      if (load_type) this.removeLoading(load_type);

      if (data && data.error && (data.error === "EXPIRED" || data.error === "INVALID_TOKEN")) {
        return;
      }

      if (data && data.error) {
        alert(`リクエストでエラーが発生しました。しばらく経ってもエラーが続く場合は管理者にお問い合わせください。(${args.command}: ${data.error})`);
        return;
      }

      return data;
    });
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
      .then(data => {
        if (!this.state.enableChecklist) {
          console.log("list mode");
          return;
        }

        const param = new URLSearchParams(window.location.search);

        if ( param.get("id") ) {
          return Promise.resolve(param.get("id"))
            .then(this.getShareChecklist)
            .then(this.getUserData);
        } else {
          return this.getUserData();
        }
      });
  }

  getShareChecklist(member_id) {
    const { exhibition } = this.state;

    return fetch(`${this.ENDPOINT}/public/${exhibition.id}/?mid=${member_id}`, { cors: true })
      .then(data => data.json())
      .then(data => {
        if (!data.favorite) {
          console.log("PUBLIC_CHECKLIST_DATA_NG", member_id);
          alert(`${member_id} さんのチェックリストは存在しないか、公開設定になっていません。`);
          return;
        }

        console.log("PUBLIC_CHECKLIST_DATA_OK", member_id, data.favorite.length);
        const idx = {};
        for (const f of data.favorite) {
          idx[f.circle_id] = f;
        }

        this.setState({ publicChecklist: { idx, config: data.config } });
      })
      .catch(err => {
        console.log("Error on fetch public checklist:", err);
      });
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
        const enableChecklist = data.circles.filter(c => c.space_sym && c.space_num).length !== 0;

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
          enableChecklist,
        });
        this.componentWillReceiveProps(this.props);
      })
      .catch(err => {
        //alert(`即売会のデータが存在しません。(eid=${exhibition})`);
        this.setState({ circleList: null });
        console.error("ERROR:", exhibition + '.json', err.status);
      });
  }

  getUserData() {
    const { exhibition } = this.state;

    return this.callChecklistApi({ command: "list", exhibition_id: exhibition.id }, "user").then(data => {
      if (!data) return;
      console.log("FAVORITE_DATA_OK:", data.favorite.length);

      const favoriteIdx = {};
      for (const f of data.favorite) {
        favoriteIdx[f.circle_id] = f;
      }

      this.setState({ favoriteIdx, config: data.config, me: data.user });
    });
  }

  login() {
    const getJwtToken = event => {
      if (typeof event.data === 'string') {
        localStorage.setItem("token", event.data);
        this.getUserData();
      }
    };

    window.open(this.ENDPOINT + "auth/start");
    window.addEventListener('message', getJwtToken, false);
  }

  logout() {
    localStorage.clear();
    this.setState({ me: null, favoriteIdx: {} });
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

  openPublicLinkModal() {
    this.setState({ showPublicLinkModal: true });
  }

  closePublicLinkModal() {
    this.setState({ showPublicLinkModal: false });
  }

  openExportChecklistModal() {
    this.setState({ showExportChecklistModal: true });
  }

  closeExportChecklistModal() {
    this.setState({ showExportChecklistModal: false });
  }

  addFavorite(circle) {
    const { favoriteIdx, exhibition } = this.state;

    return this.callChecklistApi({ command: "add", exhibition_id: exhibition.id, circle_id: circle.circle_id }, circle.circle_id).then(data => {
      if (!data) return;

      console.log("ADD_FAVORITE", data);
      favoriteIdx[circle.circle_id] = data;
      this.setState({ favoriteIdx });
    });
  }

  removeFavorite(circle) {
    const { favoriteIdx } = this.state;

    this.callChecklistApi({ command: "remove", circle_id: circle.circle_id }, circle.circle_id).then(data => {
      if (!data) return;

      console.log("REMOVE_FAVORITE", data);
      delete favoriteIdx[circle.circle_id];
      this.setState({ favoriteIdx });
    });
  }

  updateFavoriteComment(circle,comment) {
    const { favoriteIdx } = this.state;

    this.callChecklistApi({ command: "update", circle_id: circle.circle_id, comment: comment }, circle.circle_id).then(data => {
      if (!data) return;

      console.log("UPDATE_FAVORITE", data);
      const fav = favoriteIdx[circle.circle_id];
      fav.comment = comment;
      this.setState({ favoriteIdx });
    });
  }

  updatePublicLinkSetting(isPublic) {
    const { exhibition } = this.state;

    this.callChecklistApi({ command: "public", exhibition_id: exhibition.id, public: isPublic }).then(data => {
      if (!data) return;

      console.log("UPDATE_PUBLIC_LINK", data);
      this.setState({ config: { public: isPublic } });
    });
  }

  removePublicChecklistDisplay() {
    this.setState({ publicChecklist: null });
  }

  exportChecklist() {
    const { exhibition } = this.state;
    this.callChecklistApi({ command: "export", exhibition_id: exhibition.id }, 'export').then(data => {
      console.log("EXPORT_CHECKLIST", data);
      this.setState({ exportChecklistUrl: data.url });
    });
  }

  render() {
    const {
      circleList, favoriteIdx, loading,
      showCircleDescModal, showPublicLinkModal, showExportChecklistModal, publicChecklist, exportChecklistUrl,
      selectedCircle, me, config, exhibition, enableChecklist, spaceSymSorter, param,
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

    return <div className="container">
      <br/>
      <Card body bg="light">
        <span>
          {
            exhibition
              ? <span> {exhibition.exhibition_name} サークル一覧 <Badge pill variant="secondary">{circleList.length}</Badge></span>
              : 'サークル一覧'
          }
        </span>
        {
          enableChecklist &&
            <div className="pull-right">
              {
                loading.auth
                  ? <Button variant="warning" size="sm">
                      <FontAwesomeIcon icon={['fas', 'spinner']} spin pulse={true} /> 読み込み中...
                    </Button>
                  : me
                    ? <ButtonToolbar>
                        <DropdownButton
                          alignRight
                          variant="success"
                          size="sm"
                          id="dropdown-size-extra-small"
                          title={<span><FontAwesomeIcon icon={['fab', 'twitter']} /> {me.screen_name}</span>}>
                            <Dropdown.Item eventKey="1">
                              {me.display_name + ' '}
                              <Image circle src={me.profile_image_url} style={{width: "32px", height: "32px", borderRadius: "50%" }}/>
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="2" onClick={this.logout}>
                              ログアウト <FontAwesomeIcon icon={['fas', 'sign-out-alt']} />
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item eventKey="3" onClick={this.openExportChecklistModal}>
                              <FontAwesomeIcon icon={['fas', 'file-download']} /> エクスポート
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item eventKey="4" onClick={this.openPublicLinkModal}>
                              <FontAwesomeIcon icon={['fas', 'link']} /> 公開設定
                            </Dropdown.Item>
                        </DropdownButton>
                      </ButtonToolbar>
                    : <Button variant="primary" size="sm" onClick={this.login}>
                      <FontAwesomeIcon icon={['fab', 'twitter']} /> Login via Twitter
                      </Button>
              }
            </div>
        }
      </Card>
      {
        (enableChecklist && !me) &&
          <div className="text-info mt1e mb1e">
            <FontAwesomeIcon icon={['fas', 'info-circle']} /> Twitterのアカウントでログインを行うことでチェックリストの作成を行うことが可能です。
            <br/>
            <span className="fz80p">
              （取得した情報はログインしたユーザの情報取得のみに利用し、ツイートの取得・自動ツイート等は行いません。）
            </span>
          </div>
      }
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
            {
              enableChecklist &&
                <Nav.Item>
                  <Nav.Link eventKey="favorite"><FontAwesomeIcon icon={['fas', 'star']} /> お気に入り <Badge pill variant="light">{Object.keys(favoriteIdx).length}</Badge></Nav.Link>
                </Nav.Item>
            }
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="list">
              <CircleListPane
                circles={circleList}
                favorites={favoriteIdx}
                publicChecklist={publicChecklist}
                loadings={loading}
                onRowClick={this.openCircleDescModal}
                onAddFavorite={this.addFavorite}
                onRemoveFavorite={this.removeFavorite}
                onRemovePublicChecklist={this.removePublicChecklistDisplay}
                showChecklistComponent={!!me}
                enableChecklist={enableChecklist}
                spaceSymSorter={spaceSymSorter}/>
            </Tab.Pane>
            <Tab.Pane eventKey="circlecut">
              <CirclecutPane
                circles={circleList}
                favorites={favoriteIdx}
                loadings={loading}
                onImageClick={this.openCircleDescModal}
                onAddFavorite={this.addFavorite}
                onRemoveFavorite={this.removeFavorite}
                showChecklistComponent={!!me}
                spaceSymSorter={spaceSymSorter}/>
            </Tab.Pane>
            {
              enableChecklist &&
                <Tab.Pane eventKey="favorite">
                  <FavoriteListPane
                    circles={circleList}
                    favorites={favoriteIdx}
                    onRowClick={this.openCircleDescModal}
                    spaceSymSorter={spaceSymSorter}/>
                </Tab.Pane>
            }
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
        onUpdateComment={this.updateFavoriteComment}
        onAddFavorite={this.addFavorite}
        onRemoveFavorite={this.removeFavorite}
        showChecklistComponent={!!me}
        tweetParams={param.tweet}
        exhibitionName={exhibition.exhibition_name}/>

      <PublicLinkModal
        show={showPublicLinkModal}
        me={me}
        config={config}
        onPublicLinkClick={this.updatePublicLinkSetting}
        onClose={this.closePublicLinkModal}/>

      <ExportChecklistModal
        show={showExportChecklistModal}
        loadings={loading}
        checklistUrl={exportChecklistUrl}
        onClose={this.closeExportChecklistModal}
        onExport={this.exportChecklist}/>

    </div>;
  }
}

export default withRouter(AdminRoot);
