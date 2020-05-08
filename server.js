const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}!`));

let data = [];
for (let i = 0; i < 26; i++) {
    const chr = String.fromCharCode(97 + i);
    app.get(`/archaeology/api/${chr}`, (req, res) => {
        data = [];
        fetchInfo(41, chr, req, res);
    });
}

function fetchInfo(cat, chr, req, res) {
    fetch(`http://services.runescape.com/m=itemdb_rs/api/catalogue/items.json?category=${cat}&alpha=${chr}`)
        .then(response => response.json())
        .then(json => {
            data = data.concat(json.items);
            res.json(data);
        })
        .catch(error => {
            assert.isNotOk(error,'Promise error');
            done();
        });
}

//error handling
function notFound(req, res, next) {
    const error = new Error('Not Found');
    res.status(404);
    next(error);
}
function errorHandler(error, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message: error.message
    });
}
app.use(notFound);
app.use(errorHandler);