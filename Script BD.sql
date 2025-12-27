-- ============================================
-- SCRIPT DE OPTIMIZACIÓN PARA SISTEMA DE PRÉSTAMOS
-- Versión optimizada para MySQL 8.0+
-- Compatible con Node.js, JavaScript y HTML
-- ============================================

-- Configuración inicial
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
START TRANSACTION;
SET time_zone = "+00:00";

-- Eliminar base de datos existente si existe
DROP DATABASE IF EXISTS `brksoft_brksoftware`;
CREATE DATABASE `brksoft_brksoftware` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `brksoft_brksoftware`;

-- ============================================
-- SECCIÓN 1: TABLAS PRINCIPALES (ENTIDADES BASE)
-- ============================================

-- Tabla: masters - Usuarios de nivel más alto del sistema
CREATE TABLE `masters` (
  `idmaster` varchar(25) NOT NULL,
  `cedula` varchar(10) NOT NULL,
  `nombre` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `zona_horaria` varchar(10) NOT NULL DEFAULT '-4.00',
  `zona_select` int(11) NOT NULL DEFAULT 0,
  `rendimiento` double NOT NULL DEFAULT 100,
  `latitud` double NOT NULL DEFAULT 0,
  `longitud` double NOT NULL DEFAULT 0,
  `contador_administradores` int(11) NOT NULL DEFAULT 0,
  `contador_secretarios` int(11) NOT NULL DEFAULT 0,
  `contador_supervisores` int(11) NOT NULL DEFAULT 0,
  `contador_cobradores` int(11) NOT NULL DEFAULT 0,
  `contador_clientes` int(11) NOT NULL DEFAULT 0,
  `creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idmaster`),
  UNIQUE KEY `cedula` (`cedula`),
  KEY `idx_master_composite` (`idmaster`,`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Usuarios principales del sistema (nivel más alto)';

-- Tabla: administradores - Administradores del sistema
CREATE TABLE `administradores` (
  `idadministrador` varchar(25) NOT NULL,
  `cedula` varchar(10) NOT NULL,
  `nombre` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `zona_horaria` varchar(10) NOT NULL DEFAULT '-4.00',
  `zona_select` int(11) NOT NULL DEFAULT 0,
  `rendimiento` double NOT NULL DEFAULT 100,
  `latitud` double NOT NULL DEFAULT 0,
  `longitud` double NOT NULL DEFAULT 0,
  `creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idadministrador`),
  UNIQUE KEY `cedula` (`cedula`),
  KEY `idx_admin_composite` (`idadministrador`,`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Administradores del sistema';

-- Tabla: secretarios - Secretarios del sistema
CREATE TABLE `secretarios` (
  `idsecretario` varchar(25) NOT NULL,
  `cedula` varchar(10) NOT NULL,
  `nombre` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `zona_horaria` varchar(10) NOT NULL DEFAULT '-4.00',
  `zona_select` int(11) NOT NULL DEFAULT 0,
  `rendimiento` double NOT NULL DEFAULT 100,
  `latitud` double NOT NULL DEFAULT 0,
  `longitud` double NOT NULL DEFAULT 0,
  `creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idsecretario`),
  UNIQUE KEY `cedula` (`cedula`),
  KEY `idx_secretario_composite` (`idsecretario`,`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Secretarios del sistema';

-- Tabla: supervisores - Supervisores del sistema
CREATE TABLE `supervisores` (
  `idsupervisor` varchar(25) NOT NULL,
  `cedula` varchar(10) NOT NULL,
  `nombre` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `zona_horaria` varchar(10) NOT NULL DEFAULT '-4.00',
  `zona_select` int(11) NOT NULL DEFAULT 0,
  `rendimiento` double NOT NULL DEFAULT 100,
  `latitud` double NOT NULL DEFAULT 0,
  `longitud` double NOT NULL DEFAULT 0,
  `creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idsupervisor`),
  UNIQUE KEY `cedula` (`cedula`),
  KEY `idx_supervisor_composite` (`idsupervisor`,`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Supervisores del sistema';

-- Tabla: cobradores - Cobradores del sistema
CREATE TABLE `cobradores` (
  `idcobrador` varchar(25) NOT NULL,
  `cedula` varchar(10) NOT NULL,
  `nombre` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `zona_horaria` varchar(10) NOT NULL DEFAULT '-4.00',
  `zona_select` int(11) NOT NULL DEFAULT 0,
  `rendimiento` double NOT NULL DEFAULT 100,
  `latitud` double NOT NULL DEFAULT 0,
  `longitud` double NOT NULL DEFAULT 0,
  `creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idcobrador`),
  UNIQUE KEY `cedula` (`cedula`),
  KEY `idx_cobrador_composite` (`idcobrador`,`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Cobradores del sistema';

-- Tabla: clientes - Clientes del sistema
CREATE TABLE `clientes` (
  `idcliente` varchar(25) NOT NULL,
  `cedula` varchar(10) NOT NULL,
  `nombre` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `negocio` varchar(100) NOT NULL DEFAULT '',
  `zona_horaria` varchar(10) NOT NULL DEFAULT '-4.00',
  `zona_select` int(11) NOT NULL DEFAULT 0,
  `rendimiento` double NOT NULL DEFAULT 100,
  `latitud` double NOT NULL DEFAULT 0,
  `longitud` double NOT NULL DEFAULT 0,
  `creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idcliente`),
  UNIQUE KEY `cedula` (`cedula`),
  KEY `idx_cliente_composite` (`idcliente`,`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Clientes del sistema';

-- Tabla: monedas - Tipos de moneda del sistema
CREATE TABLE `monedas` (
  `idmoneda` varchar(25) NOT NULL,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abreviatura` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor_cambiario` decimal(11,2) NOT NULL DEFAULT 1.00,
  `creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idmoneda`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `idx_moneda_composite` (`idmoneda`,`nombre`,`abreviatura`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tipos de moneda disponibles en el sistema';

-- ============================================
-- SECCIÓN 2: TABLAS DE RELACIÓN GLOBAL
-- ============================================

-- Tabla: global_administradores - Relación masters con administradores
CREATE TABLE `global_administradores` (
  `vma` varchar(25) NOT NULL,
  `idmaster` varchar(25) NOT NULL,
  `idadministrador` varchar(25) NOT NULL,
  `contador_secretarios` int(11) NOT NULL DEFAULT 0,
  `contador_supervisores` int(11) NOT NULL DEFAULT 0,
  `contador_cobradores` int(11) NOT NULL DEFAULT 0,
  `contador_clientes` int(11) NOT NULL DEFAULT 0,
  `creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ultima_liquidacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `bloqueado` tinyint(1) NOT NULL DEFAULT 0,
  `detalle_bloqueo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `cierre_sistema` time NOT NULL DEFAULT '23:30:00',
  `apertura_sistema` time NOT NULL DEFAULT '00:30:00',
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vma`),
  UNIQUE KEY `uq_master_administrador` (`idmaster`,`idadministrador`),
  KEY `idx_global_admin_composite` (`vma`,`idmaster`,`idadministrador`,`bloqueado`),
  KEY `fk_global_admin_administrador` (`idadministrador`),
  CONSTRAINT `fk_global_admin_administrador` FOREIGN KEY (`idadministrador`) REFERENCES `administradores` (`idadministrador`) ON DELETE CASCADE,
  CONSTRAINT `fk_global_admin_master` FOREIGN KEY (`idmaster`) REFERENCES `masters` (`idmaster`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Relación entre masters y administradores';

-- Tabla: global_secretarios - Relación administradores con secretarios
CREATE TABLE `global_secretarios` (
  `vase` varchar(25) NOT NULL,
  `vma` varchar(25) NOT NULL,
  `idsecretario` varchar(25) NOT NULL,
  `creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `bloqueado` tinyint(1) NOT NULL DEFAULT 0,
  `detalle_bloqueo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `cierre_sistema` time NOT NULL DEFAULT '23:30:00',
  `apertura_sistema` time NOT NULL DEFAULT '00:30:00',
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vase`),
  UNIQUE KEY `uq_vma_secretario` (`vma`,`idsecretario`),
  KEY `idx_global_secretario_composite` (`vase`,`vma`,`idsecretario`,`bloqueado`),
  KEY `fk_global_secretario_secretario` (`idsecretario`),
  CONSTRAINT `fk_global_secretario_secretario` FOREIGN KEY (`idsecretario`) REFERENCES `secretarios` (`idsecretario`) ON DELETE CASCADE,
  CONSTRAINT `fk_global_secretario_vma` FOREIGN KEY (`vma`) REFERENCES `global_administradores` (`vma`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Relación entre administradores y secretarios';

-- Tabla: global_supervisores - Relación administradores con supervisores
CREATE TABLE `global_supervisores` (
  `vasu` varchar(25) NOT NULL,
  `vma` varchar(25) NOT NULL,
  `idsupervisor` varchar(25) NOT NULL,
  `creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `bloqueado` tinyint(1) NOT NULL DEFAULT 0,
  `detalle_bloqueo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `cierre_sistema` time NOT NULL DEFAULT '23:30:00',
  `apertura_sistema` time NOT NULL DEFAULT '00:30:00',
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vasu`),
  UNIQUE KEY `uq_vma_supervisor` (`vma`,`idsupervisor`),
  KEY `idx_global_supervisor_composite` (`vasu`,`vma`,`idsupervisor`,`bloqueado`),
  KEY `fk_global_supervisor_supervisor` (`idsupervisor`),
  CONSTRAINT `fk_global_supervisor_supervisor` FOREIGN KEY (`idsupervisor`) REFERENCES `supervisores` (`idsupervisor`) ON DELETE CASCADE,
  CONSTRAINT `fk_global_supervisor_vma` FOREIGN KEY (`vma`) REFERENCES `global_administradores` (`vma`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Relación entre administradores y supervisores';

-- Tabla: global_cobradores - Relación administradores con cobradores
CREATE TABLE `global_cobradores` (
  `vac` varchar(25) NOT NULL,
  `vma` varchar(25) NOT NULL,
  `idcobrador` varchar(25) NOT NULL,
  `contador_clientes` int(11) NOT NULL DEFAULT 0,
  `prestamos_vigentes` int(11) NOT NULL DEFAULT 0,
  `prestamos_pagados` int(11) NOT NULL DEFAULT 0,
  `datetime_available` int(11) NOT NULL DEFAULT 0,
  `creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ultima_liquidacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `bloqueado` tinyint(1) NOT NULL DEFAULT 0,
  `detalle_bloqueo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `cierre_sistema` time NOT NULL DEFAULT '23:30:00',
  `apertura_sistema` time NOT NULL DEFAULT '00:30:00',
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vac`),
  UNIQUE KEY `uq_vma_cobrador` (`vma`,`idcobrador`),
  KEY `idx_global_cobrador_composite` (`vac`,`vma`,`idcobrador`,`bloqueado`),
  KEY `fk_global_cobrador_cobrador` (`idcobrador`),
  CONSTRAINT `fk_global_cobrador_cobrador` FOREIGN KEY (`idcobrador`) REFERENCES `cobradores` (`idcobrador`) ON DELETE CASCADE,
  CONSTRAINT `fk_global_cobrador_vma` FOREIGN KEY (`vma`) REFERENCES `global_administradores` (`vma`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Relación entre administradores y cobradores';

-- Tabla: global_clientes - Relación cobradores con clientes
CREATE TABLE `global_clientes` (
  `vcc` varchar(25) NOT NULL,
  `vac` varchar(25) NOT NULL,
  `idcliente` varchar(25) NOT NULL,
  `prestamos_vigentes` int(11) NOT NULL DEFAULT 0,
  `prestamos_pagados` int(11) NOT NULL DEFAULT 0,
  `dias_de_atraso` int(11) NOT NULL DEFAULT 0,
  `orden` int(11) NOT NULL DEFAULT 0,
  `creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `limite_prestamo` decimal(15,2) NOT NULL DEFAULT 0.00,
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vcc`),
  UNIQUE KEY `uq_vac_cliente` (`vac`,`idcliente`),
  KEY `idx_global_cliente_composite` (`vcc`,`vac`,`idcliente`),
  KEY `fk_global_cliente_cliente` (`idcliente`),
  CONSTRAINT `fk_global_cliente_cliente` FOREIGN KEY (`idcliente`) REFERENCES `clientes` (`idcliente`) ON DELETE CASCADE,
  CONSTRAINT `fk_global_cliente_vac` FOREIGN KEY (`vac`) REFERENCES `global_cobradores` (`vac`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Relación entre cobradores y clientes';

-- Tabla: global_monedas - Configuración de monedas por cobrador
CREATE TABLE `global_monedas` (
  `vac` varchar(25) NOT NULL,
  `idmoneda` varchar(25) NOT NULL,
  `numero_cuotas` varchar(200) NOT NULL DEFAULT '',
  `interes` varchar(200) NOT NULL DEFAULT '',
  `limite_prestamo` decimal(15,2) NOT NULL DEFAULT 0.00,
  `microcredito` decimal(5,2) NOT NULL DEFAULT 1.00,
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vac`,`idmoneda`),
  KEY `idx_global_moneda_composite` (`vac`,`idmoneda`),
  KEY `fk_global_moneda_moneda` (`idmoneda`),
  CONSTRAINT `fk_global_moneda_moneda` FOREIGN KEY (`idmoneda`) REFERENCES `monedas` (`idmoneda`) ON DELETE CASCADE,
  CONSTRAINT `fk_global_moneda_vac` FOREIGN KEY (`vac`) REFERENCES `global_cobradores` (`vac`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Configuración de monedas por cobrador';

-- ============================================
-- SECCIÓN 3: TABLAS DE PRÉSTAMOS
-- ============================================

-- Tabla: prestamos - Préstamos activos del sistema
CREATE TABLE `prestamos` (
  `idprestamo` varchar(25) NOT NULL,
  `vcc` varchar(25) NOT NULL,
  `idmoneda` varchar(25) NOT NULL,
  `monto_prestado` decimal(15,2) NOT NULL DEFAULT 0.00,
  `microcredito` decimal(5,2) NOT NULL DEFAULT 0.00,
  `interes` double NOT NULL DEFAULT 0,
  `numero_cuotas` int(11) NOT NULL DEFAULT 1,
  `intervalo_de_tiempo` enum('1','7','15','28') NOT NULL DEFAULT '1',
  `total_con_interes` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_a_cobrar` decimal(15,2) NOT NULL DEFAULT 0.00,
  `dias_de_atraso` int(11) NOT NULL DEFAULT 0,
  `cuotas_pagadas` int(11) NOT NULL DEFAULT 0,
  `total_cuotas` decimal(15,2) NOT NULL DEFAULT 0.00,
  `abonos_realizados` int(11) NOT NULL DEFAULT 0,
  `total_abonos` decimal(15,2) NOT NULL DEFAULT 0.00,
  `abonos_vs_cuotas` int(11) NOT NULL DEFAULT 0,
  `pagos_hoy` int(11) NOT NULL DEFAULT 0,
  `total_cancelado` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_interes` decimal(15,2) NOT NULL DEFAULT 0.00,
  `monto_diario` decimal(15,2) NOT NULL DEFAULT 0.00,
  `monto_pagado` decimal(15,2) NOT NULL DEFAULT 0.00,
  `metodo_pago` enum('Efectivo','Transferencia') DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_limite` date NOT NULL,
  `siguiente_visita` date NOT NULL,
  `fecha_tope_desc` date NOT NULL,
  `observaciones` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `latitud` double NOT NULL DEFAULT 0,
  `longitud` double NOT NULL DEFAULT 0,
  `creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `finalizado` datetime DEFAULT NULL,
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idprestamo`),
  KEY `idx_prestamo_composite` (`idprestamo`,`vcc`,`idmoneda`,`fecha_inicio`,`fecha_limite`,`siguiente_visita`),
  KEY `fk_prestamo_vcc` (`vcc`),
  KEY `fk_prestamo_moneda` (`idmoneda`),
  CONSTRAINT `fk_prestamo_moneda` FOREIGN KEY (`idmoneda`) REFERENCES `monedas` (`idmoneda`),
  CONSTRAINT `fk_prestamo_vcc` FOREIGN KEY (`vcc`) REFERENCES `global_clientes` (`vcc`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Préstamos activos en el sistema';

-- Tabla: prestamos_temporales - Préstamos en proceso de creación
CREATE TABLE `prestamos_temporales` (
  `idprestamo` varchar(25) NOT NULL,
  `vcc` varchar(25) NOT NULL,
  `idmoneda` varchar(25) NOT NULL,
  `monto_prestado` decimal(15,2) NOT NULL DEFAULT 0.00,
  `interes` double NOT NULL DEFAULT 0,
  `numero_cuotas` int(11) NOT NULL DEFAULT 1,
  `intervalo_de_tiempo` enum('1','7','15','28') NOT NULL DEFAULT '1',
  `total_con_interes` decimal(15,2) NOT NULL DEFAULT 0.00,
  `monto_diario` decimal(15,2) NOT NULL DEFAULT 0.00,
  `fecha_inicio` date NOT NULL,
  `fecha_limite` date NOT NULL,
  `observaciones` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `latitud` double NOT NULL DEFAULT 0,
  `longitud` double NOT NULL DEFAULT 0,
  `creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idprestamo`),
  KEY `idx_prestamo_temp_composite` (`idprestamo`,`vcc`,`idmoneda`,`fecha_inicio`,`fecha_limite`),
  KEY `fk_prestamo_temp_vcc` (`vcc`),
  KEY `fk_prestamo_temp_moneda` (`idmoneda`),
  CONSTRAINT `fk_prestamo_temp_moneda` FOREIGN KEY (`idmoneda`) REFERENCES `monedas` (`idmoneda`),
  CONSTRAINT `fk_prestamo_temp_vcc` FOREIGN KEY (`vcc`) REFERENCES `global_clientes` (`vcc`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Préstamos temporales en proceso de creación';

-- Tabla: prestamos_calendario - Calendario de pagos de préstamos
CREATE TABLE `prestamos_calendario` (
  `idprestamo` varchar(25) NOT NULL,
  `fecha` date NOT NULL,
  `atrasado` tinyint(1) NOT NULL DEFAULT 0,
  `bloqueado` tinyint(1) NOT NULL DEFAULT 0,
  `observaciones` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`idprestamo`,`fecha`),
  KEY `idx_calendario_composite` (`idprestamo`,`fecha`),
  CONSTRAINT `fk_calendario_prestamo` FOREIGN KEY (`idprestamo`) REFERENCES `prestamos` (`idprestamo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Calendario de fechas de pago de préstamos';

-- Tabla: prestamos_cuotas - Cuotas pagadas de los préstamos
CREATE TABLE `prestamos_cuotas` (
  `idcuota` int(11) NOT NULL AUTO_INCREMENT,
  `idprestamo` varchar(25) NOT NULL,
  `monto` decimal(15,2) NOT NULL DEFAULT 0.00,
  `interes` decimal(15,2) NOT NULL DEFAULT 0.00,
  `metodo_pago` enum('Efectivo','Transferencia') NOT NULL DEFAULT 'Efectivo',
  `latitud` double NOT NULL DEFAULT 0,
  `longitud` double NOT NULL DEFAULT 0,
  `fecha_pago` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `observaciones` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`idcuota`),
  KEY `idx_cuotas_composite` (`idcuota`,`idprestamo`,`fecha_pago`),
  KEY `fk_cuotas_prestamo` (`idprestamo`),
  CONSTRAINT `fk_cuotas_prestamo` FOREIGN KEY (`idprestamo`) REFERENCES `prestamos` (`idprestamo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Cuotas pagadas de los préstamos';

-- Tabla: prestamos_abonos - Abonos adicionales a los préstamos
CREATE TABLE `prestamos_abonos` (
  `idabono` int(11) NOT NULL AUTO_INCREMENT,
  `idprestamo` varchar(25) NOT NULL,
  `monto` decimal(15,2) NOT NULL DEFAULT 0.00,
  `interes` decimal(15,2) NOT NULL DEFAULT 0.00,
  `metodo_pago` enum('Efectivo','Transferencia') NOT NULL DEFAULT 'Efectivo',
  `latitud` double NOT NULL DEFAULT 0,
  `longitud` double NOT NULL DEFAULT 0,
  `fecha_pago` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `observaciones` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`idabono`),
  KEY `idx_abonos_composite` (`idabono`,`idprestamo`,`fecha_pago`),
  KEY `fk_abonos_prestamo` (`idprestamo`),
  CONSTRAINT `fk_abonos_prestamo` FOREIGN KEY (`idprestamo`) REFERENCES `prestamos` (`idprestamo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Abonos adicionales realizados a los préstamos';

-- Tabla: prestamos_dia_de_visita - Registro de visitas diarias a clientes
CREATE TABLE `prestamos_dia_de_visita` (
  `idprestamo` varchar(25) NOT NULL,
  `vcc` varchar(25) NOT NULL,
  `fecha_visita` date NOT NULL,
  `hora_visita` time DEFAULT NULL,
  `visitado` tinyint(1) NOT NULL DEFAULT 0,
  `numero_cuotas` int(11) NOT NULL DEFAULT 0,
  `monto_cuotas` decimal(15,2) NOT NULL DEFAULT 0.00,
  `numero_abonos` int(11) NOT NULL DEFAULT 0,
  `monto_abonos` decimal(15,2) NOT NULL DEFAULT 0.00,
  `es_nuevo` tinyint(1) NOT NULL DEFAULT 0,
  `observaciones` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idprestamo`,`fecha_visita`),
  KEY `idx_visita_composite` (`vcc`,`idprestamo`,`fecha_visita`,`visitado`),
  CONSTRAINT `fk_visita_prestamo` FOREIGN KEY (`idprestamo`) REFERENCES `prestamos` (`idprestamo`) ON DELETE CASCADE,
  CONSTRAINT `fk_visita_vcc` FOREIGN KEY (`vcc`) REFERENCES `global_clientes` (`vcc`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registro de visitas diarias a clientes para cobros';

-- ============================================
-- SECCIÓN 4: TABLAS DE REPORTES Y BITÁCORA
-- ============================================

-- Tabla: reportes_cobradores - Reportes históricos de cobradores
CREATE TABLE `reportes_cobradores` (
  `vac` varchar(25) NOT NULL,
  `fecha` date NOT NULL,
  `cobrado_efectivo` decimal(15,2) NOT NULL DEFAULT 0.00,
  `cobrado_transferencia` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_cobrado` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_interes` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_prestado` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_microcredito` decimal(15,2) NOT NULL DEFAULT 0.00,
  `cuentas_nuevas` int(11) NOT NULL DEFAULT 0,
  `cuentas_terminadas` int(11) NOT NULL DEFAULT 0,
  `caja_anterior` decimal(15,2) NOT NULL DEFAULT 0.00,
  `caja_actual` decimal(15,2) NOT NULL DEFAULT 0.00,
  `efectivo_dia` decimal(15,2) NOT NULL DEFAULT 0.00,
  `suma_cartera` decimal(15,2) NOT NULL DEFAULT 0.00,
  `gastos` decimal(15,2) NOT NULL DEFAULT 0.00,
  `base_dia` decimal(15,2) NOT NULL DEFAULT 0.00,
  `capital` decimal(15,2) NOT NULL DEFAULT 0.00,
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vac`,`fecha`),
  KEY `idx_reporte_cobrador_composite` (`vac`,`fecha`),
  CONSTRAINT `fk_reporte_cobrador_vac` FOREIGN KEY (`vac`) REFERENCES `global_cobradores` (`vac`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Reportes históricos de cobradores';

-- Tabla: reportes_cobradores_online - Reportes en tiempo real de cobradores
CREATE TABLE `reportes_cobradores_online` (
  `vac` varchar(25) NOT NULL,
  `fecha` date NOT NULL,
  `estimado_a_cobrar` decimal(15,2) NOT NULL DEFAULT 0.00,
  `cobrado_efectivo` decimal(15,2) NOT NULL DEFAULT 0.00,
  `cobrado_transferencia` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_cobrado` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_interes` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_prestado` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_microcredito` decimal(15,2) NOT NULL DEFAULT 0.00,
  `cuentas_nuevas` int(11) NOT NULL DEFAULT 0,
  `cuentas_terminadas` int(11) NOT NULL DEFAULT 0,
  `caja_anterior` decimal(15,2) NOT NULL DEFAULT 0.00,
  `caja_actual` decimal(15,2) NOT NULL DEFAULT 0.00,
  `efectivo_dia` decimal(15,2) NOT NULL DEFAULT 0.00,
  `suma_cartera` decimal(15,2) NOT NULL DEFAULT 0.00,
  `gastos` decimal(15,2) NOT NULL DEFAULT 0.00,
  `base_dia` decimal(15,2) NOT NULL DEFAULT 0.00,
  `capital` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_clientes` int(11) NOT NULL DEFAULT 0,
  `total_clientes_cobrados` int(11) NOT NULL DEFAULT 0,
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vac`,`fecha`),
  KEY `idx_reporte_online_composite` (`vac`,`fecha`),
  CONSTRAINT `fk_reporte_online_vac` FOREIGN KEY (`vac`) REFERENCES `global_cobradores` (`vac`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Reportes en tiempo real de cobradores';

-- Tabla: bitacora - Bitácora de operaciones del sistema
CREATE TABLE `bitacora` (
  `idbitacora` int(11) NOT NULL AUTO_INCREMENT,
  `vac` varchar(25) NOT NULL,
  `vcc` varchar(25) DEFAULT NULL,
  `idprestamo` varchar(25) DEFAULT NULL,
  `monto` decimal(15,2) NOT NULL DEFAULT 0.00,
  `deuda` decimal(15,2) NOT NULL DEFAULT 0.00,
  `detalle` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idbitacora`),
  KEY `idx_bitacora_composite` (`idbitacora`,`vac`,`vcc`,`idprestamo`,`fecha_hora`),
  CONSTRAINT `fk_bitacora_vac` FOREIGN KEY (`vac`) REFERENCES `global_cobradores` (`vac`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bitácora de operaciones del sistema';

-- Tabla: gastos - Gastos registrados por cobradores
CREATE TABLE `gastos` (
  `idgasto` int(11) NOT NULL AUTO_INCREMENT,
  `vac` varchar(25) NOT NULL,
  `monto` decimal(15,2) NOT NULL DEFAULT 0.00,
  `observaciones` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idgasto`),
  KEY `idx_gasto_composite` (`idgasto`,`vac`,`fecha_hora`),
  KEY `fk_gasto_vac` (`vac`),
  CONSTRAINT `fk_gasto_vac` FOREIGN KEY (`vac`) REFERENCES `global_cobradores` (`vac`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Gastos registrados por cobradores';

-- Tabla: inyeccion_base - Inyecciones de capital al sistema
CREATE TABLE `inyeccion_base` (
  `idinyeccion` int(11) NOT NULL AUTO_INCREMENT,
  `vac` varchar(25) NOT NULL,
  `monto` decimal(15,2) NOT NULL DEFAULT 0.00,
  `es_diario` tinyint(1) NOT NULL DEFAULT 0,
  `observaciones` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idinyeccion`),
  KEY `idx_inyeccion_composite` (`idinyeccion`,`vac`,`fecha_hora`),
  KEY `fk_inyeccion_vac` (`vac`),
  CONSTRAINT `fk_inyeccion_vac` FOREIGN KEY (`vac`) REFERENCES `global_cobradores` (`vac`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Inyecciones de capital al sistema';

-- ============================================
-- SECCIÓN 5: TABLAS DE SOPORTE Y CONFIGURACIÓN
-- ============================================

-- Tabla: usuarios - Usuarios del sistema con credenciales
CREATE TABLE `usuarios` (
  `idusuario` varchar(25) NOT NULL,
  `usuario` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ididentificador` varchar(25) NOT NULL,
  `contrasena` blob NOT NULL,
  `nivel` enum('ma','ad','se','su','co') NOT NULL DEFAULT 'ma',
  `online` tinyint(1) NOT NULL DEFAULT 0,
  `ultima_conexion` datetime DEFAULT NULL,
  `desconectar` tinyint(1) NOT NULL DEFAULT 0,
  `es_predeterminado` tinyint(1) NOT NULL DEFAULT 0,
  `creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idusuario`),
  UNIQUE KEY `uq_usuario_identificador` (`usuario`,`ididentificador`),
  KEY `idx_usuario_composite` (`idusuario`,`usuario`,`ididentificador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Usuarios del sistema con credenciales de acceso';

-- Tabla: codes - Códigos de identificación únicos
CREATE TABLE `codes` (
  `ididentificador` varchar(25) NOT NULL,
  `destino` varchar(200) NOT NULL,
  PRIMARY KEY (`ididentificador`),
  KEY `idx_code_identificador` (`ididentificador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Códigos de identificación únicos para registros';

-- Tabla: chat_vinculos - Vinculaciones para chat entre usuarios
CREATE TABLE `chat_vinculos` (
  `idunico` varchar(25) NOT NULL,
  `idemisor` varchar(25) NOT NULL,
  `idreceptor` varchar(25) NOT NULL,
  `idglobal` varchar(25) NOT NULL,
  `creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idunico`),
  UNIQUE KEY `uq_chat_emisor_receptor` (`idemisor`,`idreceptor`),
  KEY `idx_chat_composite` (`idunico`,`idemisor`,`idreceptor`,`idglobal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Vinculaciones para sistema de chat entre usuarios';

-- Tabla: chat_mensajes - Mensajes del sistema de chat
CREATE TABLE `chat_mensajes` (
  `idmensaje` int(11) NOT NULL AUTO_INCREMENT,
  `idunico` varchar(25) NOT NULL,
  `idemisor` varchar(25) NOT NULL,
  `idreceptor` varchar(25) NOT NULL,
  `usuario` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mensaje` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `leido` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`idmensaje`),
  KEY `idx_mensaje_composite` (`idunico`,`idemisor`,`idreceptor`,`fecha_hora`,`leido`),
  CONSTRAINT `fk_mensaje_vinculo` FOREIGN KEY (`idunico`) REFERENCES `chat_vinculos` (`idunico`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Mensajes del sistema de chat entre usuarios';

-- Tabla: anexos - Anexos de clientes (lista blanca/negra)
CREATE TABLE `anexos` (
  `cedula` varchar(10) NOT NULL,
  `nombre` varchar(250) NOT NULL,
  `direccion` varchar(250) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `lista` enum('BLANCA','NEGRA') NOT NULL DEFAULT 'BLANCA',
  `archivos` varchar(2000) NOT NULL DEFAULT '',
  `es_fugado` tinyint(1) NOT NULL DEFAULT 0,
  `latitud` double NOT NULL DEFAULT 0,
  `longitud` double NOT NULL DEFAULT 0,
  `actualizado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Anexos de clientes (lista blanca y negra)';

-- Tabla: comentarios - Comentarios sobre clientes
CREATE TABLE `comentarios` (
  `idcomentario` int(11) NOT NULL AUTO_INCREMENT,
  `cedula` varchar(10) NOT NULL,
  `riesgo` int(11) NOT NULL DEFAULT 0,
  `observacion` varchar(250) NOT NULL DEFAULT '',
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idcomentario`),
  KEY `fk_comentario_anexo` (`cedula`),
  CONSTRAINT `fk_comentario_anexo` FOREIGN KEY (`cedula`) REFERENCES `anexos` (`cedula`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Comentarios sobre clientes y su riesgo';

-- Tabla: fechas_no_laborables - Fechas no laborables configuradas
CREATE TABLE `fechas_no_laborables` (
  `vma` varchar(25) NOT NULL,
  `mes` int(11) NOT NULL,
  `dia` int(11) NOT NULL,
  `dia_semana` int(11) NOT NULL COMMENT '1 domingo, 7 sabado',
  PRIMARY KEY (`vma`,`mes`,`dia`),
  KEY `idx_fecha_no_laboral_composite` (`vma`,`mes`,`dia`),
  CONSTRAINT `fk_fecha_no_laboral_vma` FOREIGN KEY (`vma`) REFERENCES `global_administradores` (`vma`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Fechas no laborables configuradas por administrador';

-- Tabla: imagenes_perfil - Imágenes de perfil de usuarios
CREATE TABLE `imagenes_perfil` (
  `idimagen` int(11) NOT NULL AUTO_INCREMENT,
  `ididentificador` varchar(25) NOT NULL,
  `nombre_archivo` varchar(50) NOT NULL,
  `es_principal` tinyint(1) NOT NULL DEFAULT 0,
  `creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idimagen`),
  KEY `idx_imagen_composite` (`idimagen`,`ididentificador`,`nombre_archivo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Imágenes de perfil de usuarios del sistema';

-- Tabla: data_temp - Tabla temporal para operaciones
CREATE TABLE `data_temp` (
  `idtemp` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` binary(36) NOT NULL,
  `c1` varchar(100) DEFAULT NULL,
  `c2` varchar(100) DEFAULT NULL,
  `c3` varchar(100) DEFAULT NULL,
  `c4` varchar(100) DEFAULT NULL,
  `c5` varchar(100) DEFAULT NULL,
  `c6` varchar(100) DEFAULT NULL,
  `c7` varchar(100) DEFAULT NULL,
  `c8` varchar(100) DEFAULT NULL,
  `c9` varchar(100) DEFAULT NULL,
  `c10` varchar(100) DEFAULT NULL,
  `creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idtemp`),
  KEY `idx_temp_uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabla temporal para operaciones complejas';

-- ============================================
-- SECCIÓN 6: FUNCIONES Y PROCEDIMIENTOS OPTIMIZADOS
-- ============================================

DELIMITER $$

-- Función: generar_id_unico - Genera un ID único para cualquier tabla
-- Parámetros:
--   - prefijo: Prefijo para el ID (ej: 'MAS', 'ADM', etc.)
--   - longitud_numero: Longitud del número aleatorio (por defecto 8)
-- Retorna: ID único (ej: 'MAS_12345678')
CREATE FUNCTION `generar_id_unico`(
    prefijo VARCHAR(10),
    longitud_numero INT
) 
RETURNS VARCHAR(25)
DETERMINISTIC
NO SQL
BEGIN
    DECLARE id_generado VARCHAR(25);
    DECLARE intentos INT DEFAULT 0;
    DECLARE existe INT DEFAULT 1;
    
    -- Establecer longitud por defecto
    IF longitud_numero IS NULL OR longitud_numero < 1 THEN
        SET longitud_numero = 8;
    END IF;
    
    -- Generar ID único que no exista en codes
    WHILE existe > 0 AND intentos < 100 DO
        -- Generar número aleatorio del largo especificado
        SET id_generado = CONCAT(prefijo, '_', 
            LPAD(FLOOR(RAND() * POW(10, longitud_numero)), longitud_numero, '0'));
        
        -- Verificar si ya existe
        SELECT COUNT(*) INTO existe 
        FROM `codes` 
        WHERE `ididentificador` = id_generado;
        
        SET intentos = intentos + 1;
    END WHILE;
    
    -- Si no se pudo generar en 100 intentos, usar timestamp
    IF existe > 0 THEN
        SET id_generado = CONCAT(prefijo, '_', 
            DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'));
    END IF;
    
    -- Registrar en tabla de control
    INSERT INTO `codes` (`ididentificador`, `destino`) 
    VALUES (id_generado, CONCAT('ID_', prefijo));
    
    RETURN id_generado;
END$$

-- Función: calcular_fecha_limite - Calcula fecha límite basada en parámetros
-- Parámetros:
--   - fecha_inicio: Fecha de inicio del préstamo
--   - numero_cuotas: Número de cuotas
--   - intervalo_dias: Intervalo entre cuotas en días
-- Retorna: Fecha límite calculada
CREATE FUNCTION `calcular_fecha_limite`(
    fecha_inicio DATE,
    numero_cuotas INT,
    intervalo_dias INT
) 
RETURNS DATE
DETERMINISTIC
NO SQL
BEGIN
    RETURN DATE_ADD(fecha_inicio, INTERVAL (numero_cuotas * intervalo_dias) DAY);
END$$

-- Función: calcular_total_con_interes - Calcula el total con interés
-- Parámetros:
--   - monto: Monto base
--   - interes_porcentaje: Porcentaje de interés
-- Retorna: Total con interés incluido
CREATE FUNCTION `calcular_total_con_interes`(
    monto DECIMAL(15,2),
    interes_porcentaje DOUBLE
) 
RETURNS DECIMAL(15,2)
DETERMINISTIC
NO SQL
BEGIN
    RETURN monto * (1 + (interes_porcentaje / 100));
END$$

-- Función: obtener_zona_horaria_usuario - Obtiene zona horaria de un usuario
-- Parámetros:
--   - id_usuario: ID del usuario
--   - nivel: Nivel del usuario (ma, ad, se, su, co, cl)
-- Retorna: Zona horaria del usuario
CREATE FUNCTION `obtener_zona_horaria_usuario`(
    id_usuario VARCHAR(25),
    nivel VARCHAR(2)
) 
RETURNS VARCHAR(10)
READS SQL DATA
BEGIN
    DECLARE zona_horaria VARCHAR(10) DEFAULT '-4.00';
    
    CASE nivel
        WHEN 'ma' THEN
            SELECT `zona_horaria` INTO zona_horaria 
            FROM `masters` WHERE `idmaster` = id_usuario;
        WHEN 'ad' THEN
            SELECT `zona_horaria` INTO zona_horaria 
            FROM `administradores` WHERE `idadministrador` = id_usuario;
        WHEN 'se' THEN
            SELECT `zona_horaria` INTO zona_horaria 
            FROM `secretarios` WHERE `idsecretario` = id_usuario;
        WHEN 'su' THEN
            SELECT `zona_horaria` INTO zona_horaria 
            FROM `supervisores` WHERE `idsupervisor` = id_usuario;
        WHEN 'co' THEN
            SELECT `zona_horaria` INTO zona_horaria 
            FROM `cobradores` WHERE `idcobrador` = id_usuario;
        WHEN 'cl' THEN
            SELECT `zona_horaria` INTO zona_horaria 
            FROM `clientes` WHERE `idcliente` = id_usuario;
    END CASE;
    
    RETURN COALESCE(zona_horaria, '-4.00');
END$$

-- Procedimiento: crear_usuario_sistema - Crea usuario del sistema con contraseña encriptada
-- Parámetros:
--   - id_identificador: ID del usuario en su tabla correspondiente
--   - nivel_usuario: Nivel del usuario (ma, ad, se, su, co)
--   - contrasena_plana: Contraseña en texto plano (opcional, por defecto '123456')
CREATE PROCEDURE `crear_usuario_sistema`(
    IN id_identificador VARCHAR(25),
    IN nivel_usuario ENUM('ma','ad','se','su','co'),
    IN contrasena_plana VARCHAR(100)
)
BEGIN
    DECLARE usuario_base VARCHAR(30);
    DECLARE usuario_final VARCHAR(30);
    DECLARE contador INT DEFAULT 0;
    DECLARE existe INT DEFAULT 1;
    
    -- Generar nombre de usuario base
    SET usuario_base = CONCAT(
        CASE nivel_usuario
            WHEN 'ma' THEN 'master'
            WHEN 'ad' THEN 'admin'
            WHEN 'se' THEN 'secret'
            WHEN 'su' THEN 'super'
            WHEN 'co' THEN 'cobrad'
        END,
        '_',
        SUBSTRING(id_identificador, 1, 6)
    );
    
    -- Generar usuario único
    WHILE existe > 0 AND contador < 100 DO
        SET usuario_final = CONCAT(usuario_base, IF(contador > 0, contador, ''));
        
        SELECT COUNT(*) INTO existe 
        FROM `usuarios` 
        WHERE `usuario` = usuario_final;
        
        SET contador = contador + 1;
    END WHILE;
    
    -- Si no se pudo generar único, usar timestamp
    IF existe > 0 THEN
        SET usuario_final = CONCAT(usuario_base, '_', UNIX_TIMESTAMP());
    END IF;
    
    -- Establecer contraseña por defecto si no se proporciona
    IF contrasena_plana IS NULL OR contrasena_plana = '' THEN
        SET contrasena_plana = '123456';
    END IF;
    
    -- Crear usuario
    INSERT INTO `usuarios` (
        `idusuario`,
        `usuario`,
        `ididentificador`,
        `contrasena`,
        `nivel`,
        `es_predeterminado`
    ) VALUES (
        generar_id_unico('USR', 8),
        usuario_final,
        id_identificador,
        AES_ENCRYPT(contrasena_plana, SHA2('clave_secreta_sistema', 256)),
        nivel_usuario,
        1
    );
END$$

-- Procedimiento: actualizar_contadores_globales - Actualiza contadores en cascada
-- Parámetros:
--   - tipo_operacion: 'INCREMENTAR' o 'DECREMENTAR'
--   - id_relacion: ID de la relación (vma, vac, etc.)
--   - campo_contador: Campo del contador a actualizar
--   - valor: Valor a sumar/restar (por defecto 1)
CREATE PROCEDURE `actualizar_contadores_globales`(
    IN tipo_operacion ENUM('INCREMENTAR', 'DECREMENTAR'),
    IN id_relacion VARCHAR(25),
    IN campo_contador VARCHAR(50),
    IN valor INT
)
BEGIN
    DECLARE v_valor_operacion INT;
    
    -- Establecer valor por defecto
    IF valor IS NULL OR valor < 1 THEN
        SET valor = 1;
    END IF;
    
    -- Determinar valor de operación
    IF tipo_operacion = 'DECREMENTAR' THEN
        SET v_valor_operacion = valor * -1;
    ELSE
        SET v_valor_operacion = valor;
    END IF;
    
    -- Actualizar contadores en masters (origen de todo)
    UPDATE `masters` AS m
    INNER JOIN `global_administradores` AS ga ON m.idmaster = ga.idmaster
    LEFT JOIN `global_cobradores` AS gc ON ga.vma = gc.vma
    LEFT JOIN `global_clientes` AS gcl ON gc.vac = gcl.vac
    SET 
        m.`contador_administradores` = m.`contador_administradores` + 
            IF(campo_contador = 'administradores', v_valor_operacion, 0),
        m.`contador_secretarios` = m.`contador_secretarios` + 
            IF(campo_contador = 'secretarios', v_valor_operacion, 0),
        m.`contador_supervisores` = m.`contador_supervisores` + 
            IF(campo_contador = 'supervisores', v_valor_operacion, 0),
        m.`contador_cobradores` = m.`contador_cobradores` + 
            IF(campo_contador = 'cobradores', v_valor_operacion, 0),
        m.`contador_clientes` = m.`contador_clientes` + 
            IF(campo_contador = 'clientes', v_valor_operacion, 0),
        m.`actualizado` = NOW()
    WHERE ga.vma = id_relacion 
       OR gc.vac = id_relacion
       OR gcl.vcc = id_relacion;
    
    -- Actualizar contadores en global_administradores
    UPDATE `global_administradores`
    SET 
        `contador_secretarios` = `contador_secretarios` + 
            IF(campo_contador = 'secretarios', v_valor_operacion, 0),
        `contador_supervisores` = `contador_supervisores` + 
            IF(campo_contador = 'supervisores', v_valor_operacion, 0),
        `contador_cobradores` = `contador_cobradores` + 
            IF(campo_contador = 'cobradores', v_valor_operacion, 0),
        `contador_clientes` = `contador_clientes` + 
            IF(campo_contador = 'clientes', v_valor_operacion, 0),
        `actualizado` = NOW()
    WHERE `vma` = id_relacion;
    
    -- Actualizar contadores en global_cobradores
    UPDATE `global_cobradores`
    SET 
        `contador_clientes` = `contador_clientes` + 
            IF(campo_contador = 'clientes', v_valor_operacion, 0),
        `prestamos_vigentes` = `prestamos_vigentes` + 
            IF(campo_contador = 'prestamos_vigentes', v_valor_operacion, 0),
        `prestamos_pagados` = `prestamos_pagados` + 
            IF(campo_contador = 'prestamos_pagados', v_valor_operacion, 0),
        `actualizado` = NOW()
    WHERE `vac` = id_relacion;
    
    -- Actualizar contadores en global_clientes
    UPDATE `global_clientes`
    SET 
        `prestamos_vigentes` = `prestamos_vigentes` + 
            IF(campo_contador = 'prestamos_vigentes', v_valor_operacion, 0),
        `prestamos_pagados` = `prestamos_pagados` + 
            IF(campo_contador = 'prestamos_pagados', v_valor_operacion, 0),
        `actualizado` = NOW()
    WHERE `vcc` = id_relacion;
END$$

-- Procedimiento: procesar_pago_prestamo - Procesa un pago (cuota o abono)
-- Parámetros:
--   - tipo_pago: 'CUOTA' o 'ABONO'
--   - id_prestamo: ID del préstamo
--   - monto: Monto del pago
--   - metodo_pago: 'Efectivo' o 'Transferencia'
--   - observaciones: Observaciones del pago
CREATE PROCEDURE `procesar_pago_prestamo`(
    IN tipo_pago ENUM('CUOTA', 'ABONO'),
    IN id_prestamo VARCHAR(25),
    IN monto DECIMAL(15,2),
    IN metodo_pago ENUM('Efectivo','Transferencia'),
    IN observaciones VARCHAR(250)
)
BEGIN
    DECLARE v_vac VARCHAR(25);
    DECLARE v_vcc VARCHAR(25);
    DECLARE v_interes DOUBLE;
    DECLARE v_interes_calculado DECIMAL(15,2);
    DECLARE v_fecha_actual DATETIME;
    
    -- Obtener datos del préstamo
    SELECT 
        gc.vac,
        p.vcc,
        p.interes,
        CONVERT_TZ(NOW(), '+00:00', CONCAT(c.zona_horaria, ':00'))
    INTO v_vac, v_vcc, v_interes, v_fecha_actual
    FROM `prestamos` AS p
    INNER JOIN `global_clientes` AS gcl ON p.vcc = gcl.vcc
    INNER JOIN `global_cobradores` AS gc ON gcl.vac = gc.vac
    INNER JOIN `cobradores` AS c ON gc.idcobrador = c.idcobrador
    WHERE p.idprestamo = id_prestamo;
    
    -- Calcular interés
    SET v_interes_calculado = ROUND((monto * v_interes) / (100 + v_interes), 2);
    
    -- Registrar pago según tipo
    IF tipo_pago = 'CUOTA' THEN
        -- Insertar cuota
        INSERT INTO `prestamos_cuotas` (
            `idprestamo`,
            `monto`,
            `interes`,
            `metodo_pago`,
            `observaciones`
        ) VALUES (
            id_prestamo,
            monto,
            v_interes_calculado,
            metodo_pago,
            observaciones
        );
        
        -- Actualizar préstamo
        UPDATE `prestamos`
        SET 
            `cuotas_pagadas` = `cuotas_pagadas` + 1,
            `total_cuotas` = `total_cuotas` + monto,
            `total_cancelado` = `total_cancelado` + monto,
            `total_interes` = `total_interes` + v_interes_calculado,
            `total_a_cobrar` = `total_a_cobrar` - monto,
            `metodo_pago` = metodo_pago,
            `actualizado` = NOW()
        WHERE `idprestamo` = id_prestamo;
        
    ELSE -- ABONO
        -- Insertar abono
        INSERT INTO `prestamos_abonos` (
            `idprestamo`,
            `monto`,
            `interes`,
            `metodo_pago`,
            `observaciones`
        ) VALUES (
            id_prestamo,
            monto,
            v_interes_calculado,
            metodo_pago,
            observaciones
        );
        
        -- Actualizar préstamo
        UPDATE `prestamos`
        SET 
            `abonos_realizados` = `abonos_realizados` + 1,
            `total_abonos` = `total_abonos` + monto,
            `total_cancelado` = `total_cancelado` + monto,
            `total_interes` = `total_interes` + v_interes_calculado,
            `total_a_cobrar` = `total_a_cobrar` - monto,
            `metodo_pago` = metodo_pago,
            `actualizado` = NOW()
        WHERE `idprestamo` = id_prestamo;
    END IF;
    
    -- Actualizar reportes
    UPDATE `reportes_cobradores_online` AS rco
    INNER JOIN `reportes_cobradores` AS rc ON rco.vac = rc.vac AND rco.fecha = rc.fecha
    SET 
        rco.`total_cobrado` = rco.`total_cobrado` + monto,
        rco.`total_interes` = rco.`total_interes` + v_interes_calculado,
        rco.`caja_actual` = rco.`caja_actual` + monto,
        rco.`capital` = rco.`capital` + monto,
        rco.`suma_cartera` = rco.`suma_cartera` - monto,
        rco.`actualizado` = NOW(),
        
        rc.`total_cobrado` = rc.`total_cobrado` + monto,
        rc.`total_interes` = rc.`total_interes` + v_interes_calculado,
        rc.`caja_actual` = rc.`caja_actual` + monto,
        rc.`capital` = rc.`capital` + monto,
        rc.`suma_cartera` = rc.`suma_cartera` - monto,
        rc.`actualizado` = NOW()
    WHERE rco.vac = v_vac AND rco.fecha = DATE(v_fecha_actual);
    
    -- Registrar visita si no existe
    INSERT IGNORE INTO `prestamos_dia_de_visita` (
        `idprestamo`,
        `vcc`,
        `fecha_visita`,
        `hora_visita`,
        `visitado`
    ) VALUES (
        id_prestamo,
        v_vcc,
        DATE(v_fecha_actual),
        TIME(v_fecha_actual),
        1
    ) ON DUPLICATE KEY UPDATE
        `visitado` = 1,
        `hora_visita` = TIME(v_fecha_actual),
        `actualizado` = NOW();
    
    -- Actualizar contadores de visita según tipo de pago
    IF tipo_pago = 'CUOTA' THEN
        UPDATE `prestamos_dia_de_visita`
        SET 
            `numero_cuotas` = `numero_cuotas` + 1,
            `monto_cuotas` = `monto_cuotas` + monto,
            `observaciones` = 'Pago de cuota',
            `actualizado` = NOW()
        WHERE `idprestamo` = id_prestamo 
          AND `fecha_visita` = DATE(v_fecha_actual);
    ELSE
        UPDATE `prestamos_dia_de_visita`
        SET 
            `numero_abonos` = `numero_abonos` + 1,
            `monto_abonos` = `monto_abonos` + monto,
            `observaciones` = 'Pago de abono',
            `actualizado` = NOW()
        WHERE `idprestamo` = id_prestamo 
          AND `fecha_visita` = DATE(v_fecha_actual);
    END IF;
    
    -- Registrar en bitácora
    INSERT INTO `bitacora` (
        `vac`,
        `vcc`,
        `idprestamo`,
        `monto`,
        `deuda`,
        `detalle`
    ) VALUES (
        v_vac,
        v_vcc,
        id_prestamo,
        monto,
        monto - v_interes_calculado,
        CONCAT('Pago de ', LOWER(tipo_pago), ' registrado')
    );
END$$

DELIMITER ;

-- ============================================
-- SECCIÓN 7: TRIGGERS OPTIMIZADOS
-- ============================================

DELIMITER $$

-- Trigger: antes_insertar_master - Genera ID y crea usuario
CREATE TRIGGER `antes_insertar_master` 
BEFORE INSERT ON `masters` 
FOR EACH ROW
BEGIN
    -- Generar ID único si no se proporciona
    IF NEW.idmaster IS NULL OR NEW.idmaster = '' THEN
        SET NEW.idmaster = generar_id_unico('MAS', 8);
    END IF;
    
    -- Generar cédula única si no se proporciona
    IF NEW.cedula IS NULL OR NEW.cedula = '' THEN
        SET NEW.cedula = generar_id_unico('CED', 10);
    END IF;
    
    -- Crear usuario del sistema
    CALL crear_usuario_sistema(NEW.idmaster, 'ma', NULL);
END$$

-- Trigger: antes_insertar_administrador - Genera ID y crea usuario
CREATE TRIGGER `antes_insertar_administrador` 
BEFORE INSERT ON `administradores` 
FOR EACH ROW
BEGIN
    -- Generar ID único si no se proporciona
    IF NEW.idadministrador IS NULL OR NEW.idadministrador = '' THEN
        SET NEW.idadministrador = generar_id_unico('ADM', 8);
    END IF;
    
    -- Crear usuario del sistema
    CALL crear_usuario_sistema(NEW.idadministrador, 'ad', NULL);
END$$

-- Trigger: antes_insertar_secretario - Genera ID y crea usuario
CREATE TRIGGER `antes_insertar_secretario` 
BEFORE INSERT ON `secretarios` 
FOR EACH ROW
BEGIN
    -- Generar ID único si no se proporciona
    IF NEW.idsecretario IS NULL OR NEW.idsecretario = '' THEN
        SET NEW.idsecretario = generar_id_unico('SEC', 8);
    END IF;
    
    -- Crear usuario del sistema
    CALL crear_usuario_sistema(NEW.idsecretario, 'se', NULL);
END$$

-- Trigger: antes_insertar_supervisor - Genera ID y crea usuario
CREATE TRIGGER `antes_insertar_supervisor` 
BEFORE INSERT ON `supervisores` 
FOR EACH ROW
BEGIN
    -- Generar ID único si no se proporciona
    IF NEW.idsupervisor IS NULL OR NEW.idsupervisor = '' THEN
        SET NEW.idsupervisor = generar_id_unico('SUP', 8);
    END IF;
    
    -- Crear usuario del sistema
    CALL crear_usuario_sistema(NEW.idsupervisor, 'su', NULL);
END$$

-- Trigger: antes_insertar_cobrador - Genera ID y crea usuario
CREATE TRIGGER `antes_insertar_cobrador` 
BEFORE INSERT ON `cobradores` 
FOR EACH ROW
BEGIN
    -- Generar ID único si no se proporciona
    IF NEW.idcobrador IS NULL OR NEW.idcobrador = '' THEN
        SET NEW.idcobrador = generar_id_unico('COB', 8);
    END IF;
    
    -- Crear usuario del sistema
    CALL crear_usuario_sistema(NEW.idcobrador, 'co', NULL);
END$$

-- Trigger: antes_insertar_cliente - Genera ID único
CREATE TRIGGER `antes_insertar_cliente` 
BEFORE INSERT ON `clientes` 
FOR EACH ROW
BEGIN
    -- Generar ID único si no se proporciona
    IF NEW.idcliente IS NULL OR NEW.idcliente = '' THEN
        SET NEW.idcliente = generar_id_unico('CLI', 8);
    END IF;
END$$

-- Trigger: antes_insertar_moneda - Genera ID único
CREATE TRIGGER `antes_insertar_moneda` 
BEFORE INSERT ON `monedas` 
FOR EACH ROW
BEGIN
    -- Generar ID único si no se proporciona
    IF NEW.idmoneda IS NULL OR NEW.idmoneda = '' THEN
        SET NEW.idmoneda = generar_id_unico('MON', 8);
    END IF;
END$$

-- Trigger: despues_insertar_global_administrador - Actualiza contadores
CREATE TRIGGER `despues_insertar_global_administrador` 
AFTER INSERT ON `global_administradores` 
FOR EACH ROW
BEGIN
    -- Actualizar contadores
    CALL actualizar_contadores_globales('INCREMENTAR', NEW.vma, 'administradores', 1);
    
    -- Insertar fechas no laborables por defecto
    INSERT INTO `fechas_no_laborables` (`vma`, `mes`, `dia`, `dia_semana`) VALUES
        (NEW.vma, 1, 1, -1),    -- Año Nuevo
        (NEW.vma, 12, 25, -1),  -- Navidad
        (NEW.vma, -1, -1, 1);   -- Todos los Domingos
END$$

-- Trigger: antes_eliminar_global_administrador - Actualiza contadores
CREATE TRIGGER `antes_eliminar_global_administrador` 
BEFORE DELETE ON `global_administradores` 
FOR EACH ROW
BEGIN
    -- Actualizar contadores
    CALL actualizar_contadores_globales('DECREMENTAR', OLD.vma, 'administradores', 1);
END$$

-- Trigger: despues_insertar_global_secretario - Actualiza contadores
CREATE TRIGGER `despues_insertar_global_secretario` 
AFTER INSERT ON `global_secretarios` 
FOR EACH ROW
BEGIN
    -- Actualizar contadores
    CALL actualizar_contadores_globales('INCREMENTAR', NEW.vma, 'secretarios', 1);
END$$

-- Trigger: antes_eliminar_global_secretario - Actualiza contadores
CREATE TRIGGER `antes_eliminar_global_secretario` 
BEFORE DELETE ON `global_secretarios` 
FOR EACH ROW
BEGIN
    -- Actualizar contadores
    CALL actualizar_contadores_globales('DECREMENTAR', OLD.vma, 'secretarios', 1);
END$$

-- Trigger: despues_insertar_global_supervisor - Actualiza contadores
CREATE TRIGGER `despues_insertar_global_supervisor` 
AFTER INSERT ON `global_supervisores` 
FOR EACH ROW
BEGIN
    -- Actualizar contadores
    CALL actualizar_contadores_globales('INCREMENTAR', NEW.vma, 'supervisores', 1);
END$$

-- Trigger: antes_eliminar_global_supervisor - Actualiza contadores
CREATE TRIGGER `antes_eliminar_global_supervisor` 
BEFORE DELETE ON `global_supervisores` 
FOR EACH ROW
BEGIN
    -- Actualizar contadores
    CALL actualizar_contadores_globales('DECREMENTAR', OLD.vma, 'supervisores', 1);
END$$

-- Trigger: despues_insertar_global_cobrador - Actualiza contadores y crea reportes
CREATE TRIGGER `despues_insertar_global_cobrador` 
AFTER INSERT ON `global_cobradores` 
FOR EACH ROW
BEGIN
    DECLARE v_fecha_local DATE;
    
    -- Actualizar contadores
    CALL actualizar_contadores_globales('INCREMENTAR', NEW.vma, 'cobradores', 1);
    
    -- Obtener fecha local del cobrador
    SET v_fecha_local = DATE(CONVERT_TZ(NOW(), '+00:00', 
        CONCAT((SELECT zona_horaria FROM cobradores WHERE idcobrador = NEW.idcobrador), ':00')));
    
    -- Crear reportes iniciales
    INSERT IGNORE INTO `reportes_cobradores_online` (`vac`, `fecha`) 
    VALUES (NEW.vac, v_fecha_local);
    
    INSERT IGNORE INTO `reportes_cobradores` (`vac`, `fecha`) 
    VALUES (NEW.vac, v_fecha_local);
END$$

-- Trigger: antes_eliminar_global_cobrador - Actualiza contadores
CREATE TRIGGER `antes_eliminar_global_cobrador` 
BEFORE DELETE ON `global_cobradores` 
FOR EACH ROW
BEGIN
    -- Actualizar contadores
    CALL actualizar_contadores_globales('DECREMENTAR', OLD.vma, 'cobradores', 1);
END$$

-- Trigger: despues_insertar_global_cliente - Actualiza contadores
CREATE TRIGGER `despues_insertar_global_cliente` 
AFTER INSERT ON `global_clientes` 
FOR EACH ROW
BEGIN
    -- Actualizar contadores
    CALL actualizar_contadores_globales('INCREMENTAR', NEW.vac, 'clientes', 1);
END$$

-- Trigger: antes_eliminar_global_cliente - Actualiza contadores
CREATE TRIGGER `antes_eliminar_global_cliente` 
BEFORE DELETE ON `global_clientes` 
FOR EACH ROW
BEGIN
    -- Actualizar contadores
    CALL actualizar_contadores_globales('DECREMENTAR', OLD.vac, 'clientes', 1);
END$$

-- Trigger: antes_insertar_prestamo - Calcula valores automáticos
CREATE TRIGGER `antes_insertar_prestamo` 
BEFORE INSERT ON `prestamos` 
FOR EACH ROW
BEGIN
    DECLARE v_vac VARCHAR(25);
    DECLARE v_microcredito DECIMAL(5,2);
    DECLARE v_intervalo_dias INT;
    DECLARE v_fecha_actual DATE;
    
    -- Obtener VAC y microcrédito
    SELECT gc.vac, COALESCE(gm.microcredito, 1.00)
    INTO v_vac, v_microcredito
    FROM `global_clientes` AS gcl
    INNER JOIN `global_cobradores` AS gc ON gcl.vac = gc.vac
    LEFT JOIN `global_monedas` AS gm ON gc.vac = gm.vac AND gm.idmoneda = NEW.idmoneda
    WHERE gcl.vcc = NEW.vcc;
    
    -- Obtener fecha actual según zona horaria del cobrador
    SELECT DATE(CONVERT_TZ(NOW(), '+00:00', CONCAT(c.zona_horaria, ':00')))
    INTO v_fecha_actual
    FROM `global_cobradores` AS gc
    INNER JOIN `cobradores` AS c ON gc.idcobrador = c.idcobrador
    WHERE gc.vac = v_vac;
    
    -- Convertir intervalo a días
    SET v_intervalo_dias = CAST(NEW.intervalo_de_tiempo AS UNSIGNED);
    
    -- Generar ID único si no se proporciona
    IF NEW.idprestamo IS NULL OR NEW.idprestamo = '' THEN
        SET NEW.idprestamo = generar_id_unico('PRE', 8);
    END IF;
    
    -- Establecer fechas si no se proporcionan
    IF NEW.fecha_inicio IS NULL THEN
        SET NEW.fecha_inicio = v_fecha_actual;
    END IF;
    
    IF NEW.fecha_limite IS NULL THEN
        SET NEW.fecha_limite = calcular_fecha_limite(
            NEW.fecha_inicio, 
            NEW.numero_cuotas, 
            v_intervalo_dias
        );
    END IF;
    
    IF NEW.siguiente_visita IS NULL THEN
        SET NEW.siguiente_visita = NEW.fecha_inicio;
    END IF;
    
    IF NEW.fecha_tope_desc IS NULL THEN
        SET NEW.fecha_tope_desc = NEW.siguiente_visita;
    END IF;
    
    -- Calcular valores
    SET NEW.total_con_interes = calcular_total_con_interes(NEW.monto_prestado, NEW.interes);
    SET NEW.total_a_cobrar = NEW.total_con_interes;
    SET NEW.monto_diario = NEW.total_con_interes / NEW.numero_cuotas;
    SET NEW.microcredito = (NEW.monto_prestado / 100) * v_microcredito;
END$$

-- Trigger: despues_insertar_prestamo - Actualiza contadores y crea calendario
CREATE TRIGGER `despues_insertar_prestamo` 
AFTER INSERT ON `prestamos` 
FOR EACH ROW
BEGIN
    DECLARE v_vac VARCHAR(25);
    DECLARE v_intervalo_dias INT;
    DECLARE v_contador INT DEFAULT 0;
    DECLARE v_fecha_cuota DATE;
    DECLARE v_fecha_actual DATE;
    
    -- Obtener VAC y fecha actual
    SELECT gc.vac, DATE(CONVERT_TZ(NOW(), '+00:00', CONCAT(c.zona_horaria, ':00')))
    INTO v_vac, v_fecha_actual
    FROM `global_clientes` AS gcl
    INNER JOIN `global_cobradores` AS gc ON gcl.vac = gc.vac
    INNER JOIN `cobradores` AS c ON gc.idcobrador = c.idcobrador
    WHERE gcl.vcc = NEW.vcc;
    
    -- Convertir intervalo a días
    SET v_intervalo_dias = CAST(NEW.intervalo_de_tiempo AS UNSIGNED);
    
    -- Crear calendario de pagos
    SET v_fecha_cuota = NEW.fecha_inicio;
    
    WHILE v_contador < NEW.numero_cuotas DO
        -- Avanzar fecha según intervalo
        SET v_fecha_cuota = DATE_ADD(v_fecha_cuota, INTERVAL v_intervalo_dias DAY);
        
        -- Insertar fecha en calendario (omitir domingos)
        IF DAYOFWEEK(v_fecha_cuota) != 1 THEN
            INSERT INTO `prestamos_calendario` (`idprestamo`, `fecha`)
            VALUES (NEW.idprestamo, v_fecha_cuota);
            SET v_contador = v_contador + 1;
        END IF;
    END WHILE;
    
    -- Actualizar contadores
    CALL actualizar_contadores_globales('INCREMENTAR', NEW.vcc, 'prestamos_vigentes', 1);
    CALL actualizar_contadores_globales('INCREMENTAR', v_vac, 'prestamos_vigentes', 1);
    
    -- Actualizar reportes
    UPDATE `reportes_cobradores_online` AS rco
    INNER JOIN `reportes_cobradores` AS rc ON rco.vac = rc.vac AND rco.fecha = rc.fecha
    SET 
        rco.`total_prestado` = rco.`total_prestado` + NEW.monto_prestado,
        rco.`caja_actual` = rco.`caja_actual` - NEW.monto_prestado,
        rco.`cuentas_nuevas` = rco.`cuentas_nuevas` + 1,
        rco.`suma_cartera` = rco.`suma_cartera` + NEW.total_con_interes,
        rco.`capital` = rco.`capital` - NEW.monto_prestado,
        rco.`total_microcredito` = rco.`total_microcredito` + NEW.microcredito,
        rco.`actualizado` = NOW(),
        
        rc.`total_prestado` = rc.`total_prestado` + NEW.monto_prestado,
        rc.`caja_actual` = rc.`caja_actual` - NEW.monto_prestado,
        rc.`cuentas_nuevas` = rc.`cuentas_nuevas` + 1,
        rc.`suma_cartera` = rc.`suma_cartera` + NEW.total_con_interes,
        rc.`capital` = rc.`capital` - NEW.monto_prestado,
        rc.`total_microcredito` = rc.`total_microcredito` + NEW.microcredito,
        rc.`actualizado` = NOW()
    WHERE rco.vac = v_vac AND rco.fecha = v_fecha_actual;
    
    -- Registrar visita inicial
    INSERT INTO `prestamos_dia_de_visita` (
        `idprestamo`,
        `vcc`,
        `fecha_visita`,
        `es_nuevo`,
        `observaciones`
    ) VALUES (
        NEW.idprestamo,
        NEW.vcc,
        v_fecha_actual,
        1,
        'Nuevo préstamo'
    );
END$$

-- Trigger: antes_actualizar_prestamo - Maneja lógica de pagos completos
CREATE TRIGGER `antes_actualizar_prestamo` 
BEFORE UPDATE ON `prestamos` 
FOR EACH ROW
BEGIN
    DECLARE v_vac VARCHAR(25);
    DECLARE v_esta_pagado BOOLEAN;
    DECLARE v_estaba_pagado BOOLEAN;
    
    -- Obtener VAC
    SELECT gc.vac INTO v_vac
    FROM `global_clientes` AS gcl
    INNER JOIN `global_cobradores` AS gc ON gcl.vac = gc.vac
    WHERE gcl.vcc = NEW.vcc;
    
    -- Determinar estado de pago
    SET v_esta_pagado = NEW.total_a_cobrar <= 0;
    SET v_estaba_pagado = OLD.total_a_cobrar <= 0;
    
    -- Si cambia el estado de pago completo
    IF v_esta_pagado != v_estaba_pagado THEN
        IF v_esta_pagado THEN
            -- Se pagó completamente
            CALL actualizar_contadores_globales('DECREMENTAR', NEW.vcc, 'prestamos_vigentes', 1);
            CALL actualizar_contadores_globales('INCREMENTAR', NEW.vcc, 'prestamos_pagados', 1);
            CALL actualizar_contadores_globales('DECREMENTAR', v_vac, 'prestamos_vigentes', 1);
            CALL actualizar_contadores_globales('INCREMENTAR', v_vac, 'prestamos_pagados', 1);
            
            SET NEW.finalizado = NOW();
        ELSE
            -- Se reactivó (reversión)
            CALL actualizar_contadores_globales('INCREMENTAR', NEW.vcc, 'prestamos_vigentes', 1);
            CALL actualizar_contadores_globales('DECREMENTAR', NEW.vcc, 'prestamos_pagados', 1);
            CALL actualizar_contadores_globales('INCREMENTAR', v_vac, 'prestamos_vigentes', 1);
            CALL actualizar_contadores_globales('DECREMENTAR', v_vac, 'prestamos_pagados', 1);
            
            SET NEW.finalizado = NULL;
        END IF;
    END IF;
    
    -- Resetear campos temporales después de procesar pago
    IF NEW.metodo_pago IS NOT NULL THEN
        SET NEW.metodo_pago = NULL;
    END IF;
END$$

-- Trigger: antes_eliminar_prestamo - Actualiza contadores y reportes
CREATE TRIGGER `antes_eliminar_prestamo` 
BEFORE DELETE ON `prestamos` 
FOR EACH ROW
BEGIN
    DECLARE v_vac VARCHAR(25);
    DECLARE v_fecha_actual DATE;
    DECLARE v_es_pagado BOOLEAN;
    
    -- Obtener datos necesarios
    SELECT 
        gc.vac,
        DATE(CONVERT_TZ(NOW(), '+00:00', CONCAT(c.zona_horaria, ':00'))),
        OLD.total_a_cobrar <= 0
    INTO v_vac, v_fecha_actual, v_es_pagado
    FROM `global_clientes` AS gcl
    INNER JOIN `global_cobradores` AS gc ON gcl.vac = gc.vac
    INNER JOIN `cobradores` AS c ON gc.idcobrador = c.idcobrador
    WHERE gcl.vcc = OLD.vcc;
    
    -- Actualizar contadores según estado
    IF NOT v_es_pagado THEN
        CALL actualizar_contadores_globales('DECREMENTAR', OLD.vcc, 'prestamos_vigentes', 1);
        CALL actualizar_contadores_globales('DECREMENTAR', v_vac, 'prestamos_vigentes', 1);
    ELSE
        CALL actualizar_contadores_globales('DECREMENTAR', OLD.vcc, 'prestamos_pagados', 1);
        CALL actualizar_contadores_globales('DECREMENTAR', v_vac, 'prestamos_pagados', 1);
    END IF;
    
    -- Revertir reportes solo si no estaba pagado
    IF NOT v_es_pagado THEN
        UPDATE `reportes_cobradores_online` AS rco
        INNER JOIN `reportes_cobradores` AS rc ON rco.vac = rc.vac AND rco.fecha = rc.fecha
        SET 
            rco.`total_prestado` = rco.`total_prestado` - OLD.monto_prestado,
            rco.`caja_actual` = rco.`caja_actual` + OLD.monto_prestado,
            rco.`cuentas_nuevas` = rco.`cuentas_nuevas` - 1,
            rco.`suma_cartera` = rco.`suma_cartera` - OLD.total_con_interes,
            rco.`capital` = rco.`capital` + OLD.monto_prestado,
            rco.`total_microcredito` = rco.`total_microcredito` - OLD.microcredito,
            rco.`actualizado` = NOW(),
            
            rc.`total_prestado` = rc.`total_prestado` - OLD.monto_prestado,
            rc.`caja_actual` = rc.`caja_actual` + OLD.monto_prestado,
            rc.`cuentas_nuevas` = rc.`cuentas_nuevas` - 1,
            rc.`suma_cartera` = rc.`suma_cartera` - OLD.total_con_interes,
            rc.`capital` = rc.`capital` + OLD.monto_prestado,
            rc.`total_microcredito` = rc.`total_microcredito` - OLD.microcredito,
            rc.`actualizado` = NOW()
        WHERE rco.vac = v_vac AND rco.fecha = v_fecha_actual;
    END IF;
    
    -- Registrar en bitácora
    INSERT INTO `bitacora` (
        `vac`,
        `vcc`,
        `idprestamo`,
        `monto`,
        `deuda`,
        `detalle`
    ) VALUES (
        v_vac,
        OLD.vcc,
        OLD.idprestamo,
        OLD.monto_prestado,
        OLD.total_a_cobrar,
        CONCAT('Préstamo eliminado. Estado: ', IF(v_es_pagado, 'Pagado', 'Pendiente'))
    );
END$$

-- Trigger: despues_insertar_gasto - Actualiza reportes
CREATE TRIGGER `despues_insertar_gasto` 
AFTER INSERT ON `gastos` 
FOR EACH ROW
BEGIN
    DECLARE v_fecha_local DATE;
    
    -- Obtener fecha local
    SET v_fecha_local = DATE(CONVERT_TZ(NOW(), '+00:00', 
        CONCAT((SELECT zona_horaria FROM cobradores c INNER JOIN global_cobradores gc ON c.idcobrador = gc.idcobrador WHERE gc.vac = NEW.vac), ':00')));
    
    -- Actualizar reportes (propagación hacia adelante)
    UPDATE `reportes_cobradores_online` AS rco
    INNER JOIN `reportes_cobradores` AS rc ON rco.vac = rc.vac AND rco.fecha = rc.fecha
    SET 
        rco.`gastos` = rco.`gastos` + NEW.monto,
        rco.`caja_actual` = rco.`caja_actual` - NEW.monto,
        rco.`capital` = rco.`capital` - NEW.monto,
        rco.`actualizado` = NOW(),
        
        rc.`gastos` = rc.`gastos` + NEW.monto,
        rc.`caja_actual` = rc.`caja_actual` - NEW.monto,
        rc.`capital` = rc.`capital` - NEW.monto,
        rc.`actualizado` = NOW()
    WHERE rco.vac = NEW.vac AND rco.fecha >= v_fecha_local;
END$$

-- Trigger: antes_eliminar_gasto - Revertir reportes
CREATE TRIGGER `antes_eliminar_gasto` 
BEFORE DELETE ON `gastos` 
FOR EACH ROW
BEGIN
    DECLARE v_fecha_local DATE;
    
    -- Obtener fecha local
    SET v_fecha_local = DATE(CONVERT_TZ(NOW(), '+00:00', 
        CONCAT((SELECT zona_horaria FROM cobradores c INNER JOIN global_cobradores gc ON c.idcobrador = gc.idcobrador WHERE gc.vac = OLD.vac), ':00')));
    
    -- Revertir reportes
    UPDATE `reportes_cobradores_online` AS rco
    INNER JOIN `reportes_cobradores` AS rc ON rco.vac = rc.vac AND rco.fecha = rc.fecha
    SET 
        rco.`gastos` = rco.`gastos` - OLD.monto,
        rco.`caja_actual` = rco.`caja_actual` + OLD.monto,
        rco.`capital` = rco.`capital` + OLD.monto,
        rco.`actualizado` = NOW(),
        
        rc.`gastos` = rc.`gastos` - OLD.monto,
        rc.`caja_actual` = rc.`caja_actual` + OLD.monto,
        rc.`capital` = rc.`capital` + OLD.monto,
        rc.`actualizado` = NOW()
    WHERE rco.vac = OLD.vac AND rco.fecha >= v_fecha_local;
    
    -- Registrar en bitácora
    INSERT INTO `bitacora` (
        `vac`,
        `monto`,
        `detalle`
    ) VALUES (
        OLD.vac,
        OLD.monto,
        'Gasto eliminado'
    );
END$$

-- Trigger: despues_insertar_inyeccion - Actualiza reportes
CREATE TRIGGER `despues_insertar_inyeccion` 
AFTER INSERT ON `inyeccion_base` 
FOR EACH ROW
BEGIN
    DECLARE v_fecha_local DATE;
    
    -- Obtener fecha local
    SET v_fecha_local = DATE(CONVERT_TZ(NOW(), '+00:00', 
        CONCAT((SELECT zona_horaria FROM cobradores c INNER JOIN global_cobradores gc ON c.idcobrador = gc.idcobrador WHERE gc.vac = NEW.vac), ':00')));
    
    -- Actualizar reportes
    UPDATE `reportes_cobradores_online` AS rco
    INNER JOIN `reportes_cobradores` AS rc ON rco.vac = rc.vac AND rco.fecha = rc.fecha
    SET 
        rco.`base_dia` = rco.`base_dia` + IF(NEW.es_diario, NEW.monto, 0),
        rco.`capital` = rco.`capital` + IF(NEW.es_diario, 0, NEW.monto),
        rco.`caja_actual` = rco.`caja_actual` + IF(NEW.es_diario, 0, NEW.monto),
        rco.`actualizado` = NOW(),
        
        rc.`base_dia` = rc.`base_dia` + IF(NEW.es_diario, NEW.monto, 0),
        rc.`capital` = rc.`capital` + IF(NEW.es_diario, 0, NEW.monto),
        rc.`caja_actual` = rc.`caja_actual` + IF(NEW.es_diario, 0, NEW.monto),
        rc.`actualizado` = NOW()
    WHERE rco.vac = NEW.vac AND rco.fecha >= v_fecha_local;
END$$

-- Trigger: antes_actualizar_reporte_online - Calcula efectivo_dia automáticamente
CREATE TRIGGER `antes_actualizar_reporte_online` 
BEFORE UPDATE ON `reportes_cobradores_online` 
FOR EACH ROW
BEGIN
    -- Calcular efectivo del día automáticamente
    SET NEW.efectivo_dia = (NEW.cobrado_efectivo + NEW.cobrado_transferencia + 
                           NEW.base_dia + NEW.total_microcredito) -
                          (NEW.gastos + NEW.total_prestado);
END$$

-- Trigger: antes_actualizar_reporte - Calcula efectivo_dia automáticamente
CREATE TRIGGER `antes_actualizar_reporte` 
BEFORE UPDATE ON `reportes_cobradores` 
FOR EACH ROW
BEGIN
    -- Calcular efectivo del día automáticamente
    SET NEW.efectivo_dia = (NEW.cobrado_efectivo + NEW.cobrado_transferencia + 
                           NEW.base_dia + NEW.total_microcredito) -
                          (NEW.gastos + NEW.total_prestado);
END$$

DELIMITER ;

-- ============================================
-- SECCIÓN 8: EVENTOS PROGRAMADOS
-- ============================================

DELIMITER $$

-- Evento: actualizar_reportes_diarios
-- Propósito: Actualizar contadores y reportes diariamente a media noche
CREATE EVENT IF NOT EXISTS `actualizar_reportes_diarios`
ON SCHEDULE EVERY 1 DAY
STARTS TIMESTAMP(CURRENT_DATE, '00:05:00')
ON COMPLETION PRESERVE
ENABLE
DO
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_vac VARCHAR(25);
    DECLARE v_fecha_ayer DATE;
    DECLARE v_fecha_hoy DATE;
    DECLARE cur_cobradores CURSOR FOR 
        SELECT `vac` FROM `global_cobradores` WHERE `bloqueado` = 0;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Obtener fechas
    SET v_fecha_ayer = DATE(DATE_ADD(NOW(), INTERVAL -1 DAY));
    SET v_fecha_hoy = DATE(NOW());
    
    OPEN cur_cobradores;
    
    procesar_cobradores: LOOP
        FETCH cur_cobradores INTO v_vac;
        IF done THEN
            LEAVE procesar_cobradores;
        END IF;
        
        -- 1. Actualizar caja_anterior con el caja_actual del día anterior
        UPDATE `reportes_cobradores_online` AS hoy
        INNER JOIN `reportes_cobradores_online` AS ayer ON ayer.vac = v_vac
        SET hoy.caja_anterior = ayer.caja_actual
        WHERE hoy.vac = v_vac 
          AND hoy.fecha = v_fecha_hoy
          AND ayer.fecha = v_fecha_ayer;
        
        UPDATE `reportes_cobradores` AS hoy
        INNER JOIN `reportes_cobradores` AS ayer ON ayer.vac = v_vac
        SET hoy.caja_anterior = ayer.caja_actual
        WHERE hoy.vac = v_vac 
          AND hoy.fecha = v_fecha_hoy
          AND ayer.fecha = v_fecha_ayer;
        
        -- 2. Crear registros para el nuevo día si no existen
        INSERT IGNORE INTO `reportes_cobradores_online` (`vac`, `fecha`)
        VALUES (v_vac, v_fecha_hoy);
        
        INSERT IGNORE INTO `reportes_cobradores` (`vac`, `fecha`)
        VALUES (v_vac, v_fecha_hoy);
        
        -- 3. Actualizar estimado_a_cobrar para el día actual
        UPDATE `reportes_cobradores_online` AS rco
        SET rco.estimado_a_cobrar = (
            SELECT COALESCE(SUM(p.monto_diario), 0)
            FROM `prestamos` AS p
            INNER JOIN `global_clientes` AS gc ON p.vcc = gc.vcc
            WHERE gc.vac = v_vac
              AND p.total_a_cobrar > 0
              AND p.siguiente_visita <= v_fecha_hoy
        )
        WHERE rco.vac = v_vac AND rco.fecha = v_fecha_hoy;
        
        -- 4. Actualizar total_clientes
        UPDATE `reportes_cobradores_online` AS rco
        SET rco.total_clientes = (
            SELECT COUNT(DISTINCT gc.vcc)
            FROM `global_clientes` AS gc
            INNER JOIN `prestamos` AS p ON gc.vcc = p.vcc
            WHERE gc.vac = v_vac
              AND p.total_a_cobrar > 0
        )
        WHERE rco.vac = v_vac AND rco.fecha = v_fecha_hoy;
        
    END LOOP procesar_cobradores;
    
    CLOSE cur_cobradores;
    
    -- 5. Resetear pagos_hoy de todos los préstamos
    UPDATE `prestamos`
    SET `pagos_hoy` = 0
    WHERE `pagos_hoy` > 0;
    
    -- 6. Actualizar días de atraso en calendario
    UPDATE `prestamos_calendario` AS pc
    INNER JOIN `prestamos` AS p ON pc.idprestamo = p.idprestamo
    SET pc.atrasado = 1,
        pc.observaciones = 'Atrasado'
    WHERE pc.fecha < CURDATE()
      AND pc.atrasado = 0
      AND pc.bloqueado = 0
      AND p.total_a_cobrar > 0;
    
END$$

DELIMITER ;

-- ============================================
-- SECCIÓN 9: INSERCIÓN DE DATOS INICIALES
-- ============================================

-- Insertar monedas predeterminadas
INSERT INTO `monedas` (`idmoneda`, `nombre`, `abreviatura`, `valor_cambiario`) VALUES
('MON001', 'Peso Dominicano', 'DOP', 1.00),
('MON002', 'Dólar Estadounidense', 'USD', 56.50);

-- Insertar un master inicial para pruebas (con cédula de 10 caracteres)
INSERT INTO `masters` (`idmaster`, `cedula`, `nombre`, `apellido`, `direccion`, `telefono`, `correo`) VALUES
('MASTER001', '0112345678', 'Administrador', 'Principal', 'Santo Domingo, RD', '809-555-0101', 'admin@brksoft.com');

-- ============================================
-- SECCIÓN 10: RESTAURAR CONFIGURACIONES
-- ============================================

-- Habilitar eventos
SET GLOBAL event_scheduler = ON;

-- Configurar para permitir funciones no determinísticas
SET GLOBAL log_bin_trust_function_creators = 1;

-- Restaurar modo SQL
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- Finalizar transacción
COMMIT;

-- ============================================
-- MENSAJE FINAL
-- ============================================

SELECT 'SCRIPT DE OPTIMIZACIÓN EJECUTADO CON ÉXITO' AS Mensaje;
SELECT CONCAT('Base de datos creada: ', DATABASE()) AS BaseDatos;
SELECT CONCAT('Fecha y hora: ', NOW()) AS FechaEjecucion;
SELECT 'Sistema optimizado y listo para integración con Node.js' AS Estado;