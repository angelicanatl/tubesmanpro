document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('bar-chart-form');
    const canvas = document.querySelector('.bar-chart-canvas');
    const ctx = canvas.getContext('2d');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(form);;
        const selectedAxes = {
          x: formData.get('x'),
          y: formData.get('y'),
          operator: formData.get('operator'),
        };
        console.log(selectedAxes);
        const data = await fetchData(selectedAxes);
        console.log(data);
        generateBarChart(data, selectedAxes);

    });
  
async function fetchData(selectedAxes) {
  try {
      const response = await fetch(`/getBarChartData?x=${selectedAxes.x}&y=${selectedAxes.y}&operator=${selectedAxes.operator}`);
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching barchart data:', error);
      throw error;
  }
}

  function generateBarChart(data, selectedAxes) {

    if (data.length === 0) {
        console.error('Data is empty.');
        return;
    }

    // Buat array untuk label dan data
    const labels = data.map(item => item.x);
    const values = data.map(item => item.y);

    console.log(labels);
    console.log(values);

    const chartData = {
      labels: labels, // Assuming x is dynamic
      datasets: [{
          label: `${selectedAxes.operator}(${selectedAxes.y})`,
          data: values, // Assuming operator and y are dynamic
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
      }],
    };

    // Create the bar chart
    new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        legend: {
          display: false,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true          
        }
      }
    });
}

});
