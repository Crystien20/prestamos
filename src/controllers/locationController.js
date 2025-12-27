// src/controllers/locationController.js
const database = require('../config/database');

class LocationController {
    async updateLocation(req, res) {
        try {
            const { latitude, longitude } = req.body;
            const userId = req.userId;
            const userLevel = req.userLevel;
            const userIdentifier = req.userIdentifier;
            
            if (!latitude || !longitude) {
                return res.status(400).json({
                    success: false,
                    message: 'Latitud y longitud son requeridas'
                });
            }
            
            // Actualizar ubicación según el nivel del usuario
            await this.updateUserLocation(userLevel, userIdentifier, latitude, longitude);
            
            // Actualizar última actividad
            await this.updateLastActivity(userId);
            
            res.json({
                success: true,
                message: 'Ubicación actualizada correctamente'
            });
            
        } catch (error) {
            console.error('❌ Error actualizando ubicación:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar ubicación'
            });
        }
    }
    
    async updateUserLocation(level, identifier, latitude, longitude) {
        let table, idColumn;
        
        switch(level) {
            case 'ma':
                table = 'masters';
                idColumn = 'idmaster';
                break;
            case 'ad':
                table = 'administradores';
                idColumn = 'idadministrador';
                break;
            case 'se':
                table = 'secretarios';
                idColumn = 'idsecretario';
                break;
            case 'su':
                table = 'supervisores';
                idColumn = 'idsupervisor';
                break;
            case 'co':
                table = 'cobradores';
                idColumn = 'idcobrador';
                break;
            default:
                throw new Error('Nivel de usuario no válido');
        }
        
        const sql = `
            UPDATE ${table} 
            SET latitud = ?, longitud = ?, actualizado = NOW() 
            WHERE ${idColumn} = ?
        `;
        
        await database.query(sql, [latitude, longitude, identifier]);
    }
    
    async updateLastActivity(userId) {
        const sql = `UPDATE usuarios SET ultima_conexion = NOW() WHERE idusuario = ?`;
        await database.query(sql, [userId]);
    }
    
    async getCollectorLocations(req, res) {
        try {
            const supervisorId = req.userIdentifier;
            const userLevel = req.userLevel;
            
            let locations = [];
            
            if (userLevel === 'su') {
                // Obtener ubicaciones de los cobradores del supervisor
                locations = await this.getCollectorsBySupervisor(supervisorId);
            } else if (userLevel === 'ad') {
                // Obtener todas las ubicaciones (admin ve todo)
                locations = await this.getAllCollectorLocations();
            }
            
            res.json({
                success: true,
                locations: locations
            });
            
        } catch (error) {
            console.error('❌ Error obteniendo ubicaciones:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener ubicaciones'
            });
        }
    }
    
    async getCollectorsBySupervisor(supervisorId) {
        try {
            const sql = `
                SELECT 
                    c.idcobrador as id,
                    c.nombre,
                    c.telefono,
                    c.latitud,
                    c.longitud,
                    c.actualizado,
                    COUNT(gc.vcc) as total_clientes
                FROM cobradores c
                LEFT JOIN global_cobradores gc ON c.idcobrador = gc.idcobrador
                LEFT JOIN global_supervisores gs ON gc.vma = gs.vma
                WHERE gs.idsupervisor = ? 
                AND c.desconectar = 0
                GROUP BY c.idcobrador
            `;
            
            const results = await database.query(sql, [supervisorId]);
            return results;
            
        } catch (error) {
            console.error('Error obteniendo cobradores por supervisor:', error);
            return [];
        }
    }
    
    async getAllCollectorLocations() {
        try {
            const sql = `
                SELECT 
                    c.idcobrador as id,
                    c.nombre,
                    c.telefono,
                    c.latitud,
                    c.longitud,
                    c.actualizado,
                    a.nombre as administrador,
                    COUNT(gc.vcc) as total_clientes
                FROM cobradores c
                LEFT JOIN administradores a ON c.idadministrador = a.idadministrador
                LEFT JOIN global_cobradores gc ON c.idcobrador = gc.idcobrador
                WHERE c.desconectar = 0
                GROUP BY c.idcobrador
            `;
            
            const results = await database.query(sql);
            return results;
            
        } catch (error) {
            console.error('Error obteniendo todas las ubicaciones:', error);
            return [];
        }
    }
    
    async getClientLocations(req, res) {
        try {
            const collectorId = req.userIdentifier;
            const userLevel = req.userLevel;
            
            let clients = [];
            
            if (userLevel === 'co') {
                // Cobrador ve sus clientes
                clients = await this.getClientsByCollector(collectorId);
            } else if (userLevel === 'su') {
                // Supervisor ve clientes de sus cobradores
                clients = await this.getClientsBySupervisor(collectorId);
            } else if (userLevel === 'ad') {
                // Admin ve todos los clientes
                clients = await this.getAllClientLocations();
            }
            
            res.json({
                success: true,
                clients: clients
            });
            
        } catch (error) {
            console.error('❌ Error obteniendo ubicaciones de clientes:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener ubicaciones de clientes'
            });
        }
    }
    
    async getClientsByCollector(collectorId) {
        try {
            const sql = `
                SELECT 
                    gc.vcc as id,
                    gc.nombre,
                    gc.telefono,
                    gc.direccion,
                    gc.latitud,
                    gc.longitud,
                    gc.estado,
                    gc.lista,
                    (SELECT COUNT(*) FROM prestamos p WHERE p.vcc = gc.vcc AND p.estado = 'activo') as prestamos_activos
                FROM global_clientes gc
                WHERE gc.vac = ?
                AND gc.estado IN ('activo', 'pendiente')
                ORDER BY gc.nombre
            `;
            
            const results = await database.query(sql, [collectorId]);
            return results;
            
        } catch (error) {
            console.error('Error obteniendo clientes por cobrador:', error);
            return [];
        }
    }
}

module.exports = new LocationController();