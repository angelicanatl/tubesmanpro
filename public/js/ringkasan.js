const tableRingkasan = document.querySelector("table.tabel-ringkasan");
const groupby = document.querySelectorAll("#group-by input");

let obj; 
const selectedColumns = [];
// Iterate through checkboxes to find selected ones
for (const by in groupby) {
    if (by.checked) {
        selectedColumns.push(checkboxName);
    }
}

let init = {
    method: 'post',
    headers:{
        "Content-Type":"application/json"
    },
    body: JSON.stringify(obj)
};

fetch('/getTabel',init).then(onSuccess).then(showResult);
function onSuccess(response){
    return response.json();
};
function showResult(result){
    console.log(result);
};