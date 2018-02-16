import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from "react-table";
import _ from 'lodash';
import { Glyphicon } from 'react-bootstrap';

class FavoriteListPane extends React.Component {
  rowClick(circle) {
    this.props.onRowClick(circle);
  }

  render() {
    const { favorites } = this.props;
    const circleList = _.cloneDeep(this.props.circles);

    for (const c of circleList) {
      if (favorites[c.circle_id]) {
        c.favorite = favorites[c.circle_id];
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

    const filtered = circleList.filter(c => c.favorite);
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

    return <div>
      <div className="text-muted">
        <Glyphicon glyph="exclamation-sign"/> テーブルの行をクリックすると詳細画面が開きます。
      </div>
      <ReactTable
        filterable
        className="-striped -highlight"
        pageSize={20}
        showPageSizeOptions={false}
        showPaginationTop={false}
        showPaginationBottom={false}
        loading={circleList.length === "0"}
        columns={columns}
        data={filtered}
        Filter={1}
        defaultFilterMethod={(filter, row, column) => {
          const id = filter.pivotId || filter.id;
          return row[id] !== undefined ? String(row[id]).indexOf(filter.value) !== -1 : false;
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

FavoriteListPane.propTypes = {
  circles: PropTypes.array.isRequired,
  favorites: PropTypes.object.isRequired,
  onRowClick: PropTypes.func.isRequired,
};

export default FavoriteListPane;