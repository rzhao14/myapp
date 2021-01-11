import React, { useState, useEffect } from 'react'
import DateTimePicker from 'react-time-picker';
import DateBox from 'devextreme-react/date-box'
import DropDownButton from 'devextreme-react/drop-down-button'
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid'
import 'devextreme/dist/css/dx.common.css'
import 'devextreme/dist/css/dx.light.css'
import ResultsDisplay from './ResultsDisplay'
import {getOrderById, getOrderByName, getRecentOrders, getOrderTotal,getOrderItemByName, generateOrderWithNameAndModels} from '../services/APIServices'
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

    const [orderId, setOrderId] = useState<string>('')
    const [orderName, setOrderName] = useState<string>('')
    const [proposedOrderName, setProposedOrderName] = useState<string>('')
    const [modelList, setModelList] = useState<string>('')
    const [selectedOrder, setSelectedOrder] = useState<string>('')
    const [resultJson, setResultJson] = useState<any[]>([])
    const [recentOrders, setRecentOrders] = useState<any[]>([])
  useEffect(() => {
    getRecentOrders().then(data => setRecentOrders(data))
    getOrderTotal().then(data => {
    setProposedOrderName('O'+(data['COUNT(*)']+1))})
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
    function getPriceC(rowData){
        if(rowData.priceC){
            return rowData.priceC
        }if(rowData.priceCI){
            return rowData.priceCI
        }
        return ''
    }
    function getPriceU(rowData){
        if(rowData.priceU){
            return rowData.priceU
        }if(rowData.priceUI){
            return rowData.priceUI
        }
        return ''
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
                       >
                       <Editing mode="row" allowUpdating={true} />
                         <Column allowSorting={true} dataField='buyer_id' width={100} caption='Customer Model' />
                         <Column allowSorting={true} dataField='oem_id' caption='OEM Model' />
                         <Column allowSorting={true} dataField='factory_id' caption='Factory Model' />
                         <Column allowSorting={true} dataField='x' caption='Length' />
                         <Column allowSorting={true} dataField='y' caption='Width' />
                         <Column allowSorting={true} dataField='z' caption='Height' />
                         <Column allowSorting={true} dataField='description' caption='Description' />
                         <Column allowSorting={true} dataField='quantity' caption='Quantity' />
                         <Column allowSorting={true} calculateCellValue={getPriceC} caption='Unit Price CNY' />
                         <Column allowSorting={true} calculateCellValue={getPriceU} caption='unit Price USD' />
                         <Column allowSorting={true} dataField='quantity' caption='Quantity' />

                       </DataGrid>
                 )}
               </div>
             </div>
           </div>
         </>
  );
}

export default App;
