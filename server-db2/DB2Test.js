
var ibmdb = require("ibm_db")
, conn = new ibmdb.Database()
  , cn = "DRIVER={DB2};DATABASE=annodb;HOSTNAME=172.22.52.23;UID=db2inst1;PWD=Synechron@1;PORT=5000;PROTOCOL=TCPIP"
  ;

// open a connection to the database
conn.openSync(cn);

// create table and insert some rows to it.
conn.querySync("create table mytab2 (c1 int, c2 varchar(20))");
conn.querySync("insert into mytab2 values (1, 'bimal'),(2, 'kamal'),(3,'mohan'),(4,'ram')");

// Select data from table
conn.queryResult("select * from mytab2", function (err, result) {
  if(err) {
    console.log(err);
    return;
  }
  
  // Fetch single row at once and process it.
  // Note that queryResult will bring only 64k data from server and result.fetchSync
  // will return each row from this 64k client buffer. Once all data is read from
  // buffer, ibm_db driver will bring another 64k chunk of data from server.
  var data;
  while( data = result.fetchSync() )
  {
    console.log(data);
  }

  // drop the table and close connection.
  //conn.querySync("drop table mytab");
  conn.closeSync();
});
