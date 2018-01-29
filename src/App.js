import React from 'react';
import request from 'superagent';
import FontAwesome from 'react-fontawesome';
import ReactTable from "react-table";
import { Col, Button, Modal, Image, Glyphicon, Row } from 'react-bootstrap';

class AdminRoot extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        circles: [],
        sort_order: [],
        loading: true,
        modalShow: false,
        selectedCircle: null,
    };

    this.openModal      = this.openModal.bind(this);
    this.closeModal     = this.closeModal.bind(this);
    this.addFavorite    = this.addFavorite.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
  }

  componentDidMount() {
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
    const { circles, modalShow, selectedCircle } = this.state;

    return <div className="container">
      <h3>Checklist</h3>
      <Row>
        <div className="text-warning">
          <Glyphicon glyph="exclamation-sign"/>
          ログインを行うことでチェックリストの作成を行うことができます。
          <Button bsStyle="primary" bsSize="xs">
            <FontAwesome name="twitter" size="1x"/> Login via Twitter
          </Button>
        </div>
        <br/>
      </Row>
      <Modal show={modalShow} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {
              selectedCircle && <div>
                {selectedCircle.circle_name}
              </div>
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            selectedCircle && <div>
              <Image src={selectedCircle.circlecut}/>

              <h4>お品書き</h4>
              <p>{selectedCircle.circle_comment}</p>
            </div>
          }
        </Modal.Body>
      </Modal>

      <Row>
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
                },{ 
                  Header: "Pixiv",
                  headerStyle: { backgroundColor: "#ddd" },
                  accessor: "pixiv_id",
                  width: 60,
                  resizable: false,
                  className: "text-center",
                  Cell: row => row.value
                    ? <a href={row.value} target="_blank"><Glyphicon glyph="link"/></a>
                    : ""
                },{ 
                  Header: "HP",
                  headerStyle: { backgroundColor: "#ddd" },
                  accessor: "site_url",
                  width: 60, 
                  resizable: false,
                  className: "text-center",
                  Cell: row => row.value
                    ? <a href={row.value} target="_blank"><Glyphicon glyph="link"/></a>
                    : ""
                },
              ]  
            },{
              Header: "お品書き",
              headerStyle: { backgroundColor: "#dfd" },
              columns: [
                { 
                  Header: "リンク",
                  headerStyle: { backgroundColor: "#ddd" },
                  accessor: "circle_link",
                  className: "text-center",
                  width: 60,
                  resizable: false,
                  Cell: row => row.value
                    ? <a href={row.value} target="_blank"><Glyphicon glyph="link"/></a>
                    : ""
                },{ 
                  Header: "コメント",
                  headerStyle: { backgroundColor: "#ddd" },
                  accessor: "circle_comment",
                  width: 300, 
                  Cell: row => row.value
                    ? row.value
                    : <span className="text-muted">(未記入)</span>
                },
              ]
            },{
              Header: "チェックリスト",
              headerStyle: { backgroundColor: "#dff" },
              columns: [
                { 
                  Header: "場所",
                  headerStyle: { backgroundColor: "#ddd" },
                  accessor: "space_sym",
                  width: 50, 
                  resizable: false,
                  className: "text-center",
                  Cell: row => {
                    return row.original.favorite
                      ? <Glyphicon glyph="minus" onClick={e => { e.stopPropagation(); this.removeFavorite(row.original) }}/>
                      : <Glyphicon glyph="plus"  onClick={e => { e.stopPropagation(); this.addFavorite(row.original) }}/>
                  },
                },{ 
                  Header: "コメント",
                  headerStyle: { backgroundColor: "#ddd" },
                  accessor: "favorite.comment",
                  width: 300, 
                  Cell: row => row.value
                    ? row.value
                    : <span className="text-muted">(未記入)</span>
                },
              ]
            }
          ]} />
      </Row>

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