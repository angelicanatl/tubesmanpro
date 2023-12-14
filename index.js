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

const upload = multer({ dest: 'uploads/' });


app.use(express.static(staticPath));
app.use('/assets', express.static(assetsPath));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000, 
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
      .pipe(csvParser(";"))
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

//bar chart
app.get('/barChart', async (req, res) => {
    res.render('barChart');
});

//scatter plot
app.get('/scatterPlot', async (req, res) => {
    try {
        const result = await getColumnsName();
        // Check if the result is an object and has the expected structure
        if (result && Array.isArray(result)) {
            const columns = result.map(column => column.Field);
            res.render('scatterPlot', { columns:columns });
        } else {
            throw new Error('Unexpected query result structure');
        }
    } catch (error) {
        console.error('Error fetching column names:', error);
        res.status(500).send('Internal Server Error');
    }
});

const getColumnsName = async () => {
    return new Promise(async (resolve, reject) =>{
        const query = `SHOW COLUMNS FROM marketing_campaign`;
        const conn = await db();
        conn.query(query, (error, results) =>{
            if(error){
                reject(error);
            }else{
                resolve(results);
            }
        })
    })
}

app.get('/scatterData', (req, res) => {
    const { x, y, color } = req.query;

    // Ganti query ini sesuai dengan struktur dan nama tabel di database Anda
    const query = `SELECT ${x} as x, ${y} as y, '${color}' as color FROM marketing_campaign`;
    console.log(x, y, color)
    pool.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching scatter plot data:', error);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(results);
            res.json(results);
        }
    });
});





