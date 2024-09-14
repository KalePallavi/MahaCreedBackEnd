const mongoose = require('mongoose');

const AgricommoditySchema = new mongoose.Schema({
  currentDate: {
    type: Date,
    required: true
  },
  days: {
    type: String,
    enum: ['15 days', '30 days', '45 days', '60 days', '90 days', '120 days'],
    required: true
  },
  edd: {
    type: String,
    required: true  // Corrected spelling of 'true'
  },
  unit: {
    type: String,
    enum: ['MM', 'CM', 'M', 'KM', 'INCH', 'FT', 'YD', 'MILE', 'MM²', 'CM²', 'M²', 'HECTARE', 'KM²', 'IN²', 'FT²', 'YD²', 'ACRE', 'MI²', 'MM³', 'CM³', 'M³', 'ML', 'L', 'IN³', 'FT³', 'YD³', 'GALLON', 'MG', 'G', 'KG', 'TON', 'OZ', 'LB', '°C', '°F', 'K', 'SECOND', 'MINUTE', 'HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR', 'M/S', 'KM/H', 'MPH', 'KNOT', 'PASCAL', 'BAR', 'ATM', 'MMHG', 'PSI', 'JOULE', 'KILOJOULE', 'CALORIE', 'KILOCALORIE', 'WATT-HOUR', 'KILOWATT-HOUR', 'WATT', 'KILOWATT', 'HORSEPOWER', 'VOLT', 'AMPERE', 'OHM', 'COULOMB', 'HENRY', 'TESLA', 'HERTZ', 'KILOHERTZ', 'MEGAHERTZ', 'GIGAHERTZ', 'NEWTON', 'DYNE', 'POUND-FORCE', 'DEGREE', 'RADIAN', 'GRADIAN'],
    required: true
  },
  avgProductQuantity: {
    type: String,
    required: true
  },
  avgMarketRate: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Agricommodity', AgricommoditySchema);