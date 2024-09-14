const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    companyId: {  // Changed from `companyName` to `companyId` for relation
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    companyName: {  // Keeping this for display purposes only
        type: String,
        required: true
    },
    addedBy: {  // Reference to the user who added the product
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productCategory: {
        type: String,
        enum: ['Seed', 'Fertilizer', 'Pestiside', 'Herbiside', 'Water Soluble Fertilizer', 'PVC and Fitting', 'Repairing AC And Accessories', 'Animal and Feed', 'Grossary', 'Electronics', 'Pharmacy', 'Hardware and Machnary', 'Agriculture Tools', 'Others'],
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    packingSize: {
        type: String,
        enum: ['S', 'L', 'M', 'KG', 'ML'],
        required: true
    },
    openingStock: {
        type: Number,
        required: true
    },
    storage: {
        type: String,
        enum: ['Shop', 'Godown'],
        required: true
    },
    batchNumber: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    purchasePriceWithoutGST: {
        type: Number,
        required: true
    },
    gstRate: {
        type: Number,
        enum: [5, 12, 18, 28],
        required: true
    },
    purchasePriceWithGST: {
        type: Number,
        required: true
    },
    cashSalePrice: {
        type: Number,
        required: true
    },
    creditSalePrice: {
        type: Number,
        required: true
    },
    cashWholesalePrice: {
        type: Number,
        required: true
    },
    creditWholesalePrice: {
        type: Number,
        required: true
    },
    mrp: {
        type: Number,
        required: true
    },
    isActive: {  // New field to track if the product is active
        type: Boolean,
        default: true
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

module.exports = mongoose.model('Product', ProductSchema);
