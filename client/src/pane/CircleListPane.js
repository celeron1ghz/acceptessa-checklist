import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table-6';
import "react-table-6/react-table.css";
import _ from 'lodash';
import { Badge, Card, Button } from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
    const { favorites, showChecklistComponent, loadings, publicChecklist, enableChecklist, spaceSymSorter } = this.props;
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
        Header: "スペース",
        headerStyle: { backgroundColor: "#222", color: "#fff" },
        columns: [
          {
            headerStyle: { backgroundColor: "#ddd" },
            accessor: "space_sym",
            width: 70,
            show: enableChecklist,
            resizable: false,
            className: "text-center",
            Header: "記号",
            sortMethod: spaceSymSorter,
            Filter: ({ filter, onChange }) =>
              <select
                onChange={event => onChange(event.target.value)}
                style={{ width: "100%" }}
                value={filter ? filter.value : "all"}>
                <option value=""></option>
                {_.uniq(circleList.map(c => c.space_sym)).map(sym => <option key={sym} value={sym}>{sym}</option>)}
              </select>
          },{
            headerStyle: { backgroundColor: "#ddd" },
            accessor: "space_num",
            width: 60,
            show: enableChecklist,
            resizable: false,
            className: "text-center",
            Header: "番号",
            Filter: makePlaceholderFilter(),
          }
        ]
      },
      {
        Header: "サークル情報",
        headerStyle: { backgroundColor: "#666", color: "#fff" },
        columns: [
          {
            headerStyle: { backgroundColor: "#ddd" },
            accessor: "circle_name",
            Header: "サークル名",
            Filter: makePlaceholderFilter("(検索)"),
          },{
            headerStyle: { backgroundColor: "#ddd" },
            accessor: "penname",
            width: 200,
            Header: "作者名",
            Filter: makePlaceholderFilter("(検索)"),
          },
          {
            headerStyle: { backgroundColor: "#ddd" },
            accessor: "twitter_id",
            className: "text-center",
            width: 75,
            show: enableChecklist,
            resizable: false,
            Header: "Twitter",
            Cell: row => row.value
                ? <a href={'https://twitter.com/' + row.value} onClick={e => { e.stopPropagation() }} target="_blank"><FontAwesomeIcon icon={['fab', 'twitter']} /></a>
                : "",
            sortable: false,
          },
          {
            headerStyle: { backgroundColor: "#ddd" },
            accessor: "circle_link",
            className: "text-center",
            width: 75,
            show: enableChecklist,
            resizable: false,
            Header: "Web",
            Cell: row => row.value
                ? <a href={row.value} onClick={e => { e.stopPropagation() }} target="_blank"><FontAwesomeIcon icon={['fas', 'external-link-alt']} /></a>
                : "",
            sortable: false,
          },
          {
            headerStyle: { backgroundColor: "#ddd" },
            accessor: "circle_comment",
            className: "text-center",
            width: 100,
            show: enableChecklist,
            Header: "お品書き",
            Filter: makePlaceholderFilter("(検索)"),
            Cell: row => row.value
                ? <FontAwesomeIcon icon={['far', 'comment-dots']} />
                : '',
          }
        ]
      }
    ];

    if (showChecklistComponent) {
      columns.unshift({
        Header: <FontAwesomeIcon icon={['fas', 'star']} />,
        headerStyle: { backgroundColor: "#ff5" },
        columns: [
          {
            headerStyle: { backgroundColor: "#ddd" },
            Header: "",
            accessor: "favorite",
            width: 70,
            resizable: false,
            filterable: false,
            className: "text-center",
            Cell: row => {
              return loadings[row.original.circle_id] || loadings.user
                ? <Button variant="warning" size="xs" style={{ width: "60px" }} onClick={e => { e.stopPropagation(); }}>
                    <FontAwesomeIcon icon={['fas', 'spinner']} spin pulse={true} />
                  </Button>
                : row.original.favorite
                  ? <Button variant="danger" size="sm" style={{ width: "60px" }} onClick={e => { e.stopPropagation(); this.removeFavorite(row.original); }}>
                      <FontAwesomeIcon icon={['fas', 'star']} /> 削除
                    </Button>
                  : <Button variant="primary" size="sm" style={{ width: "60px" }} onClick={e => { e.stopPropagation(); this.addFavorite(row.original); }}>
                      <FontAwesomeIcon icon={['far', 'star']} /> 追加
                    </Button>
            },
          },
        ],
      });
    }

    if (publicChecklist) {
      columns.unshift({
        Header: <FontAwesomeIcon icon={['fas', 'check']} />,
        headerStyle: { backgroundColor: "#f44", color: "#fff" },
        columns: [
          {
            headerStyle: { backgroundColor: "#ddd", fontSize: "12px" },
            accessor: "publicChecklist",
            width: 30,
            resizable: false,
            filterable: false,
            className: "text-center",
            Cell: row => row.value
                ? <FontAwesomeIcon icon={['fas', 'check']} />
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
          <Card body bg="light" className="clearfix mt1e">
            <a href={"https://twitter.com/" + publicChecklist.config.member_id} target="_blank">
              <FontAwesomeIcon icon={['fab', 'twitter']} />{publicChecklist.config.member_id}
            </a>
            &nbsp;さんのチェックリスト
            &nbsp;<Badge pill variant="primary">{Object.keys(publicChecklist.idx).length}</Badge>&nbsp;
            を「<FontAwesomeIcon icon={['fas', 'check']} />」で表示しています。
            <div className="pull-right">
              <Button variant="success" size="sm" onClick={this.removePublicChecklist.bind(this)}>
                <FontAwesomeIcon icon={['fas', 'times']} /> 非表示にする
              </Button>
            </div>
          </Card>
      }
      {
        table &&
        <div className="mt1e">
          {
            table.filtered.length !== 0
              ? <div>
                  {table.filtered.map(f => <span key={f.id}><b>{jp[f.id]}</b>='{f.value}' </span>)} の検索結果
                  (<b>{table.data.length}</b> サークル中 <b>{table.sortedData.length}</b> 件)
                </div>
              : <div className="text-muted">
                  <FontAwesomeIcon icon={['fas', 'info-circle']} /> テーブルの行をクリックすると詳細画面が開きます。
                </div>
          }
        </div>
      }
      <ReactTable
        filterable
        className="-striped -highlight mt1e"
        pageSize={table && table.sortedData.length !== 0 ? table.sortedData.length : circleList.length}
        showPageSizeOptions={false}
        showPaginationTop={false}
        showPaginationBottom={false}
        loading={circleList.length === "0"}
        columns={columns}
        data={circleList}
        defaultSorted={[ { id: 'space_sym' }, { id: 'space_num' } ]}
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
  enableChecklist: PropTypes.bool,
  spaceSymSorter: PropTypes.func,
};

export default CircleListPane;