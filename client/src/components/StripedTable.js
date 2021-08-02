import React from 'react'

const StripedTable = (props) => {
  const columnNames = props.columnNames
  const tableData = props.tableData
  const dataEditable = props.dataEditable

  const formatField = (data, dataType) => {
    let formattedData = data
    if (dataType === 'date') {
      formattedData = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      }).format(new Date(data))
    } else if (dataType === 'capitalizedText') {
      formattedData = data.charAt(0).toUpperCase() + data.slice(1)
    } else if (dataType === 'uppercaseText') {
      formattedData = data.toUpperCase()
    }
    return formattedData
  }

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columnNames.map((columnName) => (
                    <th
                      key={columnName.displayName}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {columnName.displayName}
                    </th>
                  ))}
                  {dataEditable ? (
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, itemIdx) => (
                  <tr
                    key={item.id}
                    className={itemIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item[columnNames[0].field]}
                    </td>
                    {columnNames.slice(1).map((columnName) => (
                      <td
                        key={columnName.field}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {formatField(
                          item[columnName.field],
                          columnName.dataType,
                        )}
                      </td>
                    ))}
                    {dataEditable ? (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a
                          href="/dashboard"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </a>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StripedTable
