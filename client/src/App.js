import React from 'react';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { Image, ButtonToolbar, DropdownButton, MenuItem, Alert, Well, Badge, Tab, Nav, NavItem, Button, Glyphicon } from 'react-bootstrap';

import MapPane from './pane/MapPane';
import CirclecutPane from './pane/CirclecutPane';
import CircleListPane from './pane/CircleListPane';
import FavoriteListPane from './pane/FavoriteListPane';

import PublicLinkModal from './modal/PublicLinkModal';
import ExportChecklistModal from './modal/ExportChecklistModal';
import CircleDescriptionModal from './modal/CircleDescriptionModal';

class AdminRoot extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        circleList:  [],
        circleIdx:   {},
        favoriteIdx: {},
        sort_order:  [],
        loading:     {},
        map: null,
        showCircleDescModal: false,
        showPublicLinkModal: false,
        showExportChecklistModal: false,
        selectedCircle: null,
        me: null,
        config: null,
    };

    this.AUTH_ENDPOINT      = "https://auth.familiar-life.info";
    this.CHECKLIST_ENDPOINT = "https://bt68jbe0eg.execute-api.ap-northeast-1.amazonaws.com/dev/endpoint";

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
    this.openPublicLinkModal        = this.openPublicLinkModal.bind(this);
    this.closePublicLinkModal       = this.closePublicLinkModal.bind(this);
    this.openExportChecklistModal   = this.openExportChecklistModal.bind(this);
    this.closeExportChecklistModal  = this.closeExportChecklistModal.bind(this);
  }

  callChecklistApi(args) {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject("No access_token. Please login!!");
    }

    return fetch(this.CHECKLIST_ENDPOINT, {
      headers: new Headers({ 'Authorization': "Bearer " + token }),
      method: 'POST',
      body: JSON.stringify(args),
      cors: true,
    }).then(data => data.json());
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
    const circle = this.state.circleList.filter(c => c.circle_id === circle_id)[0]

    if (circle) {
      this.setState({ selectedCircle: circle, showCircleDescModal: true });
    } else {
      this.setState({ showCircleDescModal: false });
    }
  }

  componentDidMount() {
    this.getAuthData().then(this.getUserData());
    this.getCircleList().then(this.getMapData());
  }

  getCircleList() {
    this.addLoading("circle");
    return fetch(window.location.origin + '/aqmd3rd.json', { credentials: 'include' })
      .then(data => data.json())
      .then(data => {
        this.removeLoading("circle");
        console.log("CIRCLE_DATA_OK:", data.circles.length);
        this.setState({ circleList: data.circles, sort_order: data.sort_order });
        this.componentWillReceiveProps(this.props);
      })
      .catch(err => console.log)
  }

  getMapData() {
    this.addLoading("map");
    return fetch(window.location.origin + '/map.json', { credentials: 'include' })
      .then(data => data.json())
      .then(data => {
        this.removeLoading("map");
        console.log("MAP_DATA_OK");
        const maps = [];

        for (const sym of Object.keys(data.positions)) {
          const positions = data.positions[sym];

          for (const pos of positions)  {
            for (const i of _.range(pos.start, pos.end + 1) ) {
              maps.push({
                sym: sym,
                num: i,
                top: (pos.y + (i - ( pos.start - 1 ) -1) * 18 ) + "px",
                left: pos.x + "px",
              });
            }
          }
        }

        this.setState({ map: maps });
      })
      .catch(err => console.log)
  }

  getUserData() {
    this.addLoading("user");
    return this
      .callChecklistApi({ command: "list", exhibition_id: "aqmd3rd" })
      .then(data => {
        if (data.error) {
          console.error("Error on fetch user data:", data.error)
          return;
        }

        this.removeLoading("user");

        console.log("FAVORITE_DATA_OK:", data.length);
        const favoriteIdx = {};
        for (const f of data.favorite) {
          favoriteIdx[f.circle_id] = f;
        }
        this.setState({ favoriteIdx, config: data.config });
      })
      .catch(err => {
        console.error("Error on fetch user data:", err);
      });
  }

  getAuthData() {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject("No access_token. Please login!!");
    }

    const headers = new Headers();
    headers.append('Authorization', "Bearer " + token);

    this.addLoading("auth");
    return fetch(this.AUTH_ENDPOINT + "/me", { headers: headers, mode: "cors" })
      .then(data => data.json())
      .then(data => {
        this.removeLoading("auth");
        console.log("LOGIN_DATA_OK:", data);
        this.setState({ me: data });
      })
      .catch(err => {
        this.removeLoading("auth");
        console.log("LOGIN_DATA_NG:", err);
        this.setState({ me: null });
      })
  }

  login() {
    const getJwtToken = event => {
      localStorage.setItem("token", event.data);
      this.getAuthData();
      this.getUserData();
    };

    window.open(this.AUTH_ENDPOINT + "/auth");
    window.addEventListener('message', getJwtToken, false);
  }

  logout() {
    localStorage.clear();
    this.setState({ me: null, favoriteIdx: {} });
  }

  openCircleDescModal(selectedCircle) {
    const param = new URLSearchParams();
    param.append("circle_id", selectedCircle.circle_id);
    this.props.history.push("?" + param.toString());
  }

  closeCircleDescModal() {
    this.props.history.push("?");
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
    const { favoriteIdx } = this.state;

    this.addLoading(circle.circle_id);
    this.callChecklistApi({ command: "add", exhibition_id: "aqmd3rd", circle_id: circle.circle_id })
      .then(data => {
        this.removeLoading(circle.circle_id);

        if(data.error) {
          alert(data.error + ": エラーが発生しました。しばらく経ってもエラーが続く場合は管理者に問い合わせてください。");
        } else {
          console.log("ADD_FAVORITE", data);
          favoriteIdx[circle.circle_id] = data;
          this.setState({ favoriteIdx });
        }
      })
      .catch(err => console.log);
  }

  removeFavorite(circle) {
    const { favoriteIdx } = this.state;

    this.addLoading(circle.circle_id);
    this.callChecklistApi({ command: "remove", circle_id: circle.circle_id })
      .then(data => {
        this.removeLoading(circle.circle_id);
        console.log("REMOVE_FAVORITE", data);
        delete favoriteIdx[circle.circle_id];
        this.setState({ favoriteIdx });
      })
      .catch(err => console.log);
  }

  updateFavoriteComment(circle,comment) {
    const { favoriteIdx } = this.state;

    this.addLoading(circle.circle_id);
    this.callChecklistApi({ command: "update", circle_id: circle.circle_id, comment: comment })
      .then(data => {
        this.removeLoading(circle.circle_id);
        console.log("UPDATE_FAVORITE", data);
        const fav = favoriteIdx[circle.circle_id];
        fav.comment = comment;
        this.setState({ favoriteIdx });
      })
      .catch(err => console.log);
  }

  updatePublicLinkSetting(isPublic) {
    this.callChecklistApi({ command: "public", exhibition_id: "aqmd3rd", public: isPublic })
      .then(data => {
        console.log("UPDATE_PUBLIC_LINK", data);
        this.setState({ config: { public: isPublic } });
      })
      .catch(err => console.log);
  }

  render() {
    const { circleList, favoriteIdx, loading, map, showCircleDescModal, showPublicLinkModal, showExportChecklistModal, selectedCircle, me, config } = this.state;

    return <div className="container">
      <br/>
      <Well bsSize="small" className="clearfix">
        <span>サークル一覧 (アクアマリンドリーム)  <Badge>{circleList.length}</Badge></span>
        <div className="pull-right">
          {
            loading.auth
              ? <Button bsStyle="warning" bsSize="xs">
                  <FontAwesome name="spinner" spin pulse={true} /> 読み込み中...
                </Button>
              : me
                ? <ButtonToolbar>
                    <DropdownButton
                      bsStyle="success"
                      bsSize="xsmall"
                      id="dropdown-size-extra-small"
                      title={<span><FontAwesome name="twitter"/> {me.screen_name}</span>}>
                        <MenuItem eventKey="1">
                          {me.display_name + ' '}
                          <Image circle src={me.profile_image_url} style={{width: "32px", height: "32px", border: "1px solid gray" }}/>
                        </MenuItem>
                        <MenuItem eventKey="2" onClick={this.logout}>ログアウト <FontAwesome name="sign-out"/></MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="3" onClick={this.openExportChecklistModal}><Glyphicon glyph="export"/> エクスポート</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="4" onClick={this.openPublicLinkModal}><Glyphicon glyph="link"/> 公開設定</MenuItem>
                    </DropdownButton>
                  </ButtonToolbar>
                : <Button bsStyle="primary" bsSize="xs" onClick={this.login}>
                    <FontAwesome name="twitter"/> Login via Twitter
                  </Button>
          }
        </div>
      </Well>
      {
        !me &&
          <Alert>
            <Glyphicon glyph="exclamation-sign"/> ログインを行うことでチェックリストの作成を行うことができます。
          </Alert>
      }
      <Tab.Container id="left-tabs-example" defaultActiveKey="list">
        <div>
          <Nav bsStyle="pills">
            <NavItem eventKey="list"><Glyphicon glyph="th-list"/> リスト表示</NavItem>
            <NavItem eventKey="circlecut"><Glyphicon glyph="picture"/> サークルカット</NavItem>
            <NavItem eventKey="map"><Glyphicon glyph="map-marker"/> マップ</NavItem>
            <NavItem eventKey="favorite"><Glyphicon glyph="star"/> お気に入り済み <Badge>{Object.keys(favoriteIdx).length}</Badge></NavItem>
          </Nav>
          <br/>
          <Tab.Content>
            <Tab.Pane eventKey="list">
              <CircleListPane
                circles={circleList}
                favorites={favoriteIdx}
                loadings={loading}
                onRowClick={this.openCircleDescModal}
                onAddFavorite={this.addFavorite}
                onRemoveFavorite={this.removeFavorite}
                showChecklistComponent={!!me}/>
            </Tab.Pane>
            <Tab.Pane eventKey="circlecut">
              <CirclecutPane
                circles={circleList}
                favorites={favoriteIdx}
                loadings={loading}
                onImageClick={this.openCircleDescModal}
                onAddFavorite={this.addFavorite}
                onRemoveFavorite={this.removeFavorite}
                showChecklistComponent={!!me}/>
            </Tab.Pane>
            <Tab.Pane eventKey="favorite">
              <FavoriteListPane
                circles={circleList}
                favorites={favoriteIdx}
                onRowClick={this.openCircleDescModal}/>
            </Tab.Pane>
            <Tab.Pane eventKey="map">
              <MapPane
                maps={map}
                circles={circleList}
                favorites={favoriteIdx}
                onCircleClick={this.openCircleDescModal}/>
            </Tab.Pane>
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
        showChecklistComponent={!!me}/>

      <PublicLinkModal
        show={showPublicLinkModal}
        config={config}
        onPublicLinkClick={this.updatePublicLinkSetting}
        onClose={this.closePublicLinkModal}/>

      <ExportChecklistModal
        show={showExportChecklistModal}
        onClose={this.closeExportChecklistModal}/>

    </div>;
  }
}

export default withRouter(AdminRoot);