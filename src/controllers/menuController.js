// src/controllers/menuController.js
const database = require('../config/database');

class MenuController {
    async getMenu(req, res) {
        try {
            const userId = req.userId;
            const userLevel = req.userLevel;
            
            console.log(`📋 Generando menú para usuario ${userId} nivel ${userLevel}`);
            
            // Obtener menú según nivel
            const menu = this.buildMenuByLevel(userLevel, userId);
            
            res.json({
                success: true,
                menu: menu
            });
            
        } catch (error) {
            console.error('❌ Error obteniendo menú:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener menú'
            });
        }
    }
    
    buildMenuByLevel(level, userId) {
        const menu = [];
        
        switch(level) {
            case 'ma': // Master
                menu.push(
                    this.createMenuItem('administradores', 'Administradores', [
                        { text: 'Listar', action: 'showadmin' },
                        { text: 'Crear Nuevo', action: 'newadmin' }
                    ]),
                    this.createMenuItem('monedas', 'Monedas', [
                        { text: 'Listar', action: 'showmoney' },
                        { text: 'Crear', action: 'newmoney' }
                    ])
                );
                break;
                
            case 'ad': // Administrador
                menu.push(
                    this.createMenuItem('secretarios', 'Secretarios', [
                        { text: 'Listar', action: 'showsecre' },
                        { text: 'Crear Nuevo', action: 'newsecre' }
                    ]),
                    this.createMenuItem('supervisores', 'Supervisores', [
                        { text: 'Listar', action: 'showsuper' },
                        { text: 'Crear Nuevo', action: 'newsuper' }
                    ]),
                    this.createMenuItem('cobradores', 'Cobradores', [
                        { text: 'Listar', action: 'showcobra' },
                        { text: 'Crear Nuevo', action: 'newcobra' }
                    ])
                );
                break;
                
            case 'se': // Secretario
                menu.push(
                    this.createMenuItem('supervisores', 'Supervisores', [
                        { text: 'Listar', action: 'showsuper' }
                    ]),
                    this.createMenuItem('cobradores', 'Cobradores', [
                        { text: 'Listar', action: 'showcobra' }
                    ])
                );
                break;
                
            case 'su': // Supervisor
                menu.push(
                    this.createMenuItem('cobradores', 'Cobradores', [
                        { text: 'Listar', action: 'showcobra' }
                    ])
                );
                break;
                
            case 'co': // Cobrador
                menu.push(
                    this.createMenuItem('clientes', 'Clientes', [
                        { text: 'Lista Blanca', action: 'blanca' },
                        { text: 'Lista Negra', action: 'negra' },
                        { text: 'Crear Nuevo', action: 'newclien' }
                    ]),
                    this.createMenuItem('rutas', 'Rutas', [
                        { text: 'Clientes Pendientes', action: 'showpendientes' }
                    ]),
                    this.createMenuItem('liquidacion', 'Liquidación', [
                        { text: 'Reporte del Día', action: 'generarreport' }
                    ])
                );
                break;
                
            default:
                menu.push(
                    this.createMenuItem('dashboard', 'Dashboard', [
                        { text: 'Principal', action: 'dashboard' }
                    ])
                );
        }
        
        return menu;
    }
    
    createMenuItem(id, text, subitems) {
        return {
            id,
            text,
            subitems: subitems.map(item => ({
                text: item.text,
                action: item.action
            }))
        };
    }
}

module.exports = new MenuController();