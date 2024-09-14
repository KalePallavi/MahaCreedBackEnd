const agricommodity = require('../models/agricommodity');

// const aggricomodity = async (req,res) =>{
//     try{

//     }catch(error){

//     }
// }
const agricommodity = async (req,res) =>{
    try {
      const newAgricommodity = new newAgricommodity({
        currentDate: req.body.currentDate,
        days: req.body.days,
        edd: req.body.edd,
        unit: req.body.unit,
        avgProductQuantity: req.body.avgProductQuantity,
        avgMarketRate: req.body.avgMarketRate
      });
  
      // Save to database
      const savedAgricommodity = await newAgricommodity.save();
      res.status(201).json(savedAgricommodity);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
module.exports = {
    agricommodity
}