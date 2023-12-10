const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const planetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String, required: true },
  distanceFromSun: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  
  password: { type: String, required: true },
});


planetSchema.index({ name: 1, size: 1, distanceFromSun: 1 });

// Antes de salvar no banco de dados, faz o hash da senha
planetSchema.pre('save', async function (next) {
  const planet = this;
  if (planet.isModified('password')) {
    planet.password = await bcrypt.hash(planet.password, 10);
  }
  next();
});

const Planet = mongoose.model('Planet', planetSchema);

module.exports = Planet;
