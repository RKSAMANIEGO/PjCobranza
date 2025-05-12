create database pjCobranza;
use pjCobranza;


CREATE TABLE usuarios(
id int primary key auto_increment,
email varchar(60) unique not null,
password varchar(100) not null,
confirm_password varchar(100) not null,
rol varchar(50) not null
);

CREATE TABLE clientes (
    cliente_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(15) NOT NULL,
    correo VARCHAR(100),
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prestamos (
    prestamo_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    monto DECIMAL(10, 2) NOT NULL,
    tiempo INT NOT NULL DEFAULT 24,
    tasa_interes DECIMAL(5, 2) NOT NULL, 
    fecha_inicio DATE NOT NULL, 
    fecha_vencimiento DATE NOT NULL,
    estado ENUM('pendiente', 'pagado', 'vencido') DEFAULT 'pendiente',
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id)
);

CREATE TABLE pagos (
    pago_id INT AUTO_INCREMENT PRIMARY KEY,
    prestamo_id INT,
    monto_pago DECIMAL(10, 2) NOT NULL,
    fecha_pago DATE NOT NULL,
    metodo_pago ENUM('efectivo', 'transferencia', 'tarjeta') NOT NULL,
    FOREIGN KEY (prestamo_id) REFERENCES prestamos(prestamo_id)
);

-- INSERT TABLA CLIENTES
INSERT INTO clientes (nombre,apellido,dni,correo,telefono,direccion,fecha_registro) 
VALUES ("enrike rod","samaniego guzman","75798638","erksg.10.26@gmail.com","916912549","ATE",curdate());
INSERT INTO clientes (nombre,apellido,dni,correo,telefono,direccion,fecha_registro) 
VALUES ("pamela sofia","rojas guerrero","48652345","pame_sofia@gmail.com","999562348","SURCO",curdate());
INSERT INTO clientes (nombre,apellido,dni,correo,telefono,direccion,fecha_registro) 
VALUES ("korina stefa","aranda ortiz","10098638","korina@gmail.com","900253247","MIRAFLORES",curdate());

INSERT INTO clientes (nombre,apellido,dni,correo,telefono,direccion) 
VALUES ("korina stefa","aranda ortiz","10098638","korina@gmail.com","900253247","MIRAFLORES");

-- INSERT TABLA PRESTAMOS
INSERT INTO prestamos(cliente_id,monto,tiempo,tasa_interes,fecha_inicio,fecha_vencimiento)
VALUES(1,150.00,24,15,CURDATE(),"2025-03-27");

INSERT INTO prestamos(cliente_id,monto,tiempo,tasa_interes,fecha_inicio,fecha_vencimiento)
VALUES(2,200.00,24,10,CURDATE(),"2025-03-27");

INSERT INTO prestamos(cliente_id,monto,tiempo,tasa_interes,fecha_inicio,fecha_vencimiento)
VALUES(3,350.00,24,20,CURDATE(),"2025-04-04");

INSERT INTO prestamos(cliente_id,monto,tiempo,tasa_interes,fecha_inicio,fecha_vencimiento)
VALUES(1,350.00,24,20,"2025-03-12","2025-04-05");

-- INSERT TABLA PAGOS
INSERT INTO pagos (prestamo_id,monto_pago,fecha_pago,metodo_pago)
VALUES (1,6.25,CURDATE(),"transferencia");
INSERT INTO pagos (prestamo_id,monto_pago,fecha_pago,metodo_pago)
VALUES (1,6.25,"2024-03-11","efectivo");
INSERT INTO pagos (prestamo_id,monto_pago,fecha_pago,metodo_pago)
VALUES (2,9.16,curdate(),"transferencia");
INSERT INTO pagos (prestamo_id,monto_pago,fecha_pago,metodo_pago)
VALUES (2,9.16,"2024-03-11","transferencia");
INSERT INTO pagos (prestamo_id,monto_pago,fecha_pago,metodo_pago)
VALUES (1,6.25,'2024-03-12',"transferencia");

SHOW TABLES;
---
-- CONSULTAS

SELECT  * FROM clientes; 	/*lista de clientes*/ 

-- STORE PROCEDURE
 /*lista de prestamos de cada cliente*/
DELIMITER $$
CREATE PROCEDURE listaGeneralPrestamos()
BEGIN 
SELECT p.prestamo_id , /*int*/
concat(c.nombre,' ',c.apellido)as clientes, /*string*/
p.monto,  /*bigDecimal*/
p.tiempo, /*int*/
p.tasa_interes, /*bigDecimal*/
p.fecha_inicio, /*date*/ 
p.fecha_vencimiento,/*date*/
p.estado, /*string*/
p.monto + (p.monto*(p.tasa_interes/100)) as 'importeTotal' /*BigDecimal*/
FROM prestamos p
JOIN clientes c 
ON p.cliente_id = c.cliente_id; 
END $$
DELIMITER 

CALL listaGeneralPrestamos();

--- 
 /*LISTA DE PAGOS POR CLIENTE */
---
DELIMITER $$
CREATE PROCEDURE listPagosByIdPrestamo(in idPrestamo int)
BEGIN
SELECT p.pago_id
,concat(c.nombre,' ',c.apellido)as cliente 
,pr.monto 
,pr.tiempo
,pr.tasa_interes
,p.monto_pago  
,p.fecha_pago 
,p.metodo_pago  
FROM pagos p
JOIN prestamos pr
ON p.prestamo_id=pr.prestamo_id
JOIN clientes c
ON pr.cliente_id=c.cliente_id
WHERE p.prestamo_id=idPrestamo; 
END $$
DELIMITER 
         

SELECT  prestamo_id, COUNT(prestamo_id) as 'Pagos Realizados'
FROM pagos
WHERE prestamo_id = 1
GROUP BY prestamo_id;            /*CANTIDAD DE PAGOS REALIZADOS POR PRESTAMO*/

UPDATE prestamos SET estado="pagado" WHERE prestamo_id=7;
SELECT  * FROM prestamos; 
SELECT  * FROM pagos; 