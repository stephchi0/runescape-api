function clearTable() {
    const oldTable = document.getElementById('tableBody');
    const newTable = document.createElement('tbody');
    newTable.setAttribute('id', "tableBody");
    oldTable.parentNode.replaceChild(newTable, oldTable);
}

function storeRequestData(request) {
    const parsedRequest = JSON.parse(request);

    parsedRequest.forEach(function (item) {
        let dataToBeStored = '';

        for (let attribute in item) {
            if (!['icon_large', 'name', 'description', 'current', 'today']
            .includes(attribute)) continue;//attributes to be excluded from table*/

            if (attribute === 'current' || attribute === 'today')//prices
                dataToBeStored = dataToBeStored.concat(`${item[attribute].price};`);
            else
                dataToBeStored = dataToBeStored.concat(`${item[attribute]};`);
        }

        dataToBeStored = dataToBeStored.concat(new Date().toLocaleString());

        storeItemData(item.id, dataToBeStored)
    });
}

const update = document.getElementById('update');
update.onclick = function() {
    for (let i = 0; i < 26; i++) {
        const chr = String.fromCharCode(97 + i);

        const request = new XMLHttpRequest();
        request.open('GET', `http://localhost:3000/archaeology/api/${chr}`, true);
        request.onload = function () {
            if (this.status === 200) {
                storeRequestData(request.response);
                retrieveItemData();
            }
            else {
                console.log("ERROR");
            }
        }
        request.send();
    }
}

const show = document.getElementById('show');
show.onclick = function() {
    retrieveItemData();
}

function loadImage(cell, src) {
    const icon = document.createElement('img');
    icon.setAttribute('src', src);
    icon.setAttribute('width', '50');
    icon.setAttribute('height', '50');
    cell.appendChild(icon);
}

function storeItemData(itemId, data) {
    localStorage.removeItem(itemId);
    localStorage.setItem(itemId, data);
}

function retrieveItemData() {
    clearTable();

    const table = document.getElementById('tableBody');
    const storedData = Object.values(localStorage);

    storedData.forEach(function(itemData) {
        const row = document.createElement('tr');
        const cellValues = itemData.split(';');
        cellValues.forEach(function(cellValue) {
            const cell = document.createElement('td');
            if (cellValue === cellValues[[2]]) cell.setAttribute('class', 'description');//left align descriptions

            if (cellValue.toLowerCase().includes('gif'))//all images
                loadImage(cell, cellValue);
            else
                cell.innerHTML = cellValue;
            
            row.appendChild(cell);
        })
        table.appendChild(row);
    });
}

retrieveItemData();