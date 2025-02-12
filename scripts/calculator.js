//what if calculation 

window.calculator = function() {

  const Entity = document.getElementById("Entity").value;
  const SubEntity = document.getElementById("SubEntity").value;
  const Account = document.getElementById("Account").value;
  const item = document.getElementById("Item").value;
  const qty = document.getElementById("Qty").value;
  const value = document.getElementById("Acctval").value;
  

  if (Entity === "company01") {
  fetch('/data/company01.json')
      .then(response => response.json())
     // We have our data now, we initialize our table
    .then(data => {

     
    const filteredData = data.filter(row => row.billing_item_description === item);
    

      const variable = {
       "qty": qty,
       "value": value
      }
   
    
    const scheduleData = filteredData[0];
     
  
    let object = qty;
    let rate = scheduleData.contract_rate_amount;
    let addon = scheduleData.contract_addon_rate_amount

    console.log ('qty', object)
    console.log ('rate', rate)
    console.log ('addon', addon)
    console.log ('rate type', scheduleData.contract_rate_type)
    console.log ('schedule detail', scheduleData)

    const calcuResponse = {
      "schedule": " ",
      "finalresult": 0,
      "legend": " ",
     };
   
    calcuResponse.schedule = scheduleData 

    console.log ('schedule data', scheduleData)
     
    let result = 0;
        
    if (scheduleData.contract_rate_type === 'flat$') {
        result = (object * rate)
        console.log ('preliminary result 1', result)
        } 
     else 
    if (scheduleData.contract_rate_type === 'bps') {
        let denom = 100;
        result =(object * (rate / denom)) 
        console.log ('preliminary result 2', result)
        }
       else
       {
        // Handle invalid formula or any error in evaluation
      console.error(err);
      res.status(500).json({ error: "undefined contract rate type" });
       }
   
       console.log ('preliminary result', result)
  
    //factor in add-on rate
    if (scheduleData.contract_billing_operator === '+') {
      result = result + addon
    }
      else
      if (scheduleData.contract_billing_operator === '-') {
        result = result - addon
      }
     
    //apply min/max
    if (result < scheduleData.contract_minimum_fee) {
      result = scheduleData.contract_minimum_fee;
      calcuResponse.legend = "Minimum fee applied"
    }
     else
    if  (result > scheduleData.contract_maximum_fee) {
       result = scheduleData.contract_maximum_fee;
       calcuResponse.legend = "Maximum fee applied"
    }

    calcuResponse.finalresult = result

    console.log ('final results', calcuResponse.finalresult)

    //loasd the results

    const formattedNumber = calcuResponse.finalresult.toLocaleString();
    document.getElementById('cal-fee').textContent = formattedNumber ;
    document.getElementById('legend-value').textContent = calcuResponse.legend;
    
    document.getElementById('range-type-value').textContent = calcuResponse.schedule.contract_range_type;
   
    const rangeNumber = calcuResponse.schedule.contract_to_range.toLocaleString();
    document.getElementById('To-range-value').textContent = rangeNumber;

    document.getElementById('Rate-type-value').textContent = calcuResponse.schedule.contract_rate_type;
    document.getElementById('Rate-value').textContent = calcuResponse.schedule.contract_rate_amount;
    document.getElementById('Operator-value').textContent = calcuResponse.schedule.contract_billing_operator;
    document.getElementById('Addon-Type-value').textContent = calcuResponse.schedule.contract_addon_type;
    document.getElementById('Addon-rate-value').textContent = calcuResponse.schedule.contract_addon_rate_amount;

    const minfee = calcuResponse.schedule.contract_minimum_fee.toLocaleString();
    document.getElementById('Min-fee-value').textContent = minfee;

    const maxfee = calcuResponse.schedule.contract_maximum_fee.toLocaleString();
    document.getElementById('Max-fee-value').textContent = maxfee
  })
    }


  }
  
