function app() {
  gridOptions.api.destroy();
  console.log('destroyed grid');
  newGrid();

  var isInitialData = true;
  
  console.log('rebuilding grid');
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
  gridOptions.api.setRowData(data);
  isInitialData = !isInitialData;
 

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    newGrid();
});

}

