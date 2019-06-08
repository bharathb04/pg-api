let express = require('express');
let pg = require('pg');
let cors = require('cors');
let dbconfig = require('./dbconfig');

const PORT = 3000;



let pool = new pg.Pool({
    
    user: dbconfig.db['user'],
    password: dbconfig.db['password'],
    database: dbconfig.db['database'],
    host: dbconfig.db['host'],
    port: dbconfig.db['port'],
    max: 10,
    idleTimeoutMillis: 30000
});



let app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extend:true }));

app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(PORT, () => console.log('Listening on port ' + PORT));

app.post('/api/new-cust', function(request,response){
    var cust_id = request.body.cust_id;
    var cust_name = request.body.cust_name
    var occupation = request.body.occupation;
    let values = [cust_id, cust_name, occupation];

    pool.connect((err, db, done) => {
        if (err) {
            return response.status(400).send(err);
            }
        else 
            {
            console.log(values);
            db.query('INSERT INTO MYAPP_CUST (CUST_ID, CUST_NAME, OCCUPATION) VALUES($1, $2, $3)',[...values], (err, table) => {
                done();                   
                if (err) {
                    return response.status(400).send(err);
                    }  
                else {
                    console.log('DATA INSERTED!');
                    return response.status(201).send(table.rows);
                }
            });
        }
    });
   
});

app.get('/api/sel-cust', function(request,response){
    
    pool.connect((err, db, done) => {
        if (err) {
            console.log(pool.user);
            console.log('Err2');
            return response.status(400).send(err);
            }
        else 
            {
            db.query('SELECT * FROM MYAPP_CUST', (err, table) => {
                done();                   
                if (err) {
                    console.log(table);
                    console.log('Err1');
                    return response.status(400).send(err);
                    }  
                else {
                    console.log('DATA SELECTED!');       
                    return response.status(201).send(table.rows);
                   
                }
            });
        }
    });
   
});

app.delete('/api/del-cust/:cust_id', function(request,response){
    var cust_id = request.params.cust_id;
    console.log(cust_id);
    pool.connect((err, db, done) => {
        if (err) {
            return response.status(400).send(err);
            }
        else 
            {
            db.query('DELETE FROM MYAPP_CUST WHERE CUST_ID = $1',[cust_id], (err, table) => {
                done();                   
                if (err) {
                    return response.status(400).send(err);
                    }  
                else {
                    console.log('DATA DELETED!');
                    return response.status(201).send(table.rows);
                }
            });
        }
    });
   
});



pool.on('error', function(error, client) {
    // handle this in the same way you would treat process.on('uncaughtException')
    // it is supplied the error as well as the idle client which received the error
  client.release();
  console.log('Request Processed, Closing Pool');
    
 })