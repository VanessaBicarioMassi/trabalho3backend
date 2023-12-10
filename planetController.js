const Planet = require('../models/Planet');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAllPlanets = async (req, res) => {
  try {
    let query = {};

    // Filtros
    if (req.query.name) query.name = new RegExp(req.query.name, 'i');
    if (req.query.size) query.size = req.query.size;
    if (req.query.distanceFromSun) query.distanceFromSun = req.query.distanceFromSun;

    
    const planets = await Planet.find(query);

    // Ordenação
    if (req.query.sortBy) {
      const sortBy = req.query.sortBy;
      planets.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
    }

    // Paginação
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    const paginatedPlanets = planets.slice(startIndex, endIndex);

    res.status(200).json({
      totalItems: planets.length,
      totalPages: Math.ceil(planets.length / pageSize),
      currentPage: page,
      pageSize: pageSize,
      planets: paginatedPlanets,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPlanet = new Planet({ username, password: hashedPassword });
    await newPlanet.save();

    res.status(201).json({ message: 'Planeta registrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const planet = await Planet.findOne({ username });

    if (!planet) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const passwordMatch = await bcrypt.compare(password, planet.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }


    const token = jwt.sign({ planetId: planet._id, username: planet.username, role: planet.role }, 'secreto', {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
