var express = require("express");
const multer = require("multer");
const http = require('http');
const path = require("path")
var bodyParser = require('body-parser');
var cors = require('cors');
const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');

class Server {
    constructor(){
        this.app = express();
        //serving static files in upload/images folder 
        this.app.use("/Uploads", express.static(path.join(__dirname, '/Uploads/')));

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use(jwt());
        this.app.use(errorHandler);

        var commonRoutes = require('./controller/common/common.routes');
        var vendorRoutes = require('./controller/vendors/vendors.routes');
        var customerRoutes = require('./controller/customers/customers.routes');
        var categoryRoutes = require('./controller/category/category.routes');
        var ProductRoutes = require('./controller/product/product.routes');
        var InvoiceRoutes = require('./controller/invoice/invoice.routes');

        this.app.use('/api', commonRoutes);
        this.app.use('/api/Vendors', vendorRoutes);
        this.app.use('/api/Customers', customerRoutes);
        this.app.use('/api/Category', categoryRoutes);
        this.app.use('/api/Product', ProductRoutes);
        this.app.use('/api/Invoice', InvoiceRoutes);
       
        this.http = http.Server(this.app);

    }

    async appExecute(){
        const port = process.env.PORT || 4000;
        this.app.listen(port);
        console.log('Server is running at ', port);
    }
}

const app = new Server();
app.appExecute();
