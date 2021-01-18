import React, { useState, useEffect } from 'react'
import DateTimePicker from 'react-time-picker';
import DateBox from 'devextreme-react/date-box'
import DropDownButton from 'devextreme-react/drop-down-button'
import DataGrid, { Column,Export, Editing } from 'devextreme-react/data-grid'
import 'devextreme/dist/css/dx.common.css'
import 'devextreme/dist/css/dx.light.css'
import ExcelJS from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import FileSaver from 'file-saver';

import ResultsDisplay from './ResultsDisplay'
import {getOrderById, getOrderByName, getRecentOrders,
 getOrderTotal,getOrderItemByName,
 updateData,
 generateOrderWithNameAndModels} from '../services/APIServices'
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

    const [orderId, setOrderId] = useState<string>('')
    const [orderName, setOrderName] = useState<string>('')
    const [totalOrderCount, setTotalOrderCount] = useState<number>(0)
    const [proposedOrderName, setProposedOrderName] = useState<string>('')
    const [modelList, setModelList] = useState<string>('')
    const [selectedOrder, setSelectedOrder] = useState<string>('')
    const [resultJson, setResultJson] = useState<any[]>([])
    const [recentOrders, setRecentOrders] = useState<any[]>([])
  useEffect(() => {
    getRecentOrders().then(data => setRecentOrders(data))
    getOrderTotal().then(data => {
        setTotalOrderCount(data['COUNT(*)']+1)
        setProposedOrderName('O'+(data['COUNT(*)']+1))
    })
  }, [])


    function handleSubmit(){
        if(orderId!==''){
            getOrderById(orderId).then(data => setResultJson(data))
        }
        else if(orderName!==''){
            getOrderItemByName(orderName).then(data => setResultJson(data))
        }
    }
    function handleGenerate(){
        getOrderByName(proposedOrderName).then(data => {
            if(data.length!==0){
                window.alert(proposedOrderName + ' already taken. Please give a different name')
            }else{
                let list = modelList.trim().split(/[ \(,\)\n]+/)
                let r = window.confirm('creating order with the following items:\n' + list.toString());
                if(r){
                    generateOrderWithNameAndModels({list:list, name:proposedOrderName}).then(data => {
                        getOrderItemByName(proposedOrderName).then(data => setResultJson(data))
                        setTotalOrderCount(totalOrderCount+1)
                        setProposedOrderName('O'+(totalOrderCount+1))
                    })
                }
            }

        })

    }
    function handleSelect(value){
      setSelectedOrder(value)
      if(value!==''){
        let orderInfo = value.split(':');
        if(orderInfo[0]!=='null'){
            getOrderById(orderInfo[0]).then(data => setResultJson(data))
        }else{
            getOrderItemByName(orderInfo[1]).then(data => setResultJson(data))
        }
      }
    }
    function handleUpdate(data){

             console.log(data)
        updateData(data).then(e=>{
             console.log(e)
        })
    }

    function onExporting(e) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Main sheet');

        exportDataGrid({
          component: e.component,
          worksheet: worksheet,
          autoFilterEnabled: true
        }).then(() => {
          workbook.xlsx.writeBuffer().then((buffer) => {
            FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
          });
        });
        e.cancel = true;
      }


    function updateDataEntry(rowData){
        return <button onClick={e=>handleUpdate(rowData.data)}>save</button>;
    }

  return (
      <>
           <div className='container-fluid' id='content'>
             <div className='row'>
               <div className='col-lg-12'>
                 <div className='panel panel-primary'>
                   <div className='panel-heading'>Search</div>
                   <div className='panel-body'>
                     <div className='col-md-2 column'>
                       <label>Order Number</label>
                        <br/>
                        <input type='text'
                            onChange={e => setOrderId(e.target.value)}
                        />
                     </div>
                     <div className='col-md-2 column'>
                        <label>Order Name</label>
                         <br/>
                        <input type='text'
                            onChange={e => setOrderName(e.target.value)}
                        />
                     </div>

                     <div className='col-md-2 column'>
                        <label>Recent Orders</label>
                        <br/>
                         <input
                           list='orders'
                           className='collections'
                           value={selectedOrder}
                           onChange={e => handleSelect(e.target.value)}
                         />
                         <datalist id='orders'>
                           {recentOrders.map((order) => (
                             <option key={order.order_id}>{order.order_id +':'+ order.order_name  }</option>
                           ))}
                         </datalist>
                         <button
                        id='searchButton'
                        className='btn btn-success'
                        type='submit'
                        onClick={e=>setSelectedOrder('')}
                      >
                        <span className='glyphicons glyphicons-clear'></span>
                        Clear
                      </button>
                     </div>

                     <div className='col-md-3'>
                         <label>Models</label>
                        <textarea
                             className='model-input'
                            onChange={e => setModelList(e.target.value)}
                        />
                         <button
                            id='searchButton'
                            className='btn btn-success'
                            type='submit'
                            onClick={handleGenerate}
                            disabled={modelList===''}
                          >
                            <span className='glyphicons glyphicons-clear'></span>
                            Generate Order
                          </button>
                          <input type='text' value={proposedOrderName} onChange={e => setProposedOrderName(e.target.value)}/>
                      </div>



                   </div>
                   <div className='panel-footer'>
                     <div className='btn-bar'>
                       <span className='rightNav'>

                         <button
                           id='searchButton'
                           className='btn btn-success'
                           type='submit'
                           onClick={handleSubmit}
                         >
                           <span className='glyphicons glyphicons-search'></span>
                           Search
                         </button>

                         <button
                            id='searchButton'
                            className='btn btn-success'
                            type='submit'
                            onClick={handleSubmit}
                          >
                            <span className='glyphicons glyphicons-search'></span>
                            Update Order Number
                          </button>
                       </span>
                     </div>
                   </div>
                 </div>
                 {resultJson.length===0 ? (
                   <div className='alert alert-info'>
                     <div>No results found.</div>
                   </div>
                 ) : (
                   <DataGrid
                         id='gridContainer'
                         showBorders={true}
                         dataSource={resultJson}
                         allowColumnResizing={true}
                         rowAlternationEnabled={true}
                         columnAutoWidth={true}
                         onExporting={onExporting}
                       >
                       <Editing mode="cell" allowUpdating={true} />
                         <Column allowSorting={true} dataField='order_id' caption='Order Id' />
                         <Column allowSorting={true} dataField='buyer_id'  width={80} caption='Buyer Model' />
                         <Column allowSorting={true} dataField='oem_id' width={150} caption='OEM Model' />
                         <Column allowSorting={true} dataField='factory_id' caption='F Model' />
                         <Column allowSorting={true} dataField='x' width={50} caption='Length' />
                         <Column allowSorting={true} dataField='y' width={50} caption='Width' />
                         <Column allowSorting={true} dataField='z' width={50} caption='Height' />
                         <Column allowSorting={true} dataField='unit' width={50} caption='Unit' />
                         <Column allowSorting={true} dataField='description' width={300} caption='Description' />
                         <Column allowSorting={true} dataField='price'  width={80} caption='O Price USD' />
                         <Column allowSorting={true} dataField='quantity' caption='Quantity' />
                         <Column allowSorting={true} dataField='priceCI'  width={80} caption='Price CNY' />
                         <Column allowSorting={true} dataField='priceUI'  width={80} caption='Price USD' />
                         <Column allowSorting={true} dataField='box_brand' caption='Box' />
                         <Column allowSorting={true} dataField='hs' caption='HS code' />
                         <Column allowSorting={true} dataField='vunit' caption='V unit' />
                         <Column allowSorting={true} dataField='comment' caption='Comment for Order' />
                         <Column allowSorting={true} dataField='comment1' caption='Comment for item' />
                         <Column allowSorting={true} cellRender={updateDataEntry} caption='Save' />
                         <Export enabled={true} allowExportSelectedData={true} />

                       </DataGrid>
                 )}
               </div>
             </div>
           </div>
         </>
  );
}

export default App;
