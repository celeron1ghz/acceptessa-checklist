import React from 'react';
import request from 'superagent';
import FontAwesome from 'react-fontawesome';
import ReactTable from "react-table";
import { Navbar, Button, Glyphicon } from 'react-bootstrap';

import CircleDescriptionModal from './common/CircleDescriptionModal';

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
      <CircleDescriptionModal show={modalShow} circle={selectedCircle} onClose={this.closeModal}/>

      <ReactTable
        className="-striped -highlight"
        defaultPageSize={20}
        showPagination={true}
        data={circles}
        getTrProps={(a,b) => {
          return {
            style: { color: b && b.original && b.original.favorite ? "red" : "" },
            onClick: () => {
              this.openModal(b.original);
            }
          };
        }}
        columns={[
          {
            Header: "チェック",
            headerStyle: { backgroundColor: "#dff", fontSize: "12px" },
            columns: [
              {
                Header: "場所",
                headerStyle: { backgroundColor: "#ddd", fontSize: "12px" },
                accessor: "favorite",
                width: 70,
                resizable: false,
                className: "text-center",
                Cell: row => {
                  return row.original.favorite
                    ? <Button bsStyle="danger" bsSize="xs" onClick={e => { e.stopPropagation(); this.removeFavorite(row.original)}}><Glyphicon glyph="minus"/> 削除</Button>
                    : <Button bsStyle="primary" bsSize="xs" onClick={e => { e.stopPropagation(); this.addFavorite(row.original)  }}><Glyphicon glyph="plus"/> 追加</Button>
                },
              }
            ]
          },{
            Header: "サークル情報",
            headerStyle: { backgroundColor: "#ddf" },
            columns: [
              {
                Header: "場所",
                headerStyle: { backgroundColor: "#ddd" },
                accessor: "space_sym",
                width: 60,
                resizable: false,
                className: "text-center",
              },{
                Header: "数字",
                headerStyle: { backgroundColor: "#ddd" },
                accessor: "space_num",
                width: 40,
                resizable: false,
                className: "text-center",
              },{
                Header: "サークル名",
                headerStyle: { backgroundColor: "#ddd" },
                accessor: "circle_name",
                width: 200,
              },{
                Header: "作者",
                headerStyle: { backgroundColor: "#ddd" },
                accessor: "penname",
                width: 100,
              }
            ]
          },{
            Header: "お品書き",
            headerStyle: { backgroundColor: "#dfd" },
            columns: [
              {
                Header: "コメント",
                headerStyle: { backgroundColor: "#ddd" },
                accessor: "circle_comment",
                width: 300,
                Cell: row => row.value
                  ? row.value
                  : <span style={{ color: "#ccc" }}>(未記入)</span>
              },{
                Header: "Link",
                headerStyle: { backgroundColor: "#ddd" },
                accessor: "circle_link",
                className: "text-center",
                width: 40,
                resizable: false,
                Cell: row => row.value
                  ? <a href={row.value} onClick={e => { e.stopPropagation() }} target="_blank"><Glyphicon glyph="link"/></a>
                  : ""
              }
            ]
          },{
            Header: "チェックリスト",
            headerStyle: { backgroundColor: "#dff" },
            columns: [
              {
                Header: "コメント",
                headerStyle: { backgroundColor: "#ddd" },
                accessor: "favorite.comment",
                width: 300,
                Cell: row => row.value
                  ? row.value
                  : <span style={{ color: "#ccc" }}>(未記入)</span>
              },
            ]
          }
        ]} />
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
