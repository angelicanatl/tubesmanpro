$(document).ready(function () {
    function generateTableHeaders() {
        const selectedGroup = $('.groupCol:checked').map(function() {
            return $(this).data('column');
        }).get();

        const selectedOther = $('.otherCol:checked').map(function() {
            return $(this).data('column');
        }).get();

        const headers = [...selectedGroup, ...selectedOther];

        // Modify the table headers dynamically
        const headerRow = $('.tableHeader');
        headerRow.empty();

        for (const header of headers) {
            headerRow.append(`<th>${header}</th>`);
        }
    }

    function updateTableBody(data) {
        const tableBody = $('.tabel-ringkasan tbody');
        tableBody.empty();

        for (const row of data) {
            const tableRow = $('<tr class="tableFill"></tr>');

            for (const key in row) {
                if (row.hasOwnProperty(key)) {
                    tableRow.append(`<td>${row[key]}</td>`);
                }
            }

            tableBody.append(tableRow);
        }
    }

    $('.tampilkan-tabel').on('click', function () {
        const selectedGroup = $('.groupCol:checked').map(function() {
            return $(this).data('column');
        }).get();

        if (selectedGroup.length === 0) {
            alert('Please select at least one attribute in group by.');
            return;
        }

        const selectedOther = $('.otherCol:checked').map(function() {
            return $(this).data('column');
        }).get();

        if (selectedOther.length === 0) {
            alert('Please select at least one attribute in one of each category.');
            return;
        }

        const query = `SELECT ${selectedGroup.join(', ')},${selectedOther.map(column => (column === 'Income' ? `AVG(${column}) AS AvgIncome` : column)).join(', ')} FROM marketing_campaign GROUP BY ${selectedGroup.join(', ')}`;

        $.ajax({
            url: '/ringkasan',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ query }),
            success: function(response) {
                console.log('Server response:', response);
                generateTableHeaders();
                updateTableBody(response.data);
            },
            error: function(error) {
                console.error('Error:', error);
                alert('Error fetching data from the server.');
            }
        });
    });
});
