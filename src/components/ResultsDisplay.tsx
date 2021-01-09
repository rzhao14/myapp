import React from 'react'
import DataGrid, { Column } from 'devextreme-react/data-grid'

const ResultsDisplay = (resultJson) => {

  return (
    <DataGrid
      id='gridContainer'
      dataSource={resultJson}
      showRowLines={true}
      showBorders={true}
    >
      <Column dataField='buyer_id' width={100} caption='Customer Model' />
      <Column dataField='oem_id' caption='OEM Model' />
      <Column dataField='factory_id' caption='Factory Model' />
      <Column dataField='x' caption='Length' />
      <Column dataField='y' caption='Width' />
      <Column dataField='z' caption='Height' />
      <Column dataField='description' caption='Description' />
      <Column dataField='quantity' caption='Quantity' />
      <Column dataField='priceC' caption='Unit Price CNY' />
      <Column dataField='priceU' caption='unit Price USD' />
      <Column dataField='quantity' caption='Quantity' />

    </DataGrid>
  )
}

export default ResultsDisplay
