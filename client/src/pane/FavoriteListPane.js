import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from "react-table-6";
import _ from 'lodash';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class FavoriteListPane extends React.Component {
  rowClick(circle) {
    this.props.onRowClick(circle);
  }

  render() {
    const { favorites, spaceSymSorter } = this.props;
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
        Header: "スペース",
        headerStyle: { backgroundColor: "#222", color: "#fff" },
        columns: [
          {
            headerStyle: { backgroundColor: "#ddd" },
            accessor: "space_sym",
            width: 70,
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
            Header: "お品書き",
            Filter: makePlaceholderFilter("(検索)"),
            Cell: row => row.value
                ? <FontAwesomeIcon icon={['far', 'comment-dots']} />
                : '',
          }
        ]
      }
    ];

    return <div>
      <div className="text-muted mt1e">
        <FontAwesomeIcon icon={['fas', 'info-circle']} /> テーブルの行をクリックすると詳細画面が開きます。
      </div>
      <ReactTable
        filterable
        className="-striped -highlight mt1e"
        pageSize={20}
        pageSize={filtered.length}
        showPageSizeOptions={false}
        showPaginationTop={false}
        showPaginationBottom={false}
        loading={circleList.length === "0"}
        columns={columns}
        data={filtered}
        defaultSorted={[ { id: 'space_sym' }, { id: 'space_num' } ]}
        defaultFilterMethod={(filter, row, column) => {
          const id = filter.pivotId || filter.id;
          return row[id] !== undefined ? String(row[id]).indexOf(filter.value) !== -1 : false;
        }}
        getTrProps={(a,b) => {
          return {
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
  spaceSymSorter: PropTypes.func,
};

export default FavoriteListPane;