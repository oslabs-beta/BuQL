import React from 'react';
import {useTable} from 'react-table';

function QueryTable(props) {
  const {data} = props;

  // defining the table columns
  const columns = React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
      },
      {
        Header: 'Query',
        accessor: 'query',
      },
      {
        Header: 'Response Source',
        accessor: 'source',
      },
      {
        Header: 'Response Time',
        accessor: 'time',
      },
    ],
    []
  );

  // reverse data to populate table backwards
  const reversedData = [...data].reverse();

  // define table instance using useTable hook
  const {getTableProps, rows, prepareRow} = useTable({
    columns,
    data: reversedData,
  });

  // render the table
  return (
    <div id='querytable'>
      <table {...getTableProps()}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.accessor}>{column.Header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell, cellIndex) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      key={`${row.id}-cell-${cellIndex}`}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default QueryTable;
