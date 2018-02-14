import React from 'react';
import request from 'superagent';
import FontAwesome from 'react-fontawesome';
import { Tab, Nav, NavItem, Navbar, Button, Glyphicon } from 'react-bootstrap';

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
    }

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
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            {
              me && <span>{me.display_name} (@{me.screen_name}) のチェックリスト</span>
            }
            {
              !me && <span>チェックリスト</span>
            }
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
      </Navbar>
      {
        !me &&
          <div className="text-warning">
            <Glyphicon glyph="exclamation-sign"/>
            ログインを行うことでチェックリストの作成を行うことができます。
            <Button bsStyle="primary" bsSize="xs">
              <FontAwesome name="twitter"/> Login via Twitter
            </Button>
          </div>
      }
      <Tab.Container id="left-tabs-example" defaultActiveKey="list">
        <div>
          <Nav bsStyle="pills">
            <NavItem eventKey="list"><Glyphicon glyph="th-list"/> リスト表示</NavItem>
            <NavItem eventKey="circlecut"><Glyphicon glyph="picture"/> サークルカット</NavItem>
            <NavItem eventKey="favorite"><Glyphicon glyph="star"/> お気に入り済み</NavItem>
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
