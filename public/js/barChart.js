
let xAxis = document.getElementById('x');
let yAxis = document.getElementById('y');

let xAxisData ;
let yAxisData ;

let xSelected = xAxis.value ;
let ySelected = yAxis.value ;

const submit = document.getElementById('viewBarChart') ;

document.addEventListener('DOMContentLoaded', function() {
  const barForm = document.getElementById('bar-chart-form');

  barForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(barForm);
    const selectedAxes = {
        x: formData.get('x'),
        y: formData.get('y'),
        operator: formData.get('operator')
    };

    console.log("x : " + selectedAxes.x) ;

    // Fetch data from server
    const data = await fetchData(selectedAxes);

    // build bar chart
    buildBarChart(data, selectedAxes);
  });
 
});
  
async function fetchData(selectedAxes) {

  try {
      const response = await fetch(`/getBarChartData?x=${selectedAxes.x}&y=${selectedAxes.y}&operator=${selectedAxes.operator}`);
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching bar-chart data:', error);
      throw error;
  }

}  

function buildBarChart(data, selectedAxes) {

  //cek apakah data kosong / tidak
  if (data.length === 0) {
    console.error('Data is empty.');
    return ;
  }

  // Get the canvas element
  var ctx = document.getElementById('myBarChart').getContext('2d');
  
  // Buat array untuk label dan data
  const labels = data.map(entry => entry[selectedAxes.x]);
  const values = data.map(entry => entry[selectedAxes.y]);
  
  // Buat objek dataset untuk Chart.js
  const dataset = {
      labels: labels,
      datasets: [{
          label: selectedAxes.y,
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1
      }],
  };

}


