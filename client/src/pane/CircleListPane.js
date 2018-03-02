import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from "react-table";
import _ from 'lodash';
import { Badge, Alert, Glyphicon, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

class CircleListPane extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { table: null };
  }

  addFavorite(circle) {
    this.props.onAddFavorite(circle);
  }

  removeFavorite(circle) {
    this.props.onRemoveFavorite(circle);
  }

  rowClick(circle) {
    this.props.onRowClick(circle);
  }

  removePublicChecklist() {
    this.props.onRemovePublicChecklist();
  }

  render() {
    const { favorites, showChecklistComponent, loadings, publicChecklist } = this.props;
    const { table } = this.state;
    const circleList = _.cloneDeep(this.props.circles);

    for (const c of circleList) {
      if (favorites[c.circle_id]) {
        c.favorite = favorites[c.circle_id];
      }

      if (publicChecklist && publicChecklist.idx[c.circle_id]) {
        c.publicChecklist = publicChecklist.idx[c.circle_id];
      }
    }

    function makePlaceholderFilter(placeholder) {
      return ({filter, onChange}) => (
        <input type='text'
          placeholder={placeholder}
          style={{
            width: '100%'
          }}
          value={filter ? filter.value : ''}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    }

    const columns = [
      {
        Header: "サークル情報",
        headerStyle: { backgroundColor: "#ddf" },
        columns: [
          {
            headerStyle: { backgroundColor: "#ddd" },
            accessor: "space_sym",
            width: 100,
            resizable: false,
            className: "text-center",
            Filter: ({ filter, onChange }) =>
              <select
                onChange={event => onChange(event.target.value)}
                style={{ width: "100%" }}
                value={filter ? filter.value : "all"}>
                  <option value="">全て</option>
                  {_.uniq(circleList.map(c => c.space_sym)).map(sym => <option key={sym} value={sym}>{sym}</option>)}
              </select>
          },{
            headerStyle: { backgroundColor: "#ddd" },
            accessor: "space_num",
            width: 55,
            resizable: false,
            className: "text-center",
            Filter: makePlaceholderFilter("(数)"),
          },{
            headerStyle: { backgroundColor: "#ddd" },
            accessor: "circle_name",
            width: 250,
            Filter: makePlaceholderFilter("(サークル名を検索)"),
          },{
            headerStyle: { backgroundColor: "#ddd" },
            accessor: "penname",
            width: 150,
            Filter: makePlaceholderFilter("(作者を検索)"),
          }
        ]
      },{
        Header: "お品書き",
        headerStyle: { backgroundColor: "#dfd" },
        columns: [
          {
            headerStyle: { backgroundColor: "#ddd" },
            accessor: "circle_link",
            className: "text-center",
            width: 75,
            resizable: false,
            Cell: row => row.value
              ? <a href={row.value} onClick={e => { e.stopPropagation() }} target="_blank"><Glyphicon glyph="link"/></a>
              : "",
            Filter: ({ filter, onChange }) => {
              return <select
                onChange={event => onChange(event.target.value)}
                style={{ width: "100%" }}
                value={filter ? filter.value : ""}>
                  <option value="なし">なし</option>
                  <option value="あり">あり</option>
                  <option value="">全て</option>
              </select>;
            },
            filterMethod: (filter, row, column) => {
              const state = filter.value;
              if (state === "あり") {
                return !!row.circle_link;
              } else if (state === "なし") {
                return !row.circle_link;
              } else {
                return true;
              }
            },
          },{
            headerStyle: { backgroundColor: "#ddd" },
            accessor: "circle_comment",
            width: 490,
            Filter: makePlaceholderFilter("(お品書きを検索)"),
            Cell: row => row.value
              ? row.value
              : <span style={{ color: "#ccc" }}>(未記入)</span>
          }
        ]
      }
    ];

    if (showChecklistComponent) {
      columns.unshift({
        Header: "チェック",
        headerStyle: { backgroundColor: "#dff", fontSize: "12px" },
        columns: [
          {
            headerStyle: { backgroundColor: "#ddd", fontSize: "12px" },
            accessor: "favorite",
            width: 80,
            resizable: false,
            filterable: false,
            className: "text-center",
            Cell: row => {
              return loadings[row.original.circle_id] || loadings.user
                ? <Button bsStyle="warning" bsSize="xs" style={{ width: "65px" }} onClick={e => { e.stopPropagation(); }}>
                    <FontAwesome name="spinner" spin pulse={true} /> 処理中
                  </Button>
                : row.original.favorite
                  ? <Button bsStyle="danger" bsSize="xs" style={{ width: "65px" }} onClick={e => { e.stopPropagation(); this.removeFavorite(row.original)}}>
                      <Glyphicon glyph="minus"/> 削除
                    </Button>
                  : <Button bsStyle="primary" bsSize="xs" style={{ width: "65px" }} onClick={e => { e.stopPropagation(); this.addFavorite(row.original)  }}>
                      <Glyphicon glyph="plus"/> 追加
                    </Button>
            },
          },
        ],
      });
    }

    if (publicChecklist) {
      columns.unshift({
        Header: "レ",
        headerStyle: { backgroundColor: "#dff", fontSize: "12px" },
        columns: [
          {
            headerStyle: { backgroundColor: "#ddd", fontSize: "12px" },
            accessor: "publicChecklist",
            width: 30,
            resizable: false,
            filterable: false,
            className: "text-center",
            Cell: row => row.value
                ? <Glyphicon glyph="ok"/>
                : ""
            ,
          },
        ],
      });
    }

    const jp = {
      circle_name: "サークル名",
      penname:     "作者",
      space_sym:   "記号",
      space_num:   "数字",
      circle_link: "お品書きのリンク",
      circle_comment: "お品書きのコメント",
    };

    return <div>
      {
        publicChecklist &&
          <Alert bsStyle="success" className="clearfix">
            <a href={"https://twitte.com/" + publicChecklist.config.member_id} target="_blank">
              <FontAwesome name="twitter"/>{publicChecklist.config.member_id}
            </a>
            &nbsp;さんのチェックリスト
            &nbsp;<Badge>{Object.keys(publicChecklist.idx).length}</Badge>&nbsp;
            を「<Glyphicon glyph="ok"/>」で表示しています。
            <div className="pull-right">
              <Button bsStyle="success" bsSize="xs" onClick={this.removePublicChecklist.bind(this)}>
                <Glyphicon glyph="remove"/> 非表示にする
              </Button>
            </div>
          </Alert>
      }
      {
        table && <div>
          {
            table.filtered.length !== 0
              ? <div>
                  {table.filtered.map(f => <span key={f.id}><b>{jp[f.id]}</b>='{f.value}' </span>)} の検索結果
                  (<b>{table.data.length}</b> サークル中 <b>{table.sortedData.length}</b> 件)
                </div>
              : <div className="text-muted">
                  <Glyphicon glyph="exclamation-sign"/> テーブルの行をクリックすると詳細画面が開きます。
                </div>
          }
        </div>
      }
      <ReactTable
        filterable
        className="-striped -highlight"
        pageSize={table && table.sortedData.length !== 0 ? table.sortedData.length : circleList.length}
        showPageSizeOptions={false}
        showPaginationTop={false}
        showPaginationBottom={false}
        loading={circleList.length === "0"}
        columns={columns}
        data={circleList}
        Filter={1}
        defaultFilterMethod={(filter, row, column) => {
          const id = filter.pivotId || filter.id;
          return row[id] !== undefined ? String(row[id]).indexOf(filter.value) !== -1 : false;
        }}
        onFetchData={(state, instance) => {
          this.setState({ table: state });
        }}
        getTrProps={(a,b) => {
          return {
            style: { color: b && b.original && b.original.favorite ? "red" : "" },
            onClick: () => { this.rowClick(b.original) }
          };
        }}
        getTdProps={(a,b) => {
          return {
            style: { padding: "3px 5px" },
          };
        }}/>
      <br/>
    </div>;
  }
}

CircleListPane.propTypes = {
  circles: PropTypes.array.isRequired,
  favorites: PropTypes.object.isRequired,
  publicChecklist: PropTypes.object,
  loadings: PropTypes.object.isRequired,
  onRowClick: PropTypes.func.isRequired,
  onAddFavorite: PropTypes.func.isRequired,
  onRemoveFavorite: PropTypes.func.isRequired,
  onRemovePublicChecklist: PropTypes.func.isRequired,
  showChecklistComponent: PropTypes.bool,
};

export default CircleListPane;