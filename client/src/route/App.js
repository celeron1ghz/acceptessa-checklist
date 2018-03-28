import React from 'react';
import FontAwesome from 'react-fontawesome';
import { withRouter } from 'react-router-dom';
import { Image, ButtonToolbar, DropdownButton, MenuItem, Well, Badge, Tab, Nav, NavItem, Button, Glyphicon } from 'react-bootstrap';

import MapPane from '../pane/MapPane';
import CirclecutPane from '../pane/CirclecutPane';
import CircleListPane from '../pane/CircleListPane';
import FavoriteListPane from '../pane/FavoriteListPane';

import PublicLinkModal from '../modal/PublicLinkModal';
import ExportChecklistModal from '../modal/ExportChecklistModal';
import CircleDescriptionModal from '../modal/CircleDescriptionModal';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.min.css';
import '../../node_modules/react-table/react-table.css';
import '../../node_modules/react-bootstrap-toggle/dist/bootstrap2-toggle.css';
import '../../node_modules/font-awesome/css/font-awesome.min.css';

class AdminRoot extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        circleList:  [],
        circleIdx:   {},
        favoriteIdx: {},
        sort_order:  [],
        loading:     {},
        publicChecklist: null,
        exhibition:  null,
        map: null,
        showCircleDescModal: false,
        showPublicLinkModal: false,
        showExportChecklistModal: false,
        selectedCircle: null,
        me: null,
        config: null,
        enableChecklist: false,
    };

    this.AUTH_ENDPOINT      = "https://auth.familiar-life.info";
    this.CHECKLIST_ENDPOINT = "https://9l0aadde83.execute-api.ap-northeast-1.amazonaws.com/dev/";

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

    this.openPublicLinkModal          = this.openPublicLinkModal.bind(this);
    this.closePublicLinkModal         = this.closePublicLinkModal.bind(this);
    this.openExportChecklistModal     = this.openExportChecklistModal.bind(this);
    this.closeExportChecklistModal    = this.closeExportChecklistModal.bind(this);
    this.removePublicChecklistDisplay = this.removePublicChecklistDisplay.bind(this);

    this.getCircleList      = this.getCircleList.bind(this);
    //this.getMapData         = this.getMapData.bind(this);
    this.getUserData        = this.getUserData.bind(this);
    this.getShareChecklist  = this.getShareChecklist.bind(this);
  }

  callChecklistApi(args, load_type) {
    const token = localStorage.getItem("token");

    if (!token) return Promise.reject("No access_token. Please login!!");

    if (load_type) this.addLoading(load_type);

    return fetch(this.CHECKLIST_ENDPOINT, {
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

      if (data && data.error && data.error === "EXPIRED") {
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
    const { enableChecklist } = this.state;
    const param = new URLSearchParams(window.location.search);
    const chain = this.getCircleList().then(data => {
      console.log(this.state)
      return data;
    });

    console.log(enableChecklist)

    if ( param.get("id") ) {
      chain
        .then(this.getShareChecklist.bind(this,param.get("id")))
        .then(this.getUserData)
    } else {
      chain
        .then(this.getUserData)
    }
  }

  getShareChecklist(member_id) {
    const { exhibition } = this.state;

    return fetch(`${this.CHECKLIST_ENDPOINT}public/${exhibition.id}/?mid=${member_id}`, { cors: true })
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
      })
  }

  getCircleList() {
    const exhibition = window.location.search.replace('?','');
    this.addLoading("circle");
    return fetch('https://data.familiar-life.info/' + exhibition + '.json')
      .then(data => data.ok ? data : Promise.reject(data))
      .then(data => data.json())
      .then(data => {
        this.removeLoading("circle");
        console.log("CIRCLE_DATA_OK:", data.circles.length);
        const enableChecklist = data.circles.filter(c => c.space_sym && c.space_num).length !== 0;

        this.setState({
          circleList: data.circles,
          sort_order: data.sort_order,
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

/*
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
*/
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
      localStorage.setItem("token", event.data);
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

  render() {
    const {
      circleList, favoriteIdx, loading, map,
      showCircleDescModal, showPublicLinkModal, showExportChecklistModal, publicChecklist,
      selectedCircle, me, config, exhibition, enableChecklist,
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
      <Well bsSize="small" className="clearfix">
        <span>
          サークル一覧
          {
            exhibition
              ? <span> ({exhibition.exhibition_name}) <Badge>{circleList.length}</Badge></span>
              : ' '
          }
        </span>
        {
          enableChecklist &&
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
        }
      </Well>
      {
        (enableChecklist && !me) &&
          <div className="text-info">
            <Glyphicon glyph="exclamation-sign"/> ログインを行うことでチェックリストの作成を行うことができます。
            <br/>
            <br/>
          </div>
      }
      <Tab.Container id="left-tabs-example" defaultActiveKey="list">
        <div>
          <Nav bsStyle="pills">
            <NavItem eventKey="list"><Glyphicon glyph="th-list"/> リスト表示</NavItem>
            <NavItem eventKey="circlecut"><Glyphicon glyph="picture"/> サークルカット</NavItem>
            {
              map &&
                <NavItem eventKey="map"><Glyphicon glyph="map-marker"/> マップ</NavItem>
            }
            {
              enableChecklist &&
                <NavItem eventKey="favorite"><Glyphicon glyph="star"/> お気に入り済み <Badge>{Object.keys(favoriteIdx).length}</Badge></NavItem>
            }
          </Nav>
          <br/>
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
                enableChecklist={enableChecklist}/>
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
            {
              enableChecklist &&
                <Tab.Pane eventKey="favorite">
                  <FavoriteListPane
                    circles={circleList}
                    favorites={favoriteIdx}
                    onRowClick={this.openCircleDescModal}/>
                </Tab.Pane>
            }
            {
              map &&
                <Tab.Pane eventKey="map">
                  <MapPane
                    maps={map}
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
        showChecklistComponent={!!me}/>

      <PublicLinkModal
        show={showPublicLinkModal}
        me={me}
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