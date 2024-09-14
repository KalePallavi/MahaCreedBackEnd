const mongoose = require('mongoose');

const SalesInvoiceSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        index: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    customerName: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        match: /^\d{10}$/
    },
    aadharCardNumber: {
        type: String,
        required: true,
        match: /^\d{12}$/
    },
    invoiceDate: {
        type: Date,
        default: Date.now,
        required: true,
        index: true
    },
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Credit', 'Wholesale', 'Online'],
        required: true
    },
    creditPeriod: {
        type: Number,
        default: 0,
        validate: {
            validator: function(v) {
                return (this.paymentMethod === 'Credit' && v > 0) || this.paymentMethod !== 'Credit';
            },
            message: 'Credit period must be greater than 0 for Credit payment method'
        }
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
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
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1']
        },
        price: {
            type: Number,
            required: true,
            min: [0, 'Price must be a positive number']
        },
        discount: {
            type: Number,
            default: 0,
            min: [0, 'Discount cannot be negative']
        },
        productTotalAmount: { // Renamed from totalAmount for clarity
            type: Number,
            required: true
        },
        productNetAmount: { // Renamed from netAmount for clarity
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
        }
    }],
    paymentDetails: {
        upiPaymentAmount: {
            type: Number,
            default: 0
        },
        upiBankName: {
            type: String
        },
        phoneNumber: {
            type: String,
            match: /^\d{10}$/
        },
        paidByCash: {
            type: Number,
            default: 0
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Partially Paid', 'Paid', 'Overdue'],
            default: 'Pending'
        },
        totalBill: {
            type: Number,
            required: true
        },
        billDiscount: {
            type: Number,
            default: 0
        },
        netBillAmount: {
            type: Number,
            required: true
        },
        totalPaidAmount: {
            type: Number,
            required: true,
            validate: {
                validator: function(value) {
                    return value <= this.paymentDetails.netBillAmount;
                },
                message: 'Total paid amount cannot exceed the net bill amount'
            }
        },
        dueAmount: { // Added to track any remaining balance
            type: Number,
            default: 0
        },
        paymentDueDate: { // Added to track when the next payment is due
            type: Date
        },
        
        balance: {
            type: Number,
            required: true,
            default: function() {
                return this.netBillAmount - this.totalPaidAmount; x
            }
        },
        hamali: {
            type: Number,
            default: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Pre-save hook to automatically update payment status and balance
SalesInvoiceSchema.pre('save', function(next) {
    if (this.totalPaidAmount >= this.netBillAmount) {
        this.paymentStatus = 'Paid';
    } else if (this.totalPaidAmount > 0) {
        this.paymentStatus = 'Partially Paid';
    } else {
        this.paymentStatus = 'Pending';
    }

    if (this.paymentDueDate && this.dueAmount > 0 && this.paymentDueDate < new Date()) {
        this.paymentStatus = 'Overdue';
    }

    next();
});

module.exports = mongoose.model('SalesInvoice', SalesInvoiceSchema);
