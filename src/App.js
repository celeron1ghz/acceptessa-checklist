import React from 'react';
import request from 'superagent';
import FontAwesome from 'react-fontawesome';
import ReactTable from "react-table";
//import { Link } from 'react-router-dom';
import { Modal, Image, Glyphicon, Row } from 'react-bootstrap';

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

    this.openModal  = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    request
      .get(window.location.origin + '/aqmd3rd.json')
      .end((err,res) => {
        let data = JSON.parse(res.text);
        this.setState({ circles: data.circles, sort_order: data.sort_order, loading: false });
      });
  }

  openModal(selectedCircle){
    this.setState({ selectedCircle, modalShow: true });
  }

  closeModal(){
    this.setState({ modalShow: false });
  }

  render() {
    const { circles, modalShow, selectedCircle } = this.state;

    return <div className="container">
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
            </div>
          }
        </Modal.Body>
      </Modal>

      <Row>
        <ReactTable
          className="-striped -highlight"
          defaultPageSize={20}
          showPagination={false}
          data={circles}
          getTrProps={(a,b) => {
            return {
              onClick: () => {
                this.openModal(b.original);
              }
            };
          }}
          columns={[
            {
              Header: "サークル情報",
              columns: [
                { 
                  Header: "場所",
                  headerStyle: { backgroundColor: "#ddd" },
                  accessor: "space_sym",
                  width: 50, 
                  resizable: false,
                  className: "text-center",
                  Cell: row => <Glyphicon glyph="plus"/>
                },{ 
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
              columns: [
                { 
                  Header: "リンク",
                  headerStyle: { backgroundColor: "#ddd" },
                  accessor: "circle_link",
                  className: "text-center",
                  width: 60,
                  resizable: false,
                  Cell: row => row.value
                    ? <Glyphicon glyph=""/>
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