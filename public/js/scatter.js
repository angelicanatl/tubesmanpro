document.addEventListener('DOMContentLoaded', () => {
    const scatterForm = document.getElementById('scatter-form');

    scatterForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(scatterForm);
        const selectedAxes = {
            x: formData.get('x'),
            y: formData.get('y'),
            color: formData.get('color'),
        };
        console.log(selectedAxes)
        // Fetch data from server
        const data = await fetchData(selectedAxes);

        // Generate scatter plot
        generateScatterPlot(data, selectedAxes);
    });

    async function fetchData(selectedAxes) {
        try {
            const response = await fetch(`/scatterData?x=${selectedAxes.x}&y=${selectedAxes.y}&color=${selectedAxes.color}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching scatter plot data:', error);
            throw error;
        }
    }

    function generateScatterPlot(data, selectedAxes) {
        // Pastikan data tidak kosong
        if (data.length === 0) {
            console.error('Data is empty.');
            return;
        }
    
        // Ambil referensi ke elemen plot
        const plotDiv = document.getElementById('plot');
    
        // Buat array untuk label dan data
        const labels = data.map(entry => entry[selectedAxes.x]);
        const values = data.map(entry => entry[selectedAxes.y]);
    
        // Buat objek dataset untuk Chart.js
        const dataset = {
            labels: labels,
            datasets: [{
                label: selectedAxes.y,
                data: values,
                backgroundColor: selectedAxes.color,
            }],
        };
    
        // Hapus konten yang ada di dalam elemen plot sebelum membuat scatter plot baru
        plotDiv.innerHTML = '';
    
        // Buat elemen canvas untuk scatter plot
        const canvas = document.createElement('canvas');
        canvas.width = 400; // Sesuaikan dengan ukuran yang diinginkan
        canvas.height = 400; // Sesuaikan dengan ukuran yang diinginkan
        plotDiv.appendChild(canvas);
    
        // Mulai menggambar scatter plot menggunakan Chart.js
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'scatter',
            data: dataset,
        });
    }
     
});
