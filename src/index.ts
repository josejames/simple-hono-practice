import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { Sequelize, DataTypes } from 'sequelize'
import { cors } from 'hono/cors'
import 'dotenv/config'

const app = new Hono()

// Use CORS middleware with no policy
app.use('*', cors())

app.get('/', (c) => {
  return c.text('Hello Wong esto esta corriendo de manera exitosa felicidades !')
})
console.log(process.env.DEV_DATABASE)
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DEV_HOST,
    username: process.env.DEV_USERNAME,
    password: process.env.DEV_PASSWORD,
    database: process.env.DEV_DATABASE,
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

const futbolistas = sequelize.define('Futbolista' ,{
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    posicion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numero: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
})

/*app.post('/api/users', async (c) => {
    const { name, email } = await c.req.json();
    try {
        await User.sync();
        await futbolistas.sync();
        const user = await User.create({ name, email });
        return c.json({ message: 'User inserted successfully!', user });
    } catch (error) {
        const errorMessage = (error as Error).message;
        return c.json({ message: 'Failed to insert user.', error: errorMessage }, 500);
    }
});*/
app.post('/api/futbolistas', async (c) => {
    console.log("error")
    const { name, Posicion , Numero } = await c.req.json();
    try {
        await futbolistas.sync();
        const user = await futbolistas.create({ name: name, posicion:Posicion,numero:Numero });
        return c.json({ message: 'User inserted successfully!', user });
    } catch (error) {
        console.log(error)
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
