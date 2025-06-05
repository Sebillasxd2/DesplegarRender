// server.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Soporta despliegue en Render u otros

// Middleware for parsing JSON
app.use(express.json());

// User class
class User {
    constructor(id, name, username, email, password, updatedAt, image, rol) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.updatedAt = updatedAt;
        this.image = image;
        this.rol = rol;
    }

    updateProfile(newData) {
        if (newData.name) this.name = newData.name;
        if (newData.username) this.username = newData.username;
        if (newData.email) this.email = newData.email;
        if (newData.image) this.image = newData.image;
        this.updatedAt = new Date();
    }

    passwordValid(inputPassword) {
        return this.password === inputPassword;
    }
}

// In-memory data
let users = [
    new User(1, 'John Doe', 'johndoe', 'john@example.com', 'password123', new Date(), 'john.jpg', 'admin'),
    new User(2, 'Jane Smith', 'janesmith', 'jane@example.com', 'password123', new Date(), 'jane.jpg', 'user'),
    new User(3, 'Robert Brown', 'robbrown', 'robert@example.com', 'password123', new Date(), 'robert.jpg', 'user')
];

// CRUD Endpoints

// Get all users
app.get('/users', (req, res) => {
    res.json(users);
});

// Get user by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Create a new user
app.post('/users', (req, res) => {
    const { name, username, email, password, image, rol } = req.body;
    const newUser = new User(
        users.length + 1,
        name,
        username,
        email,
        password,
        new Date(),
        image,
        rol
    );
    users.push(newUser);
    res.status(201).json(newUser);
});

// Update a user
app.put('/users/:id', (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (user) {
        user.updateProfile(req.body);
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    users = users.filter(u => u.id != req.params.id);
    res.status(204).send();
});

// Ruta raíz para evitar error "Cannot GET /"
app.get('/', (req, res) => {
    res.send(`
        <h1>Bienvenido a la API REST de Usuarios</h1>
        <p>Prueba el endpoint <a href="/users">/users</a> para ver los datos.</p>
    `);
});

// Ruta favicon.ico para evitar warning
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
