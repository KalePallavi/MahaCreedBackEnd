const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    stateID: {
        type:Number,
        unique:true
    }
});

const districtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    stateID: {
        type:Number,
        required:true
    },
    districtID : {
        type:Number,
        unique: true
    },
});

const subDistrictSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    districtID : {
        type:Number,
        required: true
    },
    subDistrictID: {
        type:Number,
        unique:true
    },
});

const villageSchema = new mongoose.Schema({
    name: {
         type: String, 
         required: true
         },
    subDistrictID: {
         type: Number, 
         required: true
         },
});

const State = mongoose.model('State',stateSchema);
const District = mongoose.model('District',districtSchema);
const SubDistrict = mongoose.model('SubDistric',subDistrictSchema);
const Village = mongoose.model('Village', villageSchema);

module.exports = {State, District, SubDistrict,Village};