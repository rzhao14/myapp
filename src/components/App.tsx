import React, { useState, useEffect } from 'react'
import DateTimePicker from 'react-time-picker';
import DateBox from 'devextreme-react/date-box'
import DropDownButton from 'devextreme-react/drop-down-button'
import DataGrid, { Column } from 'devextreme-react/data-grid'
import 'devextreme/dist/css/dx.common.css'
import 'devextreme/dist/css/dx.light.css'
import ResultsDisplay from './ResultsDisplay'
import {getOrderById, getOrderByName, getRecentOrders} from '../services/APIServices'
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

    const [orderId, setOrderId] = useState<string>('')
    const [orderName, setOrderName] = useState<string>('')
    const [resultJson, setResultJson] = useState<any[]>([])
    const [recentOrders, setRecentOrders] = useState<any[]>([])
  useEffect(() => {
    getRecentOrders().then(data => setRecentOrders(data))
  }, [])


    function handleSubmit(){
        if(orderId!==''){
            getOrderById(orderId).then(data => setResultJson(data))
        }
        else if(orderName!==''){
            getOrderByName(orderName).then(data => setResultJson(data))
        }
    }
    function handleSelect(value){
      if(value!==''){
        let orderInfo = value.split(':');
        if(orderInfo[0]!=='null'){
            getOrderById(orderInfo[0]).then(data => setResultJson(data))
        }else{
            getOrderByName(orderInfo[1]).then(data => setResultJson(data))
        }
      }
    }


  return (
      <>
           <div className='container-fluid' id='content'>
             <div className='row'>
               <div className='col-lg-12'>
                 <div className='panel panel-primary'>
                   <div className='panel-heading'>Search</div>
                   <div className='panel-body'>
                     <div className='col-md-2'>
                       <label>Order Number</label>
                        <input type='text'
                            onChange={e => setOrderId(e.target.value)}
                        />
                     </div>
                     <div className='col-md-2'>
                        <label>Order Name</label>
                        <input type='text'
                            onChange={e => setOrderName(e.target.value)}
                        />
                     </div>

                   <>
                     <h4>Recent Orders</h4>
                     <input
                       list='orders'
                       className='collections'
                       onChange={e => handleSelect(e.target.value)}
                     />
                     <datalist id='orders'>
                       {recentOrders.map((order) => (
                         <option key={order.order_id}>{order.order_id +':'+ order.order_name  }</option>
                       ))}
                     </datalist>
                   </>

                     <div className='col-md-4'>
                       <label>Data Range</label>
                       <DateBox
                         placeholder='Start Date'
                         type='datetime'
                         showClearButton={true}
                         displayFormat='yyyy/MM/dd HH:mm:ss'
                       />
                       <DateBox
                         placeholder='End Date'
                         type='datetime'
                         showClearButton={true}
                         displayFormat='yyyy/MM/dd HH:mm:ss'
                       />
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
                 )}
               </div>
             </div>
           </div>
         </>
  );
}

export default App;
