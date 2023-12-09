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


-- Test data for the "products" table with image paths
INSERT INTO products (code, name, supplier_id, category_id, weight, expiration_date, description, image_path)
VALUES
    ('P1001', 'Producto 1', 1, 1, 1.25, '2023-12-31', 'Este es el primer producto de prueba con una descripción detallada.', '/path/to/image1.jpg'),
    ('P1002', 'Producto 2', 2, 2, 0.75, '2023-11-30', 'El segundo producto de prueba con una breve descripción.', '/path/to/image2.jpg'),
    ('P1003', 'Producto 3', 3, 1, 2.50, '2024-02-28', 'Producto 3 es otro ejemplo con una descripción completa.', '/path/to/image3.jpg');

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

