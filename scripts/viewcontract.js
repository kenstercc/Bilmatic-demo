let colDef = [
  {headerName: 'Action',
    field: 'contract_status',
    width: 100,
    cellStyle: params => {
      if (params.oldValue !== params.value) {
          return { color: 'red', fontsize: '12', backgroundColor: 'lightyellow' }; // Change background when updated
      }
      return null;},
    editable: true,
    cellEditor: 'agRichSelectCellEditor',
    cellClass: 'ag-left-aligned-cell',
    singleClickEdit : true,
    cellEditorParams: {
        values: ['Delete', 'Add']}},
  {headerName: "Billing Items", field: "billing_item_description",
     width: 350, 
     editable: true},
  {headerName: "Range Type", field: "contract_range_type", 
     width:150,
     editable: true,
     cellEditor: 'agRichSelectCellEditor',
     cellClass: 'ag-right-aligned-cell',
     singleClickEdit : true,
     cellEditorParams: {
         values: ['item', 'acct value']}},
  {headerName: "Range", field: "contract_to_range",
     editable: true, 
     width:150, 
     cellClass: 'ag-right-aligned-cell',
     valueSetter: myCustomValidator,
     valueFormatter: params => {return params.value.toLocaleString();}},
  {headerName: "Rate Type", field: "contract_rate_type",
    width:150,
    cellEditor: 'agRichSelectCellEditor',
    singleClickEdit : true,
    cellClass: 'ag-right-aligned-cell',
    cellEditorParams: {
        values: ['flat$', 'bps', 'pct']} },
  {headerName: "Rate", field: "contract_rate_amount", 
    width: 100, 
    editable: true, 
    cellClass: 'ag-right-aligned-cell',
    valueSetter: myCustomValidator,},
  {headerName: "(+/-)", field: "contract_billing_operator", 
    width:80,
    cellEditor: 'agRichSelectCellEditor',
    singleClickEdit : true,
    cellClass: 'ag-right-aligned-cell',
    cellEditorParams: {
        values: ['+', '-']}},
  {headerName: "Add On Type", field: "contract_addon_type", 
    width: 150,
    cellEditor: 'agRichSelectCellEditor',
    cellClass: 'ag-right-aligned-cell',
    singleClickEdit : true,
    cellEditorParams: {
        values: ['flat$', 'bps', 'pct']}},     
  {headerName: "Add-On Rate", field: "contract_addon_rate_amount", 
    width: 150, 
    editable: true, 
    cellClass: 'ag-right-aligned-cell',
    valueSetter: myCustomValidator,},
  {headerName: "Min", field: "contract_minimum_fee", 
    width: 100, 
    editable: true, 
    cellClass: 'ag-right-aligned-cell', 
    valueSetter: minCustomValidator, 
    valueFormatter: params => {return params.value.toLocaleString();}},
  {headerName: "Max", field: "contract_maximum_fee", 
    width:100, 
    editable: true, 
    cellClass: 'ag-right-aligned-cell',
    valueSetter: maxCustomValidator,     
    valueFormatter: params => {return params.value.toLocaleString();}},
  {headerName: "Specials", field: "specials", 
    width:200,
    cellEditor: 'agRichSelectCellEditor',
    singleClickEdit : true,
    cellEditorParams: {
        values: ['exception', 'exemption', 'specials', 'n/a']}},
  {field: 'isUpdated',
    headerName: 'Updated',
    hide: "true",
    cellRenderer: (params) => {
    if (params.value) {
        return 'Yes'; // Or a custom icon
        }
        return 'No'; 
        }
       }
   ];

   let gridOptions =
  {     columnDefs: colDef,
        defaultColDef: {
          rowDeselection: true,
          editable: true,
          resizable: true},
        rowHeight: 40,
          rowData: [],
          enableCellChangeFlash: true,
          onCellValueChanged: onCellValueChanged,
          onGridReady: function (params)
          {
         
          gridOptions.api = params.api;
          gridOptions.columnApi = params.columnApi;
          params.api.setRowData(data);
          
          },
      onFirstDataRendered(params)
      {
          params.api.sizeColumnsToFit();
          params.api.setRowData(data);
          params.api.refreshCells({force : true})
      },
                  
   };  
    
       
// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    let gridDiv = document.querySelector('#selectionGrid');
    new agGrid.Grid(gridDiv, gridOptions);

})

//View contract 

window.viewcontract = function() {

  const Entity = document.getElementById("Entity").value;
  const SubEntity = document.getElementById("SubEntity").value;
  const Account = document.getElementById("Account").value;
  
  // Querying the data using fetch and promises
  fetch('http://localhost:3000/viewcontract/'+Entity+'/'+SubEntity+'/'+Account+'') 
  // Deserializing the data we received
  .then(response => response.json())
   // We have our data now, we initialize our table
  .then(data => {
   console.log (data)
    
   gridOptions.api.setRowData(data);
   gridOptions.api.refreshCells({force : true})

  })}


// AG Grid data changes

function onCellValueChanged (event) {
  
  //Highlight updated fields
  if (event.oldValue !== event.newValue) {
      const column = event.column.colDef.field;
      //event.column.colDef.cellStyle = { 'background-color': 'lightyellow' };
      event.column.colDef.cellStyle = { 'color': 'red' };
      event.api.refreshCells({
          force: true,
          columns: [column],
          rowNodes: [event.node]
      });
     }

  //flag row as updated 
  const updatedRow = event.node.data;
  updatedRow.isUpdated = true;

   const schedule = JSON.stringify(event.node.data)
  //console.log(data)
  console.log(`schedule:${JSON.stringify(event.node.data)}`);
  console.log(schedule)

  // get billing_item code for the event
  const Item = event.node.data.contract_billing_item;
   

  //Determine action dropdown that was selected
  const action = event.node.data.contract_status;
  
  //Action Delete
  if (action === 'Delete') { 
    const confirm = window.confirm("Are you sure, you want to delete this row?")
    if (confirm) {
      const Entity = document.getElementById("Entity").value;
      const SubEntity = document.getElementById("SubEntity").value;
      const Account = document.getElementById("Account").value;
      //const Action = data.contract_status;
      const Action = 'd';
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Fetch PUT Request Example' })}
      //Update Status Flag in DB
        fetch('http://localhost:3000/deletecontract/'+Entity+'/'+SubEntity+'/'+Account+'/'+Item+``, requestOptions)
        .then(data => {
          alert("Delete sucessfully processed !!!");
          console.log('Delete successful:', data);
      // refresh after update 
      fetch('http://localhost:3000/viewcontract/'+Entity+'/'+SubEntity+'/'+Account+'') 
          // Deserializing the data we received
          .then(response => response.json())
          // We have our data now, we initialize our table
          .then(data => {
          console.log (data)
            
          gridOptions.api.setRowData(data);
          gridOptions.api.refreshCells({force : true})
          })})
        .catch(error => {
          console.error('Error delete schedule:', error);
        })}}

   // Add function selected     
   if (action === 'Add') {
          alert("Add not implemented")
          } 

   }


//Update Contract function

window.updatecontract = function() { 
  
    console.log('here in update function')

    const Entity = document.getElementById("Entity").value;
    const SubEntity = document.getElementById("SubEntity").value;
    const Account = document.getElementById("Account").value;
    
    console.log (Entity);
    console.log (SubEntity);
    console.log (Account);
     
    //retrieve all rows from ag grid  
    const allRows = gridOptions.api.getRenderedNodes().map(node => node.data);
    console.log('allALLROWS', allRows);

    //Select only updated row based on Isudated flag
    const filteredData = allRows.filter(item => item.isUpdated === true);

    console.log('filteredData', filteredData);

    if (Array.isArray(filteredData) && filteredData.length === 0) 
       {alert("Error - No updates found, please edit schedule !!")
        return}

    const confirm = window.confirm("Are you sure, you want to perform the updates?")
    if (confirm) {
    fetch('http://localhost:3000/updatecontract/'+Entity+'/'+SubEntity+'/'+Account+'',  {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filteredData })
      })
      .then(data => {
          alert('Update successfully!');
        
      // refresh after update 
      console.log('refresh after update?')
      fetch('http://localhost:3000/viewcontract/'+Entity+'/'+SubEntity+'/'+Account+'') 
          // Deserializing the data we received
          .then(response => response.json())
          // We have our data now, we initialize our table
          .then(data => {
           console.log (data)
          
          //reset column defintions 
          gridOptions.api.setColumnDefs([]);
          gridOptions.api.setColumnDefs(colDef);
          gridOptions.api.sizeColumnsToFit();
          
          //refresh data grid
          gridOptions.api.setRowData(data);           
          gridOptions.api.refreshCells({force : true})

          })})

       .catch(error => {
        console.error('Error update schedule:', error);
        })}

      }
  

// Define your custom validation function
function myCustomValidator(params) {
  const newValue = params.newValue;
  const oldvalue = params.oldValue;
  
  console.log('new', newValue)
  console.log('old', oldvalue)
 

  // Perform your validation logic here
  if (newValue < 0) {
    alert("Value cannot be negative!");
    return false; // Prevent the value from being set
  }

  if (newValue === oldvalue) {
    alert("Value entered is the same as old value!");
    return false; // Prevent the value from being set
  }


  if (isNaN(newValue)) {
    alert('Value must be numeric!');
    return false; // Reject the change
  }
 
  // Value is valid, update the data and return true
  params.data[params.colDef.field] = newValue;
  return true; 
}

// Define your minimum fee validation function
function minCustomValidator(params) {
  const newValue = params.newValue;
  const max = params.data.contract_maximum_fee

  console.log(newValue)
  console.log(max)
 

  // Perform your validation logic here
  if (newValue < 0) {
    alert("Value cannot be negative!");
    return false; // Prevent the value from being set
  }

  if (isNaN(newValue)) {
    alert('Value must be numeric!');
    return false; // Reject the change
  }
 
  if (newValue > max) {
    alert("Minimum fee cannot be greater than maximum fee");
    return false; // Prevent the value from being set
  }

  // Value is valid, update the data and return true
  params.data[params.colDef.field] = newValue;
  return true; 
}

 // Define your maxmimum fee validation function
function maxCustomValidator(params) {
  const newValue = params.newValue;
  const min = params.data.contract_minimum_fee

  console.log(newValue)
  console.log(min)
 

  // Perform your validation logic here
  if (newValue < 0) {
    alert("Value cannot be negative!");
    return false; // Prevent the value from being set
  }

  if (isNaN(newValue)) {
    alert('Value must be numeric!');
    return false; // Reject the change
  }
 
  if (newValue < min) {
    alert("Maximum fee cannot be less than minimum fee");
    return false; // Prevent the value from being set
  }

  // Value is valid, update the data and return true
  params.data[params.colDef.field] = newValue;
  return true; 
}  
 
