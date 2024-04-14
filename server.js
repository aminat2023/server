const express = require('express');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Configure Multer for handling file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Middleware to parse JSON bodies
app.use(express.json());

// Route to create a new registration
app.post('/registrations', upload.single('image'), async(req, res) => {
    try {
        const { fullname, degree, department } = req.body;
        const imageUrl = req.file.path; // Assuming the image is saved in the 'uploads' directory

        const registration = await prisma.registration.create({
            data: {
                fullname,
                degree,
                department,
                imageUrl
            }
        });

        res.json(registration);
    } catch (error) {
        console.error('Error creating registration:', error);
        res.status(500).json({ error: 'Error creating registration' });
    }
});

// Route to get all registrations
app.get('/registrations', async(req, res) => {
    try {
        const registrations = await prisma.registration.findMany();
        res.json(registrations);
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({ error: 'Error fetching registrations' });
    }
});

// Route to get a single registration by ID
app.get('/registrations/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const registration = await prisma.registration.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!registration) {
            res.status(404).json({ error: 'Registration not found' });
        } else {
            res.json(registration);
        }
    } catch (error) {
        console.error('Error fetching registration:', error);
        res.status(500).json({ error: 'Error fetching registration' });
    }
});

// Route to delete a registration by ID
app.delete('/registrations/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const registration = await prisma.registration.delete({

            where: {
                id: parseInt(id)
            }
        });
        if (!registration) {
            res.status(404).json({ error: 'Registration not found' });
        } else {
            res.json({ message: 'Registration deleted successfully', registration });
        }
    } catch (error) {
        console.error('Error deleting registration:', error);
        res.status(500).json({ error: 'Error deleting registration' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});