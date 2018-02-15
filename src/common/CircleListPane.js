import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from "react-table";
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
      }
    ];

    if (showChecklistComponent) {
      columns.unshift({
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
          },
        ],
      });

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
    }

    return <ReactTable
      className="-striped -highlight"
      defaultPageSize={20}
      showPagination={true}
      columns={columns}
      data={circles}
      getTrProps={(a,b) => {
        return {
          style: { color: b && b.original && b.original.favorite ? "red" : "" },
          onClick: () => { this.rowClick(b.original) }
        };
      }}/>
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