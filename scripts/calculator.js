//what if calculation 

window.calculator = function() {

  const Entity = document.getElementById("Entity").value;
  const SubEntity = document.getElementById("SubEntity").value;
  const Account = document.getElementById("Account").value;
  const item = document.getElementById("Item").value;
  const qty = document.getElementById("Qty").value;
  const value = document.getElementById("Acctval").value;

    // Querying the data using fetch and promises
  fetch('http://localhost:3000/viewcontract/'+Entity+'/'+SubEntity+'/'+Account+``) 
  // Deserializing the data we received
  .then(response => response.json())
   // We have our data now, we initialize our table
  .then(data => {
       
   const filteredData = data.filter(row => row.contract_billing_item === item); 
   
   const variable = {
    "qty": qty,
    "value": value
   }

   
   //call cdynamic calculator with schedule and necessary item data

   fetch('http://localhost:3000/calculate',  {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
       body: JSON.stringify({ filteredData, variable  })
      })
    .then(response => response.json())
    .then(data => {
        const formattedNumber = data.calcuResponse.finalresult.toLocaleString();
        document.getElementById('cal-fee').textContent = formattedNumber ;
        document.getElementById('legend-value').textContent = data.calcuResponse.legend;
        
        document.getElementById('range-type-value').textContent = data.calcuResponse.schedule.contract_range_type;
       
        const rangeNumber = data.calcuResponse.schedule.contract_to_range.toLocaleString();
        document.getElementById('To-range-value').textContent = rangeNumber;

        document.getElementById('Rate-type-value').textContent = data.calcuResponse.schedule.contract_rate_type;
        document.getElementById('Rate-value').textContent = data.calcuResponse.schedule.contract_rate_amount;
        document.getElementById('Operator-value').textContent = data.calcuResponse.schedule.contract_billing_operator;
        document.getElementById('Addon-Type-value').textContent = data.calcuResponse.schedule.contract_addon_type;
        document.getElementById('Addon-rate-value').textContent = data.calcuResponse.schedule.contract_addon_rate_amount;

        const minfee = data.calcuResponse.schedule.contract_minimum_fee.toLocaleString();
        document.getElementById('Min-fee-value').textContent = minfee;

        const maxfee = data.calcuResponse.schedule.contract_maximum_fee.toLocaleString();
        document.getElementById('Max-fee-value').textContent = maxfee
      })
        })

     .catch(error => {
      console.error('Error with calculator!!', error);
      })
  }


