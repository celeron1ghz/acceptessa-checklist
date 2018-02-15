import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from "react-table";
import _ from 'lodash';
import { Glyphicon, Button } from 'react-bootstrap';

class CircleListPane extends React.Component {
  addFavorite(circle) {
    this.props.onAddFavorite(circle);
  }

  removeFavorite(circle) {
    this.props.onRemoveFavorite(circle)
  }

  rowClick(circle) {
    this.props.onRowClick(circle);
  }

  render() {
    const { circles, showChecklistComponent } = this.props;

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
                  {_.uniq(circles.map(c => c.space_sym)).map(sym => <option value={sym}>{sym}</option>)}
              </select>
          },{
            headerStyle: { backgroundColor: "#ddd" },
            accessor: "space_num",
            width: 40,
            resizable: false,
            filterable: false,
            className: "text-center",
          },{
            headerStyle: { backgroundColor: "#ddd" },
            accessor: "circle_name",
            width: 250,
          },{
            headerStyle: { backgroundColor: "#ddd" },
            accessor: "penname",
            width: 150,
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
            width: 40,
            resizable: false,
            filterable: false,
            Cell: row => row.value
              ? <a href={row.value} onClick={e => { e.stopPropagation() }} target="_blank"><Glyphicon glyph="link"/></a>
              : ""
          },{
            headerStyle: { backgroundColor: "#ddd" },
            accessor: "circle_comment",
            width: 490,
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
            width: 70,
            resizable: false,
            filterable: false,
            className: "text-center",
            Cell: row => {
              return row.original.favorite
                ? <Button bsStyle="danger" bsSize="xs" onClick={e => { e.stopPropagation(); this.removeFavorite(row.original)}}><Glyphicon glyph="minus"/> 削除</Button>
                : <Button bsStyle="primary" bsSize="xs" onClick={e => { e.stopPropagation(); this.addFavorite(row.original)  }}><Glyphicon glyph="plus"/> 追加</Button>
            },
          },
        ],
      });

/*
      columns.push({
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
      });
*/

    }

    return <div>
      <ReactTable
        filterable
        className="-striped -highlight"
        defaultPageSize={30}
        showPageSizeOptions={false}
        showPaginationTop={true}
        showPaginationBottom={false}
        loading={circles.length === "0"}
        columns={columns}
        data={circles}
        defaultFilterMethod={(filter, row, column) => {
          const id = filter.pivotId || filter.id;
          return row[id] !== undefined ? String(row[id]).search(filter.value) !== -1 : false;
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
  onRowClick: PropTypes.func.isRequired,
  onAddFavorite: PropTypes.func.isRequired,
  onRemoveFavorite: PropTypes.func.isRequired,
  showChecklistComponent: PropTypes.bool,
};

export default CircleListPane;