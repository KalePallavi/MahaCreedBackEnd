const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    companyName: {
        type: String,
        required: true
    },
    // added by (company/dealer/retailer)
    leaderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    employeeName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gstin: {
        type: String,
        required: true
    },
    panCardNumber: {
        type: String,
        required: true
    },

    designation: {
        type: String,
        enum: ['A/C', 'W.H.O', 'Sales Person', 'Director', 'Manager', 'Store/Outlet'],
        required: true
    },
    employeeId: {
        type: String,
        required: true
    },  // Keeping it as a string for flexibility
    employeeMobileNumber: {
        type: String,
        required: true
    },
    personalEmailId: {
        type: String,
        required: true
    },
    employeeAadharNumber: {
        type: String,
        required: true
    },
    employeePanNumber: {
        type: String,
        required: true
    },
    employeeCurrentAddress: {
        type: String,
        required: true
    },
    employeePermanentAddress: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    district:{
        type:String,
        required:true
    },
    taluka:{
        type:String,
        required: true
    },
    village:{
        type : String,
        default: null
    },
    // otp store and attempts 
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    },

    otpAttempts: {
        type: Number,
        default: 0
    },
    otpBlockedUntil:
    {
        type: Date,
    },

    isActive: {
        type: Boolean,
        default: true
    },
    deactivatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Teams', teamSchema);
