import React, {useState} from 'react';
import {useTable} from 'react-table';

function QueryTable(props) {
  const {data} = props;

  //data previously:
  /*  const [data, setData] = useState([
    { id: 1, query: 'Select all users', source: 'database', time: 15},
    { id: 2, query: 'Hello World', source: 'database', age: 25 },
    // Initial data for the table
  ]); */

  // Define your table columns
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
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} key={cell.column.accessor}>
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
