
const Company = require('../models/Companies');
// const State = require('../models/StateDist');
// const { State } = require('../models/StateDist');
// const { District } = require('../models/StateDist');
// const { SubDistrict } = require('../models/StateDist');

const User = require('../models/User');
const Product = require('../models/Product');
const Teams = require('../models/Teams');
const Stock = require('../models/Stock');
const Demand = require('../models/Demand')
const SalesInvoice = require('../models/SalesInvoice');
const mongoose = require('mongoose');
const { State, District, Village, SubDistrict } = require('../models/StateDistSchema');
const Companies = require('../models/Companies')


//controller to register a new company
const registerCompany = async (req, res) => {
    try {
        const {
            companyId, companyName, gstin, licenseNumber, cinNumber,
            panCardNumber, aadharCardNumber, contactPersonName,
            contactPersonMobileNumber, contactPersonEmail, state,
            district, taluka, village, companyAddress, pinCode,
            invAlphabetSeries, openingBalance, createdBy
        } = req.body;

        const company = new Company({
            companyId, companyName, gstin, licenseNumber, cinNumber,
            panCardNumber, aadharCardNumber, contactPersonName,
            contactPersonMobileNumber, contactPersonEmail, state,
            district, taluka, village, companyAddress, pinCode,
            invAlphabetSeries, openingBalance, createdBy
        });
        const savedcompany = await company.save();
        console.log("==================")
        //after succefully login we change the complete profile true

        if (savedcompany) {
            const updatedUser = await User.findById(createdBy);
            updatedUser.profileCompleted = true;
            await updatedUser.save();
            await res.status(201).json({
                status: true,
                message: 'company register successfully ',
                savedcompany
            });
        } else {
            await res.status(403).json(savedcompany);
        }
        console.log("==================");

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Update company
const updateCompany = async (req, res) => {
    try {
        const createdBy = req.user.id;
        console.log('user id : ', createdBy);

        const { id } = req.params;
        console.log("company id ", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(
                {
                    message: 'Invalid product ID format'
                });
        }

        const updateData = req.body;
        if(Object.keys(updateData).length === 0){
            return res.status(400).json({
                message:'No data provided for updating',
                data:[]
            });
        }
        console.log("update data +++", updateData);

        const updateProduct = await Company.findOneAndUpdate({
            _id: id, createdBy: createdBy
        },
            updateData,
            { new: true }
        )
        console.log(" updated Data : ", updateCompany);

        if (!updateCompany) {
            return res.status(404).json({
                success: false,
                message: 'product not found or not authorized to update'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Company Updated Successfully ',
            updateCompany
        })



    } catch (error) {
        console.error("Error Updating register company", error);
        res.status(500).json({
            success: false,
            message: 'Enternal server Error'
        });
    }
}



//getCompany By Id  
const getCompanyById = async (req, res) => {
    try {
        const createdBy = req.user.id;
        console.log("Autheticate Id ", createdBy);
        const { id } = req.params;
        console.log("+++++++ Params id ++++", id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({

                message: 'Invalid Product ID format'
            })
        }
        const company = await Company.findOne({ _id: id, createdBy: createdBy })
        if (!company) {
            return res.status(404).json({
                message: 'Company not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Find company by id successfully',
            company
        });

    } catch (error) {
        console.error("Error get  register company : ", error);
        res.status(500).json({
            success: false,
            message: 'Enternal server Error'
        });
    }
}


//get All company by using Super admin

const getAllCompany = async (req, res) => {
    try {
        const isSuperAdmin = req.user.id;
        if (!isSuperAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Your not Authenticate to Access '
            });
        }
        const allCompany = await Company.find();

        if (allCompany.length === 0) {
            return res.status(200).json({
                message: 'No company register yet',
                allCompany: []
            })
        }

        return res.status(200).json({
            success: true,
            message: 'All Company successfully ',
            allCompany
        });

    } catch (error) {
        console.error('Error fetching company:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

//delete company only for super Admin By Id
const deleteCompany = async (req, res) => {

    try {

        const isSuperAdmin = req.user.id;

        if (!isSuperAdmin) {
            return res.status(401).json({
                success: false,
                message: 'Your not Authenticate to Access'
            });
        }
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(
                {
                    message: 'Invalid product ID format'
                });
        }
        const deleteCompany = await Company.findById(id);
        if (!deleteCompany) {
            return res.status(404).json({
                success: false,
                message: 'company not deleted'
            });
        }
        res.status(200).json({
            success: true,
            message: 'company is deleted successfully '
        });


    } catch (error) {
        console.error("Error to Delete Product:", error);
        res.status(500).json({
            success: false,
            message: 'Server error : could not delete the product'
        })
    }
}

//get all states
const getState = async (req, res) => {
    try {
        const states = await State.find();
        if (!states || states.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'no states found',
                states: []
            })
        }
        return res.status(200).json({
            success: true,
            message: 'state fetch successfully ',
            states,
        })
    } catch (error) {
        console.error('Error to get state : ', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

//get all district 
const getDistrict = async (req, res) => {
    try {
        const { stateID } = req.body;
        console.log("state id from body", stateID);
        if (!stateID) {
            return res.status(400).json({
                success: false,
                message: 'District ID is required',
            });
        }

        const district = await District.find({ stateID });
        if (!district || district.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'no district found',
                district: []
            })
        }
        return res.status(200).json({
            success: true,
            message: 'District fetch successfully ',
            district,
        })
    } catch (error) {
        console.error('Error to get districts  : ', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const getSubDistrict = async (req, res) => {
    try {
        const { districtID } = req.body;
        console.log("Sub dist id from body", districtID);
        if (!districtID) {
            return res.status(400).json({
                success: false,
                message: 'District ID is required',
            });
        }

        const taluka = await SubDistrict.find({ districtID });
        if (!taluka || taluka.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'No SubDistrict found',
                taluka: []
            })
        }
        return res.status(200).json({
            success: true,
            message: 'SubDistrict fetch successfully ',
            taluka,
        })
    } catch (error) {
        console.error('Error to get taluka  : ', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

const getVillage = async (req, res) => {
    try {
        const { subDistrictID } = req.body;
        if (!subDistrictID) {
            return res.status(400).json({
                success: false,
                message: 'SubDistrict ID is required',
            });
        }
        const village = await Village.find({ subDistrictID });
       
        if (!village || village.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'No village is  found',
                villageData: []
            })
        }
        return res.status(200).json({
            success: true,
            message: 'village fetch successfully ',
            village,
        })
    } catch (error) {
        console.error('Error to get villages   : ', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}


//Add product
const addProduct = async (req, res) => {


    try {
        const userId = req.user._id;
        console.log("++++++++++++++");
        console.log(userId);
        console.log("++++++++++++++");

        // Find the company in database with reference id  
        const company = await Company.findOne({ createdBy: userId });
        console.log("============");
        console.log(company, "====", "_____",);
        console.log("=============");

        //If user has more than one company registration 
        // const { companyId } = req.body; // Get companyId from the request body
        // const company = await Company.findOne({ _id: companyId, createdBy: userId });

        if (!company) {
            return res.status(400).json({ message: 'Company not found for this user' });
        }

        // Create the product with the companyId
        const newProduct = new Product({
            companyId: company._id,
            companyName: company.companyName,
            addedBy: userId,
            // companyName:req.body.companyName,
            productCategory: req.body.productCategory,
            productName: req.body.productName,
            packingSize: req.body.packingSize,
            openingStock: req.body.openingStock,
            storage: req.body.storage,
            batchNumber: req.body.batchNumber,
            expiryDate: req.body.expiryDate,
            purchasePriceWithoutGST: req.body.purchasePriceWithoutGST,
            gstRate: req.body.gstRate,
            purchasePriceWithGST: req.body.purchasePriceWithGST,
            cashSalePrice: req.body.cashSalePrice,
            creditSalePrice: req.body.creditSalePrice,
            cashWholesalePrice: req.body.cashWholesalePrice,
            creditWholesalePrice: req.body.creditWholesalePrice,
            mrp: req.body.mrp,
            isActive: true,
        });

        await newProduct.save();

        return res.status(201).json({
            success: true,
            message: 'Product added successfully',
            product: newProduct
        });
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


//update the product 

const updateProduct = async (req, res) => {
    try {
        const addedBy = req.user.id;
        console.log(" update section ", addedBy);
        const { id } = req.params;
        console.log("++++++++");
        console.log("params id ", id);
        console.log("++++++++");

        //check id is mongoid or not
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(
                {
                    message: 'Invalid product ID format'
                });
        }
        //updated data that we want
        const updateData = req.body;
        if(Object.keys(updateData).length === 0){
            return res.status(400).json({
                message:'No data provided for updating',
                data:[]
            });
        }
        console.log("updated data we send", updateData);

        const updateProduct = await Product.findOneAndUpdate({
            _id: id, addedBy: addedBy, isActive: true
        },
            updateData,
            { new: true }
        )
        console.log("updated data :", updateProduct);

        if (!updateProduct) {
            return res.status(404).json({
                success: false,
                message: 'product not found or not authorized to update'
            })
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            updateProduct
        })


    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            success: false,
            message: 'Server error: could not update product '
        })
    }

}

//Delete product by only authorized admin
const deleteProduct = async (req, res) => {

    try {
        const addedBy = req.user.id;
        console.log("added by id", addedBy);
        const { id } = req.params;
        //check id is mongoid or not


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(
                {
                    message: 'Invalid product ID format'
                });
        }
        console.log("to delted that product id ", id);


        const deletedProduct = await Product.findOneAndDelete({
            _id: id,
            addedBy: addedBy
        });
        console.log("value after find id in db", deletedProduct);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not deleted'
            })
        }
        res.status(200).json({
            success: true,
            message: 'product deleted successfully!!'
        });


    } catch (error) {
        console.error("Error to Delete Product:", error);
        res.status(500).json({
            success: false,
            message: 'Server error : could not delete the product'
        })
    }
}

//Get All product
const getAllProducts = async (req, res) => {
    try {
        //authenticate id
        const createdBy = req.user.id;

        //find company assoicated with user
        const company = await Company.findOne({ createdBy: createdBy });

        if (!company) {
            return res.status(400).json({
                success: false,
                message: 'Company not found for this user'
            });
        }

        //get all active products for company
        const products = await Product.find({ companyId: company._id, isActive: true });

        if (products.length === 0) {
            return res.status(200).json({
                message: "No active products found for this proudcts",
                products: []
            });
        }
        res.status(200).json({
            success: false,
            message: 'Product fetch successfully!!',
            products
        })

    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

//Get Product By Id
const getProductById = async (req, res) => {
    try {
        const addedBy = req.user.id;
        // console.log("++++++++++",addedBy);

        const { id } = req.params;
        // console.log("=========");
        // console.log(id);
        // console.log("=========");

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({

                message: 'Invalid Product ID format'
            })
        }
        const product = await Product.findOne({ _id: id, addedBy: addedBy, isActive: true });
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'find product by id successfully',
            product
        });

    } catch (error) {
        console.error('Error Fetching Product', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

//Stock IN /OUT

const addStock = async (req, res) => {
    try {
        console.log(req);

        const { productId, companyId } = req.body;
        console.log(companyId, "product id  adn com in body", productId,);

        const company = await Company.findById(companyId);
        console.log("comapny id in database", company);

        if (!company) {
            return res.status(400).json({
                message: 'Company Not Found'
            });
        }
        //find productId
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({
                message: 'Product not found'
            });
        }
        //create new stock
        const newStock = new Stock({
            productId: product._id,
            companyId: company._id,
            companyName: company.companyName,
            productName: product.productName,
            stockType: req.body.stockType,
            quantity: req.body.quantity,
            batchNumber: req.body.batchNumber,
            expiryDate: req.body.expiryDate,
            manufacturingDate: req.body.manufacturingDate || null,
            price: req.body.price,
            discount: req.body.discount || 0,
            gstRate: req.body.gstRate,
            sgstAmount: req.body.sgstAmount,
            cgstAmount: req.body.cgstAmount,
            status: req.body.status || 'Available',
            price: req.body.price,
            discountAmount: req.body.discountAmount,
            netAmount: req.body.netAmount,
            totalAmount: req.body.totalAmount,
        });
        console.log("add new stock", newStock);

        await newStock.save();

        return res.status(201).json({
            success: true,
            message: 'Stock added successfully',
            stock: newStock

        });

    } catch (error) {
        console.error('Error ADD stock', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

//Update stock
const updateStock = async (req, res) => {
    try {
        //stoke id
        const { id } = req.params;
        const { productId, companyId } = req.body;

        //find product in the db
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({
                message: 'Product not found'
            });
        }
        //find company in db
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(400).json({
                message: 'Company is not found'
            });
        }

        console.log("stock id ", id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(
                {
                    message: 'Invalid stock ID format'
                });
        }
        const stock = await Stock.findById(id);
        console.log("stock in Db", stock);

        if (!stock) {
            return res.status(400).json({
                message: 'Invalid Stock Id '
            })
        }
        stockUpdated = req.body;
        console.log("++++++", stockUpdated);

        const updateStock = await Stock.findOneAndUpdate(
            { _id: id, productId: productId, companyId: companyId },
            stockUpdated,
            { new: true }
        );
        if (!updateStock) {
            return res.status(400).json({
                message: 'stock not found or not authorized to update'
            });
        }

        res.status(200).json({
            sucess: true,
            message: "Stock updated successfully!!",
            stockUpdated
        })

    } catch (error) {
        console.error('Error uodate stock', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

//get stock by id 
const getStockDetails = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(
                {
                    message: 'Invalid Stock ID format'
                });
        }
        const stock = await Stock.findById(id).populate('productId companyId');
        if (!stock) {
            return res.status(400).json({
                message: 'Stock entry is not found'
            });
        }
        if (stock.length === 0) {
            return res.status(200).json({
                message: 'Stock is empty',
                stock: []
            });
        }

        return res.status(200).json({
            success: true,
            message: ' fetching stock Detailes Successfully!!',
            stock
        })

    } catch (error) {
        console.error('Error uodate stock', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

//get stock by product
const getStockByProduct = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("+++++++", id);

        //id conflict between productId and params id 
        // const {productId} = req.params;;
        // console.log(" id is coming ",productId);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(
                {
                    message: 'Invalid Stock ID format'
                });
        }
        const productId = id;
        const stocks = await Stock.find({ productId }).populate('companyId');
        if (!stocks) {
            return res.status(400).json({
                message: 'Stock entry is not found'
            });
        }
        if (stocks.length === 0) {
            return res.status(200).json({
                message: 'product  is empty',
                stock: []
            });
        }

        return res.status(200).json({
            success: true,
            message: ' fetching stock Detailes by product id Successfully!!',
            stocks
        })

    } catch (error) {
        console.error('Error get stock by product: ', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

//get available stock by company
const getAvailableStock = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("+++++++", id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(
                {
                    message: 'Invalid Stock ID format'
                });
        }
        const companyId = id;
        const stocks = await Stock.find({
            companyId,
            status: 'Available',
            stockType: "IN",
            expiryDate: { $gt: new Date() }
        }).populate('productId');
        if (!stocks) {
            return res.status(400).json({
                message: 'Stock entry is not found'
            });
        }
        if (stocks.length === 0) {
            return res.status(200).json({
                message: 'stock  is empty',
                stock: []
            });
        }
        return res.status(200).json({
            success: true,
            message: 'fetching stock Detailes by company id Successfully!!',
            stocks
        })


    } catch (error) {
        console.error('Error get stock by company id: ', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}


//deleteStockById
const deleteStockById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("++++", id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(
                {
                    message: 'Invalid Stock ID format'
                });
        }
        const stock = await Stock.findByIdAndDelete(id);
        if (!stock) {
            return res.status(404).json({
                message: 'Invalid stock id'
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Stock entry deleted successfully'
        });

    } catch (error) {
        console.error('Error Delete Stock By id: ', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

//add Demand
const addDemand = async (req, res) => {
    try {
        const { companyId, productId, packingSize, quantity, Days, totalAmount, gstRate, cgstAmount, sgstAmount, netAmount } = req.body;
        const { id } = req.params;
        console.log("++++", id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(
                {
                    message: 'Invalid Stock ID format'
                });
        }
        const dealerOrRetailerId = await User.findById(id);
        console.log("dealer and retailer valid", dealerOrRetailerId);

        if (!dealerOrRetailerId) {
            return res.status(400).json({
                message: 'No such user available'
            })
        }
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(400).json({ message: 'Company Not Found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ message: 'Product Not Found' });
        }

        const newDemand = new Demand({
            companyId: company._id,
            companyName: company.companyName,
            dealerOrRetailerId: dealerOrRetailerId._id,
            dealerOrRetailerName: dealerOrRetailerId.name,
            productId: product._id,
            productName: product.productName,
            packingSize: packingSize,
            quantity: quantity,
            deliveryTimeInDays: Days,
            totalAmount: totalAmount,
            gstRate: gstRate,
            cgstAmount: cgstAmount, sgstAmount: sgstAmount, netAmount: netAmount
        });

        await newDemand.save();

        return res.status(201).json({
            success: true,
            message: 'Demand created successfully',
            demand: newDemand
        });

    } catch (error) {
        console.error('Error creating demand', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

// Update Dedmand 
const updateDemand = async (req, res) => {
    try {
        //stoke id
        const { id } = req.params;
        const { productId, companyId } = req.body;

        //find product in the db
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({
                message: 'Product not found'
            });
        }
        //find company in db
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(400).json({
                message: 'Company is not found'
            });
        }

        console.log("Demand stock id ", id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(
                {
                    message: 'Invalid Demand stock ID format'
                });
        }
        const demand = await Demand.findById(id);
        console.log("Demanded demand in Db", demand);

        if (!demand) {
            return res.status(400).json({
                message: 'Invalid demand Id '
            })
        }
        demandUpdated = req.body;
        console.log("++++++", demandUpdated);

        const updatedemand = await Demand.findOneAndUpdate(
            { _id: id, productId: productId, companyId: companyId },
            demandUpdated,
            { new: true }
        );
        if (!updatedemand) {
            return res.status(400).json({
                message: 'demand not found or not authorized to update'
            });
        }

        res.status(200).json({
            sucess: true,
            message: "demand updated successfully!!",
            demandUpdated
        })

    } catch (error) {
        console.error('Error uodate demand', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

//Delete Stock
const deleteDemandById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("++++", id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(
                {
                    message: 'Invalid demand ID format'
                });
        }
        const demand = await Demand.findByIdAndDelete(id);
        if (!demand) {
            return res.status(404).json({
                message: 'Invalid demand id'
            })
        }
        return res.status(200).json({
            success: true,
            message: 'demand entry deleted successfully'
        });

    } catch (error) {
        console.error('Error Delete demand By id: ', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}


const createInvoice = async (req, res) => {
    try {
        const {
            companyId,
            customerId,
            customerName,
            mobileNumber,
            aadharCardNumber,
            invoiceDate,
            invoiceNumber,
            address,
            paymentMethod,
            creditPeriod,
            products,
            paymentDetails
        } = req.body;

        // Validate the provided company ID
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(400).json({ message: 'Company Not Found' });
        }

        // Validate the customer ID
        const customer = await User.findById(customerId);
        if (!customer) {
            return res.status(400).json({ message: 'Customer Not Found' });
        }

        // Process each product in the invoice
        for (let i = 0; i < products.length; i++) {
            const { productId, batchNumber, quantity } = products[i];

            // Find the product
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(400).json({ message: `Product Not Found: ${productId}` });
            }

            if (product.companyId.toString() !== companyId) {
                return res.status(400).json({ message: `Product ${product.productName} does not belong to the specified company` });
            }

            // Find the stock entries for the product and batch
            let totalAvailableQuantity = 0;
            const stockEntries = await Stock.find({
                productId: productId,
                batchNumber: batchNumber,
                companyId: companyId,
                status: 'Available'
            });

            // Calculate total available stock
            stockEntries.forEach(stock => {
                totalAvailableQuantity += stock.quantity;
            });


            if (totalAvailableQuantity < quantity) {
                return res.status(400).json({ message: `Insufficient stock for product: ${product.productName}, Batch: ${batchNumber}` });
            }

            // Deduct stock from each entry until the quantity is fulfilled
            let quantityToDeduct = quantity;
            for (const stock of stockEntries) {
                if (quantityToDeduct <= 0) break;

                const deductQuantity = Math.min(quantityToDeduct, stock.quantity);
                stock.quantity -= deductQuantity;
                quantityToDeduct -= deductQuantity;

                await stock.save();
            }

            // Update the product's openingStock
            product.openingStock -= quantity;
            await product.save();
        }

        // Create the invoice
        const newInvoice = new SalesInvoice({
            companyId,
            customerId,
            customerName,
            mobileNumber,
            aadharCardNumber,
            invoiceDate,
            invoiceNumber,
            address,
            paymentMethod,
            creditPeriod,
            products,
            paymentDetails
        });

        await newInvoice.save();

        return res.status(201).json({
            success: true,
            message: 'Invoice created successfully and stock updated',
            invoice: newInvoice
        });

    } catch (error) {
        console.error('Error creating invoice', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params; // Get the invoice ID from the request parameters
        const { products } = req.body; // Get the updated product list from the request body

        console.log("invoice data ", id);

        // Find the existing invoice by ID
        const existingInvoice = await SalesInvoice.findById(id);
        if (!existingInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Iterate through the products in the invoice
        for (let i = 0; i < products.length; i++) {
            const updatedProduct = products[i];
            const existingProduct = existingInvoice.products.find(p => p.productId.toString() === updatedProduct.productId);

            if (!existingProduct) {
                return res.status(400).json({ message: `Product with ID ${updatedProduct.productId} not found in the invoice` });
            }

            // Calculate the difference in quantity
            const quantityDifference = updatedProduct.quantity - existingProduct.quantity;

            // Fetch the product from the database to update the stock
            const product = await Product.findById(updatedProduct.productId);
            if (!product) {
                return res.status(400).json({ message: `Product with ID ${updatedProduct.productId} not found in the database` });
            }

            // Update the stock based on the difference in quantity
            if (quantityDifference !== 0) {
                product.openingStock -= quantityDifference;
                await product.save();
            }

            // Update the invoice product details with the new quantity and amounts
            existingProduct.quantity = updatedProduct.quantity;
            existingProduct.productTotalAmount = updatedProduct.productTotalAmount;
            existingProduct.productNetAmount = updatedProduct.productNetAmount;
            existingProduct.sgstAmount = updatedProduct.sgstAmount;
            existingProduct.cgstAmount = updatedProduct.cgstAmount;
        }

        // Save the updated invoice
        await existingInvoice.save();

        return res.status(200).json({
            success: true,
            message: 'Invoice updated successfully',
            invoice: existingInvoice
        });
    } catch (error) {
        console.error('Error updating invoice', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


const getInvoiceById = async (req, res) => {
    try {
        const { invoiceId } = req.params; // Get the invoice ID from the request parameters

        // Find the invoice by ID
        const invoice = await SalesInvoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        return res.status(200).json({
            success: true,
            invoice
        });
    } catch (error) {
        console.error('Error fetching invoice', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params; // Get the invoice ID from the request parameters

        // Find the invoice by ID
        const invoice = await SalesInvoice.findById(id);
        console.log('invoice is fetch successfully ', invoice);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Iterate through the products 
        for (let i = 0; i < invoice.products.length; i++) {
            const invoiceProduct = invoice.products[i];
            console.log("in loop product", invoiceProduct);

            // Find the product in  db
            const product = await Product.findById(invoiceProduct.productId);
            if (product) {
                // Revert the stock 
                console.log("product is here in loop", product);

                product.openingStock += invoiceProduct.quantity;
                await product.save();
            }
        }

        // Delete the invoice
        await SalesInvoice.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: 'Invoice deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting invoice', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


//Thired Eye API

// const thiredEye = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         console.log("+++++++", userId);

//         //company id
//         const { id } = req.params;
//         console.log("comnpany ID: ", id);

//         // leader id 
//         let teams = await Teams.find({ leaderId: userId }).lean();
//         console.log("Teams in DB:", teams);

//         const teamMemberIds = teams.length > 0 ? teams.map(team => team) : [];

//         const companyId = id;

//         let dealerRetailerDetails = await SalesInvoice.find({ companyId }).lean();
//         console.log("Dealer/Retailer Details:", dealerRetailerDetails);


//         const response = {
//             teams: teamMemberIds,
//             dealersRetailers: dealerRetailerDetails.length > 0 ? dealerRetailerDetails : []
//         };

//         res.status(200).json(response);

//     } catch (error) {
//         console.error("Error while fetching data:", error);
//         res.status(500).json({ error: 'An error occurred while fetching data' });
//     }
// };

const searchCompany = async (req, res) => {
    try {
        // Extract query parameters from the request
        const { s1, s2, s3, s4, s5, s6, s7, s8, s9, s10 } = req.query;

        // Validate role input, making sure it's one of the accepted roles
        const validRoles = ["company", "dealer", "retailer", "panchayat samiti", "zilha parishad"];
        if (s10 && !validRoles.includes(s10.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Allowed roles are: company, dealer, retailer, panchayat samiti, zilha parishad'
            });
        }

        // Build the search criteria dynamically based on the provided parameters
        const searchCriteria = {};

        if (s1) searchCriteria.companyName = s1;
        if (s2) searchCriteria.companyAddress = s2;
        if (s3) searchCriteria.cinNumber = s3;
        if (s4) searchCriteria.gstin = s4;
        if (s5) searchCriteria.licenseNumber = s5;
        if (s6) searchCriteria.panCardNumber = s6;
        if (s7) searchCriteria.aadharCardNumber = s7;
        if (s8) searchCriteria.contactPersonMobileNumber = s8;
        if (s9) searchCriteria.userId = s9;
        if (s10) searchCriteria.role = s10;  // Add role to the search criteria

        // Check if any search criteria were provided
        if (Object.keys(searchCriteria).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No search criteria provided',
                data: {
                    companyName: "",
                    companyAddress: "",
                    cinNumber: "",
                    gstin: "",
                    licenseNumber: "",
                    panCardNumber: "",
                    aadharCardNumber: "",
                    contactPersonMobileNumber: "",
                    userId: "",
                    role: ""
                }
            });
        }
        
        // Find the company based on the dynamic search criteria
        const company = await Company.findOne(searchCriteria);

        // If no company matches the criteria, return a failure response with empty fields
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'No matching company found',
                data: {
                    companyName: "",
                    companyAddress: "",
                    cinNumber: "",
                    gstin: "",
                    licenseNumber: "",
                    panCardNumber: "",
                    aadharCardNumber: "",
                    contactPersonMobileNumber: "",
                    userId: "",
                    role: ""
                }
            });
        }

        // Structure the response to include all fields if the company is found
        const responseData = {
            companyName: company.companyName || "",
            companyAddress: company.companyAddress || "",
            cinNumber: company.cinNumber || "",
            gstin: company.gstin || "",
            licenseNumber: company.licenseNumber || "",
            panCardNumber: company.panCardNumber || "",
            aadharCardNumber: company.aadharCardNumber || "",
            contactPersonMobileNumber: company.contactPersonMobileNumber || "",
            userId: company.userId || "",
            role: company.role || ""
        };

        // Return a success response with the data
        return res.status(200).json({
            success: true,
            message: 'Success: Company found',
            data: responseData
        });

    } catch (error) {
        // Handle any errors that occur
        console.error("Error while fetching company data:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};














        






module.exports = {
    registerCompany,
    updateCompany,
    getCompanyById,
    getAllCompany,
    deleteCompany,

    getState,
    getDistrict,
    getSubDistrict,
    getVillage,

    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductById,

    addStock,
    updateStock,
    getStockDetails,
    getStockByProduct,
    getAvailableStock,
    deleteStockById,

    addDemand,
    updateDemand,
    deleteDemandById,

    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceById,

    // thiredEye,
    searchCompany

};