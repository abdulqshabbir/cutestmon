import { nanoid } from "nanoid"

interface TableProps<Row, Col extends keyof Row> {
  data: Array<Row>
  columns: Array<Col>
}

export default function Table<Row, Col extends keyof Row>(
  props: TableProps<Row, Col>
) {
  return (
    <table>
      <TableHeader<Row, Col> columns={props.columns} />
      <TableBody<Row, Col>
        data={props.data}
        columns={props.columns}
      />
    </table>
  )
}

interface TableHeaderProps<Row, Col extends keyof Row> {
  columns: Array<Col>
}

function TableHeader<Row, Col extends keyof Row>({
  columns
}: TableHeaderProps<Row, Col>) {
  return (
    <thead>
      <tr>
        {columns.map((col) => (
          <th key={nanoid()}>{col as string}</th>
        ))}
      </tr>
    </thead>
  )
}

interface TableBodyProps<Row, Col extends keyof Row> {
  data: Array<Row>
  columns: Array<Col>
}

function TableBody<Row, Col extends keyof Row>(
  props: TableBodyProps<Row, Col>
) {
  // console.log("data", data)
  return (
    <tbody>
      {props.data.map((row) => (
        <tr key={nanoid()}>
          {props.columns.map((col) => (
            <td key={nanoid()}>{row[col] as React.ReactNode}</td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}
