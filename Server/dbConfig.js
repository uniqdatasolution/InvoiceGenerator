const sql = require('mssql');

const config = {
    user: 'db_a57073_invoiceapp_admin',
    password: 'invoice@920',
    server: 'sql5104.site4now.net',
    database: 'db_a57073_invoiceapp',
    options: {
      trustedconnecction: true,
      enableArithAort: true,
    },
}

function handleConnection() {
  var conn = new sql.ConnectionPool(config);
  var req = new sql.Request(conn);

  conn.connect(function(err) {
    if(err) {
        console.log(err);
        return;
    }
    else {
        console.log('Database Connected Succesfully');
    }
  });
}

handleConnection();

module.exports = config;