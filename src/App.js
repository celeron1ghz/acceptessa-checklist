import React from 'react';
import request from 'superagent';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router-dom';
import { Table, Nav, NavItem, Label, Button, Image, Panel, Badge, Glyphicon, Row, Col } from 'react-bootstrap';

class AdminRoot extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        circles: [],
        sort_order: [],
        loading: true,
        selected_sort_order: { col: "space_sym", asc: true },
        selected_view: "circlecut",
    };
    this.onChangeField     = this.onChangeField.bind(this);
    this.change_sort_order = this.change_sort_order.bind(this);
    this.change_view       = this.change_view.bind(this);
  }

  componentDidMount() {
    request
      .get(window.location.origin + '/aqmd3rd.json')
      .end((err,res) => {
        console.log(res.text)
        let data = JSON.parse(res.text);
        this.setState({ circles: data.circles, sort_order: data.sort_order, loading: false });
      });
  }

  onChangeField(e) {
    console.log(e.target.name + '->' + e.target.checked);
    this.setState({ [e.target.name]: e.target.checked }); 
  }

  change_sort_order(key) {
    const current = this.state.selected_sort_order;
    const order   = current.col !== key ? false : !current.asc;
    const circles = this.state.circles.sort((a,b) => {
      if ((a[key] || '') < (b[key] || '')) return -1;
      if ((a[key] || '') > (b[key] || '')) return 1;
      return 0;
    });

    console.log(key, order);
    this.setState({
      selected_sort_order: { col: key, asc: order },
      circles: order ? circles : circles.reverse(),
    });
  }

  change_view(key) {
    this.setState({ selected_view: key });
  }

  render() {
    const { selected_view, selected_sort_order } = this.state;
    const sort_order_mark = col => {
        return selected_sort_order.col === col && !selected_sort_order.asc ? "triangle-top" : "triangle-bottom";
    };

    return <div className="container">
      <Row style={{ marginBottom: "20px" }}>
        <Col>
          <Nav justified bsStyle="pills" onSelect={this.change_view}>
            <NavItem eventKey="circlecut" active={selected_view === "circlecut"}>サークルカット</NavItem>
            <NavItem eventKey="list"      active={selected_view === "list"}>一覧</NavItem>
          </Nav>
        </Col>
      </Row>
      {
        selected_view === "list" && <Row>
          <Table bordered striped condensed hover>
            <thead>
            <tr>
              <td>+</td>
              <td style={{ width: "100px" }}>スペース   <Glyphicon glyph={sort_order_mark("space_sym")}      onClick={this.change_sort_order.bind(this,"space_sym")}/></td>
              <td style={{ width: "150px" }}>サークル名 <Glyphicon glyph={sort_order_mark("circle_name")}    onClick={this.change_sort_order.bind(this,"circle_name")}/></td>
              <td style={{ width: "150px" }}>作者       <Glyphicon glyph={sort_order_mark("penname")}        onClick={this.change_sort_order.bind(this,"penname")}/></td>
              <td style={{ width: "150px" }}>お品書き   <Glyphicon glyph={sort_order_mark("circle_comment")} onClick={this.change_sort_order.bind(this,"circle_comment")}/></td>
              <td style={{ width: "150px" }}>リンク     <Glyphicon glyph={sort_order_mark("circle_link")}    onClick={this.change_sort_order.bind(this,"circle_link")}/></td>
            </tr>
            </thead>
            <tbody>
            {
              this.state.circles.map(c => {
                return <tr>
                  <td><Button bsStyle="info">+</Button></td>
                  <td>{c.space_sym}{c.space_num}</td>
                  <td>{c.circle_name}</td>
                  <td>{c.penname}</td>
                  <td>{c.circle_comment || <span className="text-muted">(未記入)</span>}</td>
                  <td>{c.circle_link    || <span className="text-muted">(未記入)</span>}</td>
                </tr>
              })
            }
            </tbody>
          </Table>
        </Row>
      }
      {
        selected_view === "circlecut" && <Row>
          <Col style={{ height: "100px" }}>
            <Nav justified bsStyle="pills" onSelect={this.change_sort_order}>
              <NavItem eventKey="space_sym"   active={selected_sort_order === "space_sym"}>配置番号順 <Glyphicon glyph={sort_order_mark("space_sym")} /></NavItem>
              <NavItem eventKey="circle_name" active={selected_sort_order === "circle_name"}>サークル名順<Glyphicon glyph={sort_order_mark("circle_name")} /></NavItem>
              <NavItem eventKey="penname"     active={selected_sort_order === "penname"}>ペンネーム順<Glyphicon glyph={sort_order_mark("penname")} /></NavItem>
            </Nav>
          </Col>
          {
            this.state.circles.map(c => {
              const twosp = c.space_count === "2";

              return <Col key={c.id} xs={twosp ? 12 : 6} sm={twosp ? 8 : 4} md={twosp ? 8 : 4} lg={twosp ? 6 : 3}>
                <Image src={c.circlecut}/>
                <div style={{ height: "100px" }}>
                  <div>
                  <Label>{c.space_sym} {c.space_num}</Label>
                  {c.circle_name}
                  {c.penname}
                  </div>
                  <div>
                  <Button bsStyle="info" bsSize="xs">+</Button>
                  {
                    c.twitter_id && <Button bsStyle="info" bsSize="xs" href={c.twitter_id}>Twitter</Button>
                  }
                  {
                    c.pixiv_id && <Button bsStyle="info" bsSize="xs" href={c.pixiv_id}>Pixiv</Button>
                  }
                  {
                    c.circle_link && <Button bsStyle="info" bsSize="xs" href={c.circle_link}>Web</Button>
                  }
                  </div>
                </div>
              </Col>
            })
          }
        </Row>
      }
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
