const mongoose = require('mongoose');
const Product = require('./Product');

const StockSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true
    },
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
    productName: {
        type:String,
        default:null
    }
    ,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, 
    stockType: {
        type: String,
        enum: ['IN', 'OUT'],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    batchNumber: {
        type: String,
        required: true,
        index: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    //added
    manufacturingDate: {
        type: Date
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
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
    status: {
        type: String,
        enum: ['Available', 'Sold', 'Expired', 'Damaged'],
        default: 'Available'
    },
    //with another logic
    totalAmount: {
        type: Number,
        required: true,
        //auto calculate
        // get: function() {
        //     return this.price * this.quantity;
       // }
    },
    netAmount: {
        type: Number,
        required: true,
        //for auto calculate
        // get: function() {
        //     const discountAmount = this.price * this.quantity * (this.discount / 100);
        //     return (this.price * this.quantity) - discountAmount;
        // }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    updatedAt: {
        type: Date
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, 
// {
//     toJSON: { getters: true }
// }
);

module.exports = mongoose.model('Stock', StockSchema);
