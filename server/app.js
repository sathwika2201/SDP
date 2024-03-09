const express = require('express');
const cors = require('cors');
const {MongoClient,ObjectId} = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on the port number ${PORT}`));

//Configuration (MONGODB)
var curl = "mongodb://localhost:27017";
var client = new MongoClient(curl); 

//TESTING
app.get('/weather/test', async function(req, res){
    //res.send("weather forecast application");
    res.json("weather forecast application");
});

app.post('/weather/data', async function(req, res){
    res.json(req.body);
    //res.json("weather forecast application");
});

//REGISTRATION MODULE
app.post('/registration/signup', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('WEATHER');
        users = db.collection('users');
        data = await users.insertOne(req.body);
        conn.close();
        res.json("Registered successfully...");
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//LOGIN MODULE
app.post('/login/signin', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('WEATHER');
        users = db.collection('users');
        data = await users.count(req.body);
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//HOME MODULE
app.post('/home/uname', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('WEATHER');
        users = db.collection('users');
        data = await users.find(req.body, {projection:{firstname: true, lastname: true}}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/home/menu', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('WEATHER');
        menu = db.collection('menu');
        data = await menu.find({}).sort({mid:1}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/home/menus', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('WEATHER');
        menus = db.collection('menus');
        data = await menus.find(req.body).sort({smid:1}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//CHANGE PASSWORD
app.post('/cp/updatepwd', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('WEATHER');
        users = db.collection('users');
        data = await users.updateOne({emailid : req.body.emailid}, {$set : {pwd : req.body.pwd}});
        conn.close();
        res.json("Password has been updated");
    }catch(err)
    {
        res.json(err).status(404);
    }
});

// Route to save weather data
app.post('/api/weather', async (req, res) => {
    try {
        const db = client.db(dbName);
        const weatherCollection = db.collection('weather');

        const { city, temperature, description } = req.body;
        const newWeatherData = { city, temperature, description };

        await weatherCollection.insertOne(newWeatherData);

        res.status(201).json({ message: 'Weather data saved successfully' });
    } catch (error) {
        console.error('Error saving weather data:', error);
        res.status(500).json({ error: 'Error saving weather data' });
    }
});

// Route to get all weather data
app.get('/api/weather', async (req, res) => {
    try {
        const db = client.db(dbName);
        const weatherCollection = db.collection('weather');

        const weatherData = await weatherCollection.find({}).toArray();

        res.status(200).json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

// Route to fetch weather data from external API based on city
app.get('/api/weather/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching weather data from external API:', error);
        res.status(500).json({ error: 'Error fetching weather data from external API' });
    }
});
// Route to update user profile
app.put('/api/profile/:id', async (req, res) => {
    try {
        const db = client.db(dbName);
        const profilesCollection = db.collection('profiles');
        const { id } = req.params;
        const { firstName, lastName, email, contactNumber, currentPassword, newPassword } = req.body;

        if (currentPassword === 'password') {
            const updatedProfile = {
                firstName,
                lastName,
                email,
                contactNumber,
                newPassword // Update the password
            };
            await profilesCollection.updateOne({ _id: id }, { $set: updatedProfile });
            res.status(200).json({ message: 'Profile updated successfully' });
        } else {
            res.status(401).json({ error: 'Invalid password' });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Error updating profile' });
    }
});

// Route to get user profile by ID
app.get('/api/profile/:id', async (req, res) => {
    try {
        const db = client.db(dbName);
        const profilesCollection = db.collection('profiles');
        const { id } = req.params;
        const profile = await profilesCollection.findOne({ _id: id });
        if (profile) {
            res.status(200).json(profile);
        } else {
            res.status(404).json({ error: 'Profile not found' });
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Error fetching profile' });
    }
});