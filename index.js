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
const MemoryStore = memorystore(session);


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
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: false,
    secret: 'keyboard cat',
}));

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

        const query = 'INSERT INTO marketing_campaign SET ?';
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

// app.post('/uploadData', upload.single('file_upload'), async (req, res) => {
//     try {
//         const filePath = path.join(uploadPath, req.file.filename);

//         // Read column headers from CSV
//         const columnHeaders = await readColumnHeaders(filePath);
//         console.log(columnHeaders);
//         // Create table in database
//         await createTableInDatabase(columnHeaders);

//         // Import data from CSV to the database
//         await importCsvDataToDatabase(filePath, columnHeaders);

//         res.send('File uploaded successfully and table created in the database.');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// const readColumnHeaders = async (filePath) => {
//     return new Promise((resolve, reject) => {
//         const columnHeaders = [];

//         fs.createReadStream(filePath)
//             .pipe(csv({ separator: ';' }))
//             .on('data', (row) => {
//                 // Assuming the first row of the CSV contains headers
//                 if (columnHeaders.length === 0) {
//                     for (const header of Object.keys(row)) {
//                         columnHeaders.push(header.trim());
//                     }
//                     resolve(columnHeaders);
//                 }
//             })
//             .on('error', (error) => {
//                 reject(error);
//             });
//     });
// };




// const createTableInDatabase = async (columnHeaders) => {
//     try {
//         const conn = await db();

//         const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS uploaded_data (
//         ${columnHeaders.map(header => `${header} VARCHAR(255)`).join(',\n')}
//     )
// `;


//         console.log('Create Table Query:', createTableQuery);

//         await conn.query(createTableQuery);

//         conn.release();
//     } catch (error) {
//         console.error('Error creating table:', error.message);
//         throw error;
//     }
// };




// const importCsvDataToDatabase = async (filePath, columnHeaders) => {
//     try {
//         const conn = await db();

//         const insertQuery = `
//             LOAD DATA LOCAL INFILE ? INTO TABLE uploaded_data
//             FIELDS TERMINATED BY ',' 
//             ENCLOSED BY '"'
//             LINES TERMINATED BY '\\n'
//             IGNORE 1 ROWS
//             (${columnHeaders.join(', ')})
//         `;

//         await conn.query(insertQuery, [filePath]);

//         conn.release();
//     } catch (error) {
//         console.error('Error importing data:', error);
//         throw error;
//     }
// };


//bar chart
app.get('/barChart', async (req, res) => {

    res.render('barChart');
});

app.get('/getKecamatan', async (req, res) => {
    const xAxis = req.query.x;
    console.log(xAxis) ;
    const xColumn = await getXAxis(xAxis) ;
  
    res.send(xColumn) ;
  
  });

const conn = db ;

const getXAxis = (column) => {

    const query = `select ${x} from (select ${x}, ${y} from Marketing_Campaign group by ${y})` ;
    
    return new Promise((resolve, reject) => {
        conn.query(query, (err, result) => {
            if(err) {
                reject(err) ;
            }else{
                const data = JSON.parse(JSON.stringify(result));
                resolve(data);
                console.log('X-Axis:', data);
            }
        }) ;
    });

}
const getYAxis = (column) => {

    const query = `select count(${x}) from (select ${x}, ${y} from Marketing_Campaign group by ${y})` ;
    
    return new Promise((resolve, reject) => {
        conn.query(query, (err, result) => {
            if(err) {
                reject(err) ;
            }else{
                const data = JSON.parse(JSON.stringify(result));
                resolve(data);
                console.log('Y-Axis:', data);
            }
        }) ;
    });

}

// const joinXandY = (xColumn, yColumn) => {

//     const x = getXAxis(xColumn) ;
//     const y = getYAxis(yColumn) ;

//     const query = `select ${x} from (select ${x}, ${y} from Marketing_Campaign group by ${y})` ;

//     return new Promise((resolve, reject) => {
//         conn.query(query, (err, result) => {
//             if(err) {
//                 reject(err) ;
//             }else{
//                 const data = JSON.parse(JSON.stringify(result));
//                 resolve(data);
//                 console.log('Y-Axis:', data);
//             }
//         }) ;
//     });

// }

//scatter plot
app.get('/scatterPlot', async (req, res) => {
    res.render('scatterPlot');
});