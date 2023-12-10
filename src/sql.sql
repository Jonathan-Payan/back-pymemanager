-- Tablas relacionadas con la gestión de proveedores y productos
DROP TABLE IF EXISTS suppliers_categories;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS product_prices;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS categories;

-- Tablas relacionadas con usuarios, roles y permisos
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS users_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;




CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Create the Suppliers table
CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    address VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(100),
    contact_name VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100)
);

-- Create the Suppliers_Categories table
CREATE TABLE suppliers_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT,
    category_id INT
);



-- Create the Products table with an additional column for image paths
CREATE TABLE products (
    code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255),
    supplier_id INT,
    category_id INT,
    weight DECIMAL(10, 2),
    expiration_date DATE,
    description VARCHAR(255),
    image_path VARCHAR(255) 
);
use pymemanager;
-- Crear la tabla de Precios de Productos con una clave foránea
CREATE TABLE product_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50),
    price DECIMAL(10, 2),
    date DATE,
    FOREIGN KEY (product_id) REFERENCES products(code)
);



-- ------------------------SALES---------------------------------------------
use pymemanager;

drop table if exists customers;
-- Create the Customers table
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    address VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(100)
);

drop table if exists sales;

-- Create the Sales table
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    sale_date DATE,
    total DECIMAL(10, 2),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

drop table if exists sale_details;

-- Create the SaleDetails table with taxes field
CREATE TABLE sale_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT,
    product_code VARCHAR(50), 
    quantity INT,
    taxes DECIMAL(10, 2),  
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (product_code) REFERENCES products(code) 
);



-- ------------------------------Usuarios y roles------------------------------


-- User Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);


CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE users_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);


CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);
CREATE TABLE role_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);



-- ---------------------------------------------------------------------






-- --------------------almacenados-------------------------------------------------

---------------------------------------------Products------------------------------------------------
DROP PROCEDURE IF EXISTS get_products;

DELIMITER //

CREATE PROCEDURE get_products(
  IN in_code VARCHAR(50),
  IN in_name VARCHAR(50),
  IN in_category_name VARCHAR(255), 
  IN in_supplier_name VARCHAR(255),
  IN in_weight DECIMAL(10, 2),  
  IN in_expiration_date DATE,
  IN in_description VARCHAR(255)
)
BEGIN
  SELECT
    p.*,
    c.name AS category_name,
	  pv.name AS supplier_name

  FROM
    products p
  LEFT JOIN
    categories c ON p.category_id = c.id
  LEFT JOIN
    suppliers pv ON p.supplier_id = pv.id
  WHERE
    (in_code IS NULL OR p.code = in_code OR p.code = '')
    AND (in_name IS NULL OR p.name = in_name OR p.name = '')
    AND (in_category_name IS NULL OR c.name = in_category_name OR c.name = '')
    AND (in_supplier_name IS NULL OR pv.name = in_supplier_name OR pv.name = '')
    AND (in_weight IS NULL OR p.weight = in_weight)
    AND (in_expiration_date IS NULL OR p.expiration_date = in_expiration_date)
    AND (in_description IS NULL OR p.description = in_description OR p.description = '');
END
//
DELIMITER ;







DROP PROCEDURE IF EXISTS get_prices;

DELIMITER //
CREATE PROCEDURE get_prices(
    IN in_id VARCHAR(50)
)
BEGIN
    -- Obtener todos los precios del producto
    SELECT date, price
    FROM product_prices
    WHERE product_id = in_id
    ORDER BY date desc;
END //
DELIMITER ;


CALL get_prices('P1001');

use pymemanager;

DROP PROCEDURE IF EXISTS add_price;


DELIMITER //
CREATE PROCEDURE add_price(
    IN in_product_id VARCHAR(50),
    IN in_price DECIMAL(10, 2),
    IN in_date DATE
)
BEGIN
    DECLARE productCount INT;

    -- Verificar si el producto existe
    SELECT COUNT(*) INTO productCount FROM products WHERE code = in_product_id;

    -- Si el producto existe, insertar el nuevo precio
    IF productCount > 0 THEN
        INSERT INTO product_prices (product_id, price, date)
        VALUES (in_product_id, in_price, in_date);
        SELECT 'Price added successfully' AS message;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Product does not exist', MYSQL_ERRNO = 1001;
    END IF;
END //
DELIMITER ;




CALL get_products(NULL, NULL, NULL, NULL, NULL, NULL, NULL);





DROP PROCEDURE IF EXISTS create_product;


DELIMITER //

CREATE PROCEDURE create_product(
    IN p_code VARCHAR(50),
    IN p_name VARCHAR(255),
    IN p_supplier_id INT,
    IN p_category_id INT,
    IN p_weight DECIMAL(10, 2),
    IN p_expiration_date DATE,
    IN p_description VARCHAR(255),
    IN p_image_path VARCHAR(255),
    OUT p_result_code INT
)
BEGIN
    DECLARE productCount INT;

    -- Verificar si el producto ya existe por su código
    SELECT COUNT(*) INTO productCount FROM products WHERE code = p_code;

    -- Si no existe, insertar el nuevo producto
    IF productCount = 0 THEN
        INSERT INTO products (code, name, supplier_id, category_id, weight, expiration_date, description, image_path)
        VALUES (p_code, p_name, p_supplier_id, p_category_id, p_weight, p_expiration_date, p_description, p_image_path);
        SET p_result_code = 1; -- 1 indica éxito
    ELSE
        SET p_result_code = 0; -- 0 indica que el producto ya existe
    END IF;
END //

DELIMITER ;

DROP PROCEDURE IF EXISTS update_product;

DELIMITER //

CREATE PROCEDURE update_product(
    IN p_code VARCHAR(50),
    IN p_name VARCHAR(255),
    IN p_supplier_id INT,
    IN p_category_id INT,
    IN p_weight DECIMAL(10, 2),
    IN p_expiration_date DATE,
    IN p_description VARCHAR(255),
    IN p_image_path VARCHAR(255),
    OUT p_result_code INT
)
BEGIN
    DECLARE productCount INT;

    -- Verificar si el producto existe por su código
    SELECT COUNT(*) INTO productCount FROM products WHERE code = p_code;

    -- Si el producto existe, actualizar sus datos
    IF productCount > 0 THEN
        UPDATE products
        SET name = p_name,
            supplier_id = p_supplier_id,
            category_id = p_category_id,
            weight = p_weight,
            expiration_date = p_expiration_date,
            description = p_description,
            image_path = p_image_path
        WHERE code = p_code;
        SET p_result_code = 1; -- 1 indica éxito
    ELSE
        SET p_result_code = 0; -- 0 indica que el producto no existe
    END IF;
END //

DELIMITER ;

use pymemanager;

drop procedure if exists delete_product;
DELIMITER //

CREATE PROCEDURE delete_product(
    IN p_code VARCHAR(50),
    OUT p_result_code INT
)
BEGIN
    -- Intentar eliminar el producto y obtener el número de filas afectadas
    DELETE FROM products WHERE code = p_code;
    SET p_result_code = ROW_COUNT(); -- ROW_COUNT() devuelve el número de filas afectadas

    -- Si el número de filas afectadas es mayor que 0, se eliminó el producto con éxito
    IF p_result_code > 0 THEN
        SET p_result_code = 1; -- 1 indica éxito
    ELSE
        SET p_result_code = 0; -- 0 indica que el producto no existe
    END IF;
END //

DELIMITER ;



-- ------------------------SALES---------------------------------------------
-- Reporte de Ventas Totales por Cliente:
drop procedure if exists get_sales_by_client;


DELIMITER //
CREATE PROCEDURE get_sales_by_client()
BEGIN
    SELECT customers.name AS client_name, SUM(sales.total) AS total_sales
    FROM sales
    JOIN customers ON sales.customer_id = customers.id
    GROUP BY customers.name;
END //
DELIMITER ;


call get_sales_by_client();


-- Reporte de Ventas por Período de Tiempo:
DELIMITER //
CREATE PROCEDURE get_sales_by_period(IN start_date DATE, IN end_date DATE)
BEGIN
    SELECT sale_date, SUM(total) AS total_sales
    FROM sales
    WHERE sale_date BETWEEN start_date AND end_date
    GROUP BY sale_date;
END //
DELIMITER ;

-- Gráfico de Distribución de Productos Vendidos:

DELIMITER //
CREATE PROCEDURE get_product_distribution()
BEGIN
    SELECT product_code, COUNT(*) AS quantity_sold
    FROM sale_details
    GROUP BY product_code;
END //
DELIMITER ;

-- Gráfico de Ventas por Categoría de Producto:

DELIMITER //
CREATE PROCEDURE get_sales_by_category()
BEGIN
    SELECT categories.name AS category_name, SUM(sale_details.quantity) AS total_sales
    FROM sale_details
    JOIN products ON sale_details.product_code = products.code
    JOIN categories ON products.category_id = categories.id
    GROUP BY categories.name;
END //
DELIMITER ;


-- ---------------------------------------------------------------------


-- ---------------------------------------------endProducts------------------------------------------------

-- Test data for the "categories" table
INSERT INTO categories (id, name)
VALUES
    (1, 'Alimentos y Bebidas'),
    (2, 'Electrónica y Tecnología'),
    (3, 'Ropa y Moda'),
    (4, 'Productos para el Hogar'),
    (5, 'Salud y Belleza'),
    (6, 'Electrodomésticos'),
    (7, 'Juguetes y Entretenimiento'),
    (8, 'Construcción y Ferretería'),
    (9, 'Automóviles y Accesorios'),
    (10, 'Deportes y Aire Libre'),
    (11, 'Libros y Medios'),
    (12, 'Productos para Oficina'),
    (13, 'Joyería y Relojes'),
    (14, 'Productos para Mascotas'),
    (15, 'Productos createdAtupdatedAtuserIdde Limpieza');
    
-- Test data for the "suppliers" table
INSERT INTO suppliers (name, address, phone, email, website, contact_name, contact_phone, contact_email)
VALUES
    ('Proveedor A', 'Dirección A', '123-456-7890', 'proveedorA@example.com', 'www.proveedorA.com', 'Contacto A', '111-222-3333', 'contactoA@example.com'),
    ('Proveedor B', 'Dirección B', '987-654-3210', 'proveedorB@example.com', 'www.proveedorB.com', 'Contacto B', '444-555-6666', 'contactoB@example.com'),
    ('Proveedor C', 'Dirección C', '555-123-7777', 'proveedorC@example.com', 'www.proveedorC.com', 'Contacto C', '777-888-9999', 'contactoC@example.com');


-- Products
INSERT INTO products (code, name, supplier_id, category_id, weight, expiration_date, description, image_path)
VALUES
('P1001', 'Producto 1', 1, 1, 1.25, '2023-12-31', 'Este es el primer producto de prueba con una descripción detallada.', '/path/to/image1.jpg'),
('P1002', 'Producto 2', 2, 2, 0.75, '2023-11-30', 'El segundo producto de prueba con una breve descripción.', '/path/to/image2.jpg'),
('P1003', 'Producto 3', 3, 1, 2.50, '2024-02-28', 'Producto 3 es otro ejemplo con una descripción completa.', '/path/to/image3.jpg'),
('P1004', 'Producto 4', 1, 3, 1.50, '2023-12-15', 'Descripción del Producto 4.', '/path/to/image4.jpg'),
('P1005', 'Producto 5', 2, 4, 0.90, '2023-12-20', 'Descripción del Producto 5.', '/path/to/image5.jpg'),
('P1006', 'Producto 6', 3, 5, 3.00, '2024-01-10', 'Descripción del Producto 6.', '/path/to/image6.jpg'),
('P1007', 'Producto 7', 1, 6, 2.25, '2024-03-01', 'Descripción del Producto 7.', '/path/to/image7.jpg'),
('P1008', 'Producto 8', 2, 7, 1.80, '2023-12-25', 'Descripción del Producto 8.', '/path/to/image8.jpg'),
('P1009', 'Producto 9', 3, 8, 2.75, '2024-01-15', 'Descripción del Producto 9.', '/path/to/image9.jpg'),
('P1010', 'Producto 10', 1, 9, 1.20, '2023-12-18', 'Descripción del Producto 10.', '/path/to/image10.jpg'),
('P1011', 'Producto 11', 2, 10, 2.00, '2024-02-15', 'Descripción del Producto 11.', '/path/to/image11.jpg'),
('P1012', 'Producto 12', 3, 11, 0.95, '2024-01-05', 'Descripción del Producto 12.', '/path/to/image12.jpg'),
('P1013', 'Producto 13', 1, 12, 1.75, '2024-03-05', 'Descripción del Producto 13.', '/path/to/image13.jpg'),
('P1014', 'Producto 14', 2, 13, 2.10, '2023-12-28', 'Descripción del Producto 14.', '/path/to/image14.jpg'),
('P1015', 'Producto 15', 3, 14, 1.30, '2024-02-10', 'Descripción del Producto 15.', '/path/to/image15.jpg'),
('P1016', 'Producto 16', 1, 15, 2.50, '2024-01-20', 'Descripción del Producto 16.', '/path/to/image16.jpg'),
('P1017', 'Producto 17', 2, 1, 1.15, '2023-12-22', 'Descripción del Producto 17.', '/path/to/image17.jpg'),
('P1018', 'Producto 18', 3, 2, 1.90, '2024-02-20', 'Descripción del Producto 18.', '/path/to/image18.jpg'),
('P1019', 'Producto 19', 1, 3, 2.25, '2023-12-23', 'Descripción del Producto 19.', '/path/to/image19.jpg'),
('P1020', 'Producto 20', 2, 4, 0.80, '2024-01-25', 'Descripción del Producto 20.', '/path/to/image20.jpg'),
('P1021', 'Producto 21', 3, 5, 1.50, '2023-12-26', 'Descripción del Producto 21.', '/path/to/image21.jpg'),
('P1022', 'Producto 22', 1, 6, 2.10, '2024-02-25', 'Descripción del Producto 22.', '/path/to/image22.jpg'),
('P1023', 'Producto 23', 2, 7, 1.25, '2024-01-30', 'Descripción del Producto 23.', '/path/to/image23.jpg'),
('P1024', 'Producto 24', 3, 8, 2.00, '2023-12-29', 'Descripción del Producto 24.', '/path/to/image24.jpg'),
('P1025', 'Producto 25', 1, 9, 0.95, '2024-02-05', 'Descripción del Producto 25.', '/path/to/image25.jpg'),
('P1026', 'Producto 26', 2, 10, 1.80, '2023-12-31', 'Descripción del Producto 26.', '/path/to/image26.jpg'),
('P1027', 'Producto 27', 3, 11, 2.40, '2024-02-28', 'Descripción del Producto 27.', '/path/to/image27.jpg'),
('P1028', 'Producto 28', 1, 12, 1.10, '2024-01-02', 'Descripción del Producto 28.', '/path/to/image28.jpg'),
('P1029', 'Producto 29', 2, 13, 1.65, '2023-12-24', 'Descripción del Producto 29.', '/path/to/image29.jpg'),
('P1030', 'Producto 30', 3, 14, 2.20, '2024-03-02', 'Descripción del Producto 30.', '/path/to/image30.jpg');


INSERT INTO product_prices (product_id, price, date) VALUES
('P1001', 10990, '2023-12-01'),
('P1001', 12500, '2023-12-05'),
('P1001', 11750, '2023-12-10'),
('P1002', 8750, '2023-12-03'),
('P1002', 9250, '2023-12-08'),
('P1003', 14990, '2023-12-02'),
('P1003', 16500, '2023-12-07'),
('P1004', 11250, '2023-12-04'),
('P1004', 13000, '2023-12-09');


-- Test data for the "suppliers_categories" table
INSERT INTO suppliers_categories (supplier_id, category_id)
VALUES
    (1, 1),
    (1, 2),
    (2, 2),
    (2, 3),
    (3, 1),
    (3, 4);

INSERT INTO users (username, email, password_hash)
VALUES
  ('user1', 'user1@example.com', '$2b$10$cuZc2NtHCMsUqo/VV/NR5OH3Ue3oMvqM4p9cfVSRbNGsMKg4dpFVe'), -- Contraseña: password1
  ('user2', 'user2@example.com', '$2b$10$Y0JyfKHz6R3RhVOIZ6qJGOeKVYRISB3uO7yqtbFnEN.vC4Pr2jyai'), -- Contraseña: password2
  ('user3', 'user3@example.com', '$2b$10$A1CY5C9Qs7S/H.JTPbLVKO9X3r/NdKHiRDn/Zv/I2CeG0T/yQgumW'); -- Contraseña: password3
  
  
INSERT INTO roles (name) VALUES
('Propietario de la Empresa'),
('Administrador'),
('Gerente de Ventas'),
('Gerente de Compras'),
('Gerente de Recursos Humanos'),
('Personal de Almacén y Logística'),
('Contador'),
('Cliente'),
('Usuario'),
('Proveedor');


-- 'user1' es un Propietario de la Empresa
INSERT INTO users_roles (user_id, role_id) VALUES (1, 1);

-- 'user2' es un Gerente de Ventas y un Contador
INSERT INTO users_roles (user_id, role_id) VALUES (2, 2), (2, 6);

-- 'user3' es un Personal de Almacén y Logística
INSERT INTO users_roles (user_id, role_id) VALUES (3, 5);


-- Insertar datos de prueba en la tabla permissions
INSERT INTO permissions (name) VALUES
('Ver Información General'), -- Permiso 1
('Gestionar Usuarios'),       -- Permiso 2
('Crear Facturas'),            -- Permiso 3
('Gestionar Inventario');      -- Permiso 4

-- Insertar datos de prueba en la tabla role_permissions
-- Asignar permisos a roles específicos
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), -- Propietario de la Empresa puede ver información general
(2, 2), -- Administrador puede gestionar usuarios
(3, 3), -- Gerente de Ventas puede crear facturas
(4, 4), -- Gerente de Compras puede gestionar inventario
(5, 2), -- Gerente de Recursos Humanos también puede gestionar usuarios
(6, 4), -- Personal de Almacén y Logística puede gestionar inventario
(7, 2), -- Contador puede gestionar usuarios
(8, 1), -- Cliente puede ver información general
(9, 1), -- Usuario tiene acceso básico
(10, 4);-- Proveedor puede gestionar inventario



  -- Datos de prueba para la tabla de clientes
INSERT INTO customers (name, address, phone, email, website)
VALUES
    ('Cliente A', 'Dirección A', '123-456-7890', 'clienteA@example.com', 'www.clienteA.com'),
    ('Cliente B', 'Dirección B', '987-654-3210', 'clienteB@example.com', 'www.clienteB.com'),
    ('Cliente C', 'Dirección C', '555-123-7777', 'clienteC@example.com', 'www.clienteC.com'),
    ('Cliente D', 'Dirección D', '111-222-3333', 'clienteD@example.com', 'www.clienteD.com'),
    ('Cliente E', 'Dirección E', '444-555-6666', 'clienteE@example.com', 'www.clienteE.com'),
    ('Cliente F', 'Dirección F', '777-888-9999', 'clienteF@example.com', 'www.clienteF.com'),
    ('Cliente G', 'Dirección G', '999-000-1111', 'clienteG@example.com', 'www.clienteG.com'),
    ('Cliente H', 'Dirección H', '222-333-4444', 'clienteH@example.com', 'www.clienteH.com'),
    ('Cliente I', 'Dirección I', '555-666-7777', 'clienteI@example.com', 'www.clienteI.com'),
    ('Cliente J', 'Dirección J', '888-999-0000', 'clienteJ@example.com', 'www.clienteJ.com');

-- Datos de prueba para la tabla de ventas
INSERT INTO sales (customer_id, sale_date, total)
VALUES
    (1, '2023-12-01', 150.75),
    (2, '2023-12-02', 200.50),
    (3, '2023-12-03', 75.25),
    (4, '2023-12-04', 120.00),
    (5, '2023-12-05', 90.80),
    (6, '2023-12-06', 180.30),
    (7, '2023-12-07', 250.00),
    (8, '2023-12-08', 130.50),
    (9, '2023-12-09', 95.75),
    (10, '2023-12-10', 110.20);

-- Datos de prueba para la tabla de detalles de ventas
-- SaleDetails
INSERT INTO sale_details (sale_id, product_code, quantity, taxes)
VALUES
(1, 'P1001', 2, 0.19),  -- Venta 1, Producto 1, Cantidad 2, Impuesto fijo del 19%
(1, 'P1002', 1, 0.19),  -- Venta 1, Producto 2, Cantidad 1, Impuesto fijo del 19%
(2, 'P1003', 3, 0.19),  -- Venta 2, Producto 3, Cantidad 3, Impuesto fijo del 19%
(2, 'P1004', 1, 0.19),  -- Venta 2, Producto 4, Cantidad 1, Impuesto fijo del 19%
(3, 'P1005', 2, 0.19),  -- Venta 3, Producto 5, Cantidad 2, Impuesto fijo del 19%
(3, 'P1006', 1, 0.19),  -- Venta 3, Producto 6, Cantidad 1, Impuesto fijo del 19%
(4, 'P1007', 3, 0.19),  -- Venta 4, Producto 7, Cantidad 3, Impuesto fijo del 19%
(4, 'P1008', 2, 0.19),  -- Venta 4, Producto 8, Cantidad 2, Impuesto fijo del 19%
(5, 'P1009', 1, 0.19),  -- Venta 5, Producto 9, Cantidad 1, Impuesto fijo del 19%
(5, 'P1010', 2, 0.19),  -- Venta 5, Producto 10, Cantidad 2, Impuesto fijo del 19%
(6, 'P1011', 1, 0.19),  -- Venta 6, Producto 11, Cantidad 1, Impuesto fijo del 19%
(6, 'P1012', 3, 0.19),  -- Venta 6, Producto 12, Cantidad 3, Impuesto fijo del 19%
(7, 'P1013', 2, 0.19),  -- Venta 7, Producto 13, Cantidad 2, Impuesto fijo del 19%
(7, 'P1014', 1, 0.19),  -- Venta 7, Producto 14, Cantidad 1, Impuesto fijo del 19%
(8, 'P1015', 3, 0.19),  -- Venta 8, Producto 15, Cantidad 3, Impuesto fijo del 19%
(8, 'P1016', 2, 0.19),  -- Venta 8, Producto 16, Cantidad 2, Impuesto fijo del 19%
(9, 'P1017', 1, 0.19),  -- Venta 9, Producto 17, Cantidad 1, Impuesto fijo del 19%
(9, 'P1018', 2, 0.19),  -- Venta 9, Producto 18, Cantidad 2, Impuesto fijo del 19%
(10, 'P1019', 3, 0.19),  -- Venta 10, Producto 19, Cantidad 3, Impuesto fijo del 19%
(10, 'P1020', 1, 0.19)  -- Venta 10, Producto 20, Cantidad 1, Impuesto fijo del 19%




