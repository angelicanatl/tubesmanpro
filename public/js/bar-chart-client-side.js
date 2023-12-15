import Chart from 'chart.js/auto'

let xAxis = document.getElementById('x');
let yAxis = document.getElementById('y');

function updateKecamatan() {	
	
	let xSelected = xAxis.value ;

	fetch(`/barChart?x=${xSelected}`)
	  .then(response => 
	  	response.json())
	  .then(data => {
	    // Process the received data here
	    console.log(data);
	    kecamatanSelect.innerHTML = "";
	    for(let i = 0 ; i < data.length ; i++) {
			let option = document.createElement("option");
			option.text = data[i].nama ;
			option.value = data[i].idKec ;

			kecamatanSelect.appendChild(option) ;
		}
	  })
	  .catch(error => {
	    // Handle any errors that occurred during the request
	    console.error(error);
	  });
}

(async function() {
  const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];

  new Chart(
    document.getElementById('acquisitions'),
    {
      type: 'bar',
      data: {
        labels: data.map(row => row.year),
        datasets: [
          {
            label: 'Acquisitions by year',
            data: data.map(row => row.count)
          }
        ]
      }
    }
  );
})();
