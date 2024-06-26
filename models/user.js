const db = require('../db/database');

class User {
    static create(data) {
        const stmt = db.prepare('INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)');
        const info = stmt.run(data.name, data.surname, data.email, data.password);
        return { id: info.lastInsertRowid, ...data };
    }

    static findAll() {
        return db.prepare('SELECT * FROM users').all();
    }

    static findById(id) {
        return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    }

    static findByEmail(email) {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        return stmt.get(email);
    };

    static update(id, data) {
        const stmt = db.prepare('UPDATE users SET name = ?,surname = ?, email = ?, password = ? WHERE id = ?');
        stmt.run(data.name,data.surname, data.email, data.password, id);
        return { id, ...data };
    }

    static delete(id) {
        const stmt = db.prepare('DELETE FROM users WHERE id = ?');
        stmt.run(id);
    }
}

module.exports = User;
