import mysql from 'mysql';

const pool = mysql.createPool({
  user: "root",
  password: "",
  database: "manpro",
  host: "localhost",
});

const dbConnect = () => {
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

export { dbConnect as db };