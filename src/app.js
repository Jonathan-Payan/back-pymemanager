const express = require("express");
const morgan = require("morgan");
const pool = require('../src/config/db');
const cors = require('cors'); 


const authMiddleware = require('./middleware/auth');


const productsRoutes = require("./routes/products.routes");
const categoriesRoutes = require("./routes/categories.routes");
const customersRoutes = require("./routes/customers.routes");
const usersRoutes = require("./routes/users.routes");
const authRoutes = require("./routes/auth.routes")
const suppliersRoutes = require("./routes/suppliers.routes")


const app = express();

pool.connect(function(error){
  if(error){
    throw(error);
  }else{
    console.log("-------------------------------Conexion exitosa---------------------------")
  }
})




// Middleware de CORS
app.use(cors()); // Habilita CORS para todas las rutas

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
//app.use('/api', authenticate); // Middleware de autenticación aplicado a todas las rutas /api

//app.use('/api', authorize(['Admin'], ['READ_PRODUCT'])); // Middleware de autorización para roles y permisos específicos



// Routes de momento las que estan como api estan protegidas
app.use("/", productsRoutes);
app.use("/", authRoutes);
app.use("/", usersRoutes);
app.use("/", categoriesRoutes);
app.use("/api", customersRoutes);
app.use("/", suppliersRoutes);


app.use((req, res, next) => {
  
  res.status(404).json({ message: "Not found" });
});

module.exports = app;


