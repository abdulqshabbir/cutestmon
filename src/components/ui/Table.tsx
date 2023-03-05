import { nanoid } from "nanoid"
import { type ReactNode } from "react"

// type StringKeys<T> = Extract<T, string>

export interface ColumnType<Row, ColKey extends keyof Row> {
  key: ColKey
  width: string | number
  header: string
}

interface TableProps<Row, ColKey extends keyof Row> {
  data: Array<Row>
  columns: Array<ColumnType<Row, ColKey>>
}

export default function Table<Row, ColKey extends keyof Row>(
  props: TableProps<Row, ColKey>
) {
  return (
    <table>
      <thead className="h-[50px]">
        <tr className=" rounded-t-lg bg-gray-200 text-gray-500">
          {props.columns.map((col) => (
            <td
              key={col.header}
              width={col.width}
              className="border"
            >
              {col.header}
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.data.map((row) => (
          <tr key={nanoid()}>
            {props.columns.map((col) => (
              <td key={col.key.toString()}>{row[col.key] as ReactNode}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
