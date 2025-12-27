// src/controllers/dashboardController.js
const database = require('../config/database');

class DashboardController {
    async getModules(req, res) {
        try {
            const userId = req.userId;
            const userLevel = req.userLevel;
            
            console.log(`📊 Generando módulos para usuario ${userId} nivel ${userLevel}`);
            
            // Obtener módulos según el nivel del usuario
            const modules = this.getModulesByLevel(userLevel, userId);
            
            res.json({
                success: true,
                modules: modules
            });
            
        } catch (error) {
            console.error('❌ Error obteniendo módulos del dashboard:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener módulos del dashboard'
            });
        }
    }
    
    getModulesByLevel(level, userId) {
        const modules = [];
        
        switch(level) {
            case 'ma': // Master
                modules.push(
                    this.createModule('administradores', 'Lista Administradores', 
                        'Acceda rápidamente a la lista de todos los administradores vinculados a su Cuenta', 
                        'lupa', 'showadmin'),
                    this.createModule('monedas', 'Lista Monedas', 
                        'Verifique con solo 1 click las monedas creadas y disponibles en el sistema', 
                        'hand-card', 'showmoney')
                );
                break;
                
            case 'ad': // Administrador
                modules.push(
                    this.createModule('secretarios', 'Crear Nuevo Secretario', 
                        'Cree y vincule un nuevo Secretario', 
                        'plus', 'newsecre'),
                    this.createModule('supervisores', 'Crear Nuevo Supervisor', 
                        'Cree y vincule un nuevo Supervisor', 
                        'plus', 'newsuper'),
                    this.createModule('cobradores', 'Crear Nuevo Cobrador', 
                        'Cree y vincule un nuevo Cobrador', 
                        'plus', 'newcobra')
                );
                break;
                
            case 'se': // Secretario
                modules.push(
                    this.createModule('supervisores', 'Listado de Supervisores', 
                        'Consultar el listado de los Supervisores registrados en Nuestro Sistema', 
                        'user-list', 'showsuper'),
                    this.createModule('cobradores', 'Listado de Cobradores', 
                        'Consultar el listado de los Cobradores registrados en Nuestro Sistema', 
                        'user-list', 'showcobra')
                );
                break;
                
            case 'su': // Supervisor
                modules.push(
                    this.createModule('cobradores', 'Listado de Cobradores', 
                        'Consultar el listado de los Cobradores registrados en Nuestro Sistema', 
                        'user-list', 'showcobra')
                );
                break;
                
            case 'co': // Cobrador
                modules.push(
                    this.createModule('clientes', 'Crear Nuevo Cliente', 
                        'Cree y vincule un nuevo Cliente', 
                        'plus', 'newclien'),
                    this.createModule('prestamos', 'Asignar un Nuevo Préstamo', 
                        'Por este medio también podrás ir directamente ha asignar un préstamo al cliente seleccinado de tu lista.', 
                        'graphics', 'assignpresta'),
                    this.createModule('rutas', 'Clientes Pendientes', 
                        `Consulta la lista de los clientes pendientes por visitar el día de Hoy sin perdida de tiempo`, 
                        'user-list', 'showpendientes'),
                    this.createModule('liquidacion', 'Generador de Reporte', 
                        'Nada es mas facil y rápido que sabes el movimiento del Día con solo un click', 
                        'paid-checked', 'generarreport')
                );
                break;
                
            default:
                modules.push(
                    this.createModule('dashboard', 'Dashboard Principal', 
                        'Panel principal del sistema', 
                        'lupa', 'dashboard')
                );
        }
        
        return modules;
    }
    
    createModule(id, title, description, icon, action) {
        return {
            id,
            title,
            description,
            icon: `/assets/${icon}.svg`,
            action,
            link: `/${id}`
        };
    }
    
    async getStats(req, res) {
        try {
            const userId = req.userId;
            const userLevel = req.userLevel;
            
            let stats = {};
            
            // Estadísticas básicas según nivel
            switch(userLevel) {
                case 'ma':
                    stats = { totalAdmins: 0, totalCoins: 0, totalBalance: 0 };
                    break;
                case 'ad':
                    stats = { totalSecretaries: 0, totalSupervisors: 0, totalCollectors: 0 };
                    break;
                case 'se':
                    stats = { totalSupervisors: 0, totalCollectors: 0 };
                    break;
                case 'su':
                    stats = { totalCollectors: 0 };
                    break;
                case 'co':
                    stats = { pendingClients: 0 };
                    break;
            }
            
            res.json({
                success: true,
                stats: stats
            });
            
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener estadísticas'
            });
        }
    }
}

module.exports = new DashboardController();