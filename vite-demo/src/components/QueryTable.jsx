import React, { useState } from 'react';
import { useTable } from 'react-table';

function QueryTable(props) {
  const { data } = props;


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

  // Step 2: Define table instance using useTable hook
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  // Step 3: Render the table
  return (
    <div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

export default QueryTable;
