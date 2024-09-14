const mongoose = require('mongoose');

const DemandSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        index: true
    },

     companyName:{
        type:String,
        default:null
     },
    dealerOrRetailerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    dealerOrRetailerName:{
        type:String,
        default: null
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true
    },
    productName:{
        type:String,
        default:null
     },
     orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
        default: 'Pending'
    },


    packingSize: {
        type: String,
        required: true,
        enum: ['S', 'M', 'L','KG','ML'] 
    },
    quantity: {
        type: Number,
        required: true,
        min: 1 
    },
    deliveryTimeInDays: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    netAmount: {
        type: Number,
        required: true
    },
    gstRate: {
        type: Number,
        enum: [5, 12, 18, 28],
        required: true
    },
    sgstAmount: {
        type: Number,
        required: true
    },
    cgstAmount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//Middleware to automatically calculate GST and net amount
DemandSchema.pre('save', function(next) {
    const gstAmount = this.totalAmount * (this.gstRate / 100);
    this.sgstAmount = gstAmount / 2;
    this.cgstAmount = gstAmount / 2;
    this.netAmount = this.totalAmount + gstAmount;
    next();
});

module.exports = mongoose.model('Demand', DemandSchema);
