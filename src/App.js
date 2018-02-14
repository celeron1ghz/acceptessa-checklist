import React from 'react';
import request from 'superagent';
import FontAwesome from 'react-fontawesome';
import { Alert, Well, Badge, Tab, Nav, NavItem, Button, Glyphicon } from 'react-bootstrap';

import CircleDescriptionModal from './common/CircleDescriptionModal';
import CircleListPane from './common/CircleListPane';
import CirclecutPane from './common/CirclecutPane';

class AdminRoot extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        circles: [],
        sort_order: [],
        loading: true,
        modalShow: false,
        selectedCircle: null,
        me: null,
    };

    this.BASE_URL       = "https://v7hwasc1o7.execute-api.ap-northeast-1.amazonaws.com/dev";
    this.openModal      = this.openModal.bind(this);
    this.closeModal     = this.closeModal.bind(this);
    this.addFavorite    = this.addFavorite.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
  }

  componentDidMount() {
    fetch(
      "https://v7hwasc1o7.execute-api.ap-northeast-1.amazonaws.com/dev/me?" + new Date().getTime(),
      { mode: "cors", credentials: 'include' }
    )
    .then(data => data.json())
    .then(data => { this.setState({ me: data }) })
    .catch(err => { this.setState({ me: null }) })

    request
      .get(window.location.origin + '/aqmd3rd.json')
      .end((err,res) => {
        let data = JSON.parse(res.text);
        this.setState({ circles: data.circles, sort_order: data.sort_order, loading: false });
      });
  }

  openModal(selectedCircle) {
    this.setState({ selectedCircle, modalShow: true });
  }

  closeModal() {
    this.setState({ modalShow: false });
  }

  addFavorite(circle) {
    circle.favorite = {
      created_at: new Date().getTime(),
      checked: 1,
      comment: null,
    };

    this.setState({ circle: this.state.circles });
  }

  removeFavorite(circle) {
    delete circle.favorite;

    this.setState({ circle: this.state.circles });
  }

  render() {
    const { circles, modalShow, selectedCircle, me } = this.state;

    return <div className="container">
      <br/>
      <Well bsSize="small" className="clearfix">
        <span>サークル一覧 (アクアマリンドリーム)</span>
        <div className="pull-right">
          {
            me
              ? <div>
                  @{me.screen_name}{' '}
                  <Button bsSize="xs" bsStyle="warning">
                    <FontAwesome name="sign-out"/> ログアウト
                  </Button>
                </div>
              : <Button bsStyle="primary" bsSize="xs" href={this.BASE_URL + "/auth"} target="_blank">
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
            <NavItem eventKey="list"><Glyphicon glyph="th-list"/> リスト表示 <Badge>{circles.length}</Badge></NavItem>
            <NavItem eventKey="circlecut"><Glyphicon glyph="picture"/> サークルカット <Badge>{circles.length}</Badge></NavItem>
            <NavItem eventKey="favorite"><Glyphicon glyph="star"/> お気に入り済み <Badge>28</Badge></NavItem>
          </Nav>
          <br/>
          <Tab.Content>
            <Tab.Pane eventKey="list">
              <CircleListPane
                circles={circles}
                onRowClick={this.openModal}
                onAddFavorite={this.addFavorite}
                onRemoveFavorite={this.removeFavorite}/>
            </Tab.Pane>
            <Tab.Pane eventKey="circlecut">
              <CirclecutPane
                circles={circles}
                onImageClick={this.openModal}
                onAddFavorite={this.addFavorite}
                onRemoveFavorite={this.removeFavorite}/>
            </Tab.Pane>
            <Tab.Pane eventKey="favorite">
              あたり
            </Tab.Pane>
          </Tab.Content>
        </div>
      </Tab.Container>

      <CircleDescriptionModal show={modalShow} circle={selectedCircle} onClose={this.closeModal}/>

      {
        this.state.loading &&
          <div className="text-center text-muted">
            <FontAwesome name="spinner" size="5x" spin pulse={true} /><h3>Loading...</h3>
          </div>
      }
      {this.props.children}
    </div>;
  }
}

export default AdminRoot;
