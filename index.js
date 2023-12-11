import mysql from 'mysql';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import multer from 'multer';
import fs from 'fs';
import csvParser from 'csv-parser';
import memorystore from 'memorystore'; 


const PORT = 3619;
const app = express();

const pool = mysql.createPool({
    user: 'root',
    password: '',
    database: 'diary',
    host: 'localhost'

});


const staticPath = path.resolve('public');
const assetsPath = path.resolve('assets');
const uploadPath = path.resolve('uploads');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

const upload = multer({ dest: 'uploads/' });// Tambahkan .single('file') di sini


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

const pool = mysql.createPool({
    user: "root",
    password: "",
    database: "manpro",
    host: "localhost",
});

const db = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                reject(err);
            } else {
                resolve(conn);
            }
        });
    });
};

app.listen(PORT, () => {
    console.log(`Server is ready, listening in port ${PORT}`);
});

app.get(['/', '/home'], async (req, res) => {
    res.render('home');
});

app.get('/ringkasan', async (req, res) => {
    res.render('ringkasan');
});

// app.post('/upload', (req, res) => {
//     try {
//         upload(req, res, (err) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send('Error uploading file.');
//             }
//             // Proses upload data di sini
//             res.send('Data berhasil diupload!');
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     }
// });

app.get('/header', async (req, res) => {
    res.render('header');
});

app.get('/uploadData', async (req, res) => {
    res.render('uploadData');
});
  
app.post('/uploadData', upload.single('file_upload'), (req, res) => {
  const csvFile = req.file;
  console.log(csvFile);
  
  pool.getConnection((err, conn) => {
    if (err) {
      console.error('Error connecting to database:', err);
      res.status(500).send('Error connecting to database');
      return;
    }

    fs.createReadStream(csvFile.path)
      .pipe(csvParser())
      .on('data', (row) => {
        const marketing_campaign = {
            ID: row.ID,
            Year_Birth: row.Year_Birth,
            Education: row.Education,
            Marital_Status: row.Marital_Status,
            Income: row.Income,
            Kidhome: row.Kidhome,
            Teenhome: row.Teenhome,
            Dt_Customer: row.Dt_Customer,
            Recency: row.Recency,
            MntWines: row.MntWines,
            MntFruits: row.MntFruits,
            MntMeatProducts: row.MntMeatProducts,
            MntFishProducts: row.MntFishProducts,
            MntSweetProducts: row.MntSweetProducts,
            MntGoldProds: row.MntGoldProds,
            NumDealsPurchases: row.NumDealsPurchases,
            NumWebPurchases: row.NumWebPurchases,
            NumCatalogPurchases: row.NumCatalogPurchases,
            NumStorePurchases: row.NumStorePurchases,
            NumWebVisitsMonth: row.NumWebVisitsMonth,
            AcceptedCmp3: row.AcceptedCmp3,
            AcceptedCmp4: row.AcceptedCmp4,
            AcceptedCmp5: row.AcceptedCmp5,
            AcceptedCmp1: row.AcceptedCmp1,
            AcceptedCmp2: row.AcceptedCmp2,
            Complain: row.Complain,
            Response: row.Response
        };

        const query = 'INSERT INTO `marketing_campaign` SET ?';
        console.log(query);
        conn.query(query, marketing_campaign, (error, results, fields) => {
          if (error) {
            console.error('Error importing data to marketing_campaign table:', error);
          }
        });
      })
      .on('end', () => {
        conn.release(); 
        res.redirect('/home');
      });
  });
});

app.post('/uploadData', upload.single('file_upload'), async (req, res) => {
    try {
        const filePath = path.join(uploadPath, req.file.filename);

        // Read column headers from CSV
        const columnHeaders = await readColumnHeaders(filePath);
        console.log(columnHeaders);
        // Create table in database
        await createTableInDatabase(columnHeaders);

        // Import data from CSV to the database
        await importCsvDataToDatabase(filePath, columnHeaders);

        res.send('File uploaded successfully and table created in the database.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

const readColumnHeaders = async (filePath) => {
    return new Promise((resolve, reject) => {
        const columnHeaders = [];

        fs.createReadStream(filePath)
            .pipe(csv({ separator: ';' }))
            .on('data', (row) => {
                // Assuming the first row of the CSV contains headers
                if (columnHeaders.length === 0) {
                    for (const header of Object.keys(row)) {
                        columnHeaders.push(header.trim());
                    }
                    resolve(columnHeaders);
                }
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};




const createTableInDatabase = async (columnHeaders) => {
    try {
        const conn = await db();

        const createTableQuery = `
    CREATE TABLE IF NOT EXISTS uploaded_data (
        ${columnHeaders.map(header => `${header} VARCHAR(255)`).join(',\n')}
    )
`;


        console.log('Create Table Query:', createTableQuery);

        await conn.query(createTableQuery);

        conn.release();
    } catch (error) {
        console.error('Error creating table:', error.message);
        throw error;
    }
};




const importCsvDataToDatabase = async (filePath, columnHeaders) => {
    try {
        const conn = await db();

        const insertQuery = `
            LOAD DATA LOCAL INFILE ? INTO TABLE uploaded_data
            FIELDS TERMINATED BY ',' 
            ENCLOSED BY '"'
            LINES TERMINATED BY '\\n'
            IGNORE 1 ROWS
            (${columnHeaders.join(', ')})
        `;

        await conn.query(insertQuery, [filePath]);

        conn.release();
    } catch (error) {
        console.error('Error importing data:', error);
        throw error;
    }
};

