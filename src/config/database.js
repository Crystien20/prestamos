// src/config/database.js
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'brksoft_brksoftware',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Nataly.1003*',
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 100,
    charset: 'utf8mb4',
    timezone: 'local',
    connectTimeout: 10000,
    dateStrings: true,
    supportBigNumbers: true,
    bigNumberStrings: false,
    multipleStatements: false,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
};

class Database {
    constructor() {
        this.pool = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            console.log('🔌 Conectando a MySQL...');
            this.pool = mysql.createPool(dbConfig);
            
            const connection = await this.pool.getConnection();
            const [rows] = await connection.execute('SELECT 1 as `connected`, NOW() as `time`, DATABASE() as `database`');
            console.log('✅ Base de datos conectada:', {
                database: rows[0].database,
                time: rows[0].time,
                host: dbConfig.host,
                port: dbConfig.port
            });
            
            connection.release();
            this.isConnected = true;
            return true;
            
        } catch (error) {
            console.error('❌ ERROR DE CONEXIÓN A MYSQL:', error.message);
            console.error('🔧 Configuración:', {
                host: dbConfig.host,
                port: dbConfig.port,
                database: dbConfig.database,
                user: dbConfig.user
            });
            throw error;
        }
    }

    async query(sql, params = []) {
        if (!this.isConnected) {
            throw new Error('Base de datos no conectada');
        }

        let connection;
        try {
            connection = await this.pool.getConnection();
            const [rows] = await connection.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('❌ ERROR EN CONSULTA SQL:', {
                error: error.message,
                sql: sql.substring(0, 200),
                params: params,
                code: error.code,
                errno: error.errno
            });
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    async getUserByCredentials(username, password) {
        try {
            const sql = `
                SELECT 
                    u.idusuario,
                    u.usuario,
                    u.nivel,
                    u.ididentificador,
                    u.desconectar,
                    u.usuario as nombre_completo
                FROM usuarios u
                WHERE u.usuario = ? 
                AND u.contrasena = AES_ENCRYPT(?, SHA2('clave_secreta_sistema', 256))
                AND u.desconectar = 0
                LIMIT 1
            `;
            
            console.log('🔍 Autenticando usuario:', username);
            const users = await this.query(sql, [username, password]);
            
            if (users.length === 0) {
                console.log('❌ Credenciales inválidas para:', username);
                // Delay de seguridad
                await new Promise(resolve => setTimeout(resolve, 500));
                return null;
            }
            
            console.log('✅ Usuario autenticado:', users[0].usuario);
            return users[0];
            
        } catch (error) {
            console.error('❌ Error en autenticación:', error.message);
            return null;
        }
    }

    async disconnect() {
        if (this.pool) {
            await this.pool.end();
            this.isConnected = false;
            console.log('🔌 Conexión a base de datos cerrada');
        }
    }
}

module.exports = new Database();