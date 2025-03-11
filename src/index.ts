import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { Sequelize, DataTypes } from 'sequelize'
import { cors } from 'hono/cors'

const app = new Hono()

// Use CORS middleware with no policy
app.use('*', cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'hono'
}); // Example for SQLite, change as needed

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

app.post('/api/users', async (c) => {
    const { name, email } = await c.req.json();
    try {
        await User.sync();
        const user = await User.create({ name, email });
        return c.json({ message: 'User inserted successfully!', user });
    } catch (error) {
        const errorMessage = (error as Error).message;
        return c.json({ message: 'Failed to insert user.', error: errorMessage }, 500);
    }
});

// connect to the database
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
