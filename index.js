import mysql from 'mysql';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import session from 'express-session';
import multer from 'multer';
import fs from 'fs';

const PORT = 8050;
const app = express();

const staticPath = path.resolve('public');
const assetsPath = path.resolve('assets');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({ storage: storage }).single('file'); // Tambahkan .single('file') di sini

app.use(express.static(staticPath));
app.use('/assets', express.static(assetsPath));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.listen(PORT, () => {
    console.log(`Server is ready, listening in port ${PORT}`);
});

app.get(['/', '/home'], async (req, res) => {
    res.render('home');
});

//ringkasan
app.get('/ringkasan', async (req, res) => {
    res.render('ringkasan');
});

const per_kat = (conn, group) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * GROUP BY ?', group, (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}


app.post('/showTabel', (req, res) => {
    let by = req.body.by;
    console.log(by);
    // if(by=="tanggal-transaksi"){
    //     res.json(tabelTanggal);
    // }else if(by=="jenjang-pendidikan"){
    //     res.json(tabelJenjang);
    // }else if(by=="status"){
    //     res.json(tabelStatus);
    // }else{
    //     res.status(400).send('Input tidak dikenal');
    //     return;
    // }
})

app.get('/uploadData', async (req, res) => {
    res.render('uploadData');
});

app.post('/upload', (req, res) => {
    try {
        upload(req, res, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error uploading file.');
            }
            // Proses upload data di sini
            res.send('Data berhasil diupload!');
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/header', async (req, res) => {
    res.render('header');
});