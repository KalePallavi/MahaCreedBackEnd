
const express = require('express');
const router = express();

const companyController = require('../contollers/companyController');
const {stockValidation} = require('../helpers/StokeValidator')
const { validateCompanyData,validateProduct } = require('../helpers/companyvalidator');
const RegisterEmployees = require('../contollers/TeamsController');
const {validateTeam}  = require('../helpers/teamValidator');
const {salesInvoiceValidation} = require('../helpers/SalesInvoiceValidator');
const roleAuth =  require('../middlewares/roleAuth');
const TeamsControlller = require('../contollers/TeamsController');
// const AgricommodityController = require('../controllers/AgricommodityController'); // Ensure correct spelling and path


// Route to register a new company
router.post('/registerCompany', validateCompanyData,companyController.registerCompany);
router.post('/updateCompany/:id', roleAuth('Company'),companyController.updateCompany);
router.get('/getCompanyById/:id', roleAuth('Company'),companyController.getCompanyById);
router.get('/getAllCompany', roleAuth('Super Admin'),companyController.getAllCompany);
router.post('/delete/:id', roleAuth('Super Admin '),companyController.deleteCompany);

//get state dist and sub-dist 
router.get('/getStates', companyController.getState);
router.get('/getDistrict', companyController.getDistrict);
router.get('/getSubDistrict', companyController.getSubDistrict);
router.get('/getVillages', companyController.getVillage);

router.post('/addEmployee',validateTeam,RegisterEmployees.RegisterEmployees);

//for company
router.get('/company/team',roleAuth('Company'),TeamsControlller.getAllTeamMembers );
router.get('/company/team/:id',roleAuth('Company'),TeamsControlller.getTeamMemberById);
router.post('/updateEmployee/:id',roleAuth('Company'),TeamsControlller.updateTeamMember);
router.post('/toggle-status/:id',roleAuth('Company'),TeamsControlller.toggleTeamMemberStatus);
router.post('/delete/:id',roleAuth('Company'),TeamsControlller.deleteTeamMember);

//for add product by admin
router.post('/addProduct',validateProduct,roleAuth('Company'),companyController.addProduct);
router.post('/updateProduct/:id',roleAuth('Company'),companyController.updateProduct);
router.post('/deleteProduct/:id',roleAuth('Company'),companyController.deleteProduct);
router.get('/get-All-Products',roleAuth('Company'),companyController.getAllProducts);
router.get('/get-ProductsById/:id',roleAuth('Company'),companyController.getProductById);

//for Stock managment
router.post('/addStock',stockValidation,companyController.addStock);
router.post('/updateStock/:id',companyController.updateStock);
router.get('/getStockDetailsById/:id',companyController.getStockDetails)
router.get('/getStockByProduct/:id', companyController.getStockByProduct);
router.get('/getAvailableStock/:id', companyController.getAvailableStock);
router.post('/deleteStockById/:id', companyController.deleteStockById)

//for Dealer 
router.get('/dealer/team',roleAuth('Dealer'),TeamsControlller.getAllTeamMembers );
router.get('/dealer/team/:id',roleAuth('Dealer'),TeamsControlller.getTeamMemberById);
router.post('/updateEmployee/:id',roleAuth('Dealer'),TeamsControlller.updateTeamMember);
router.post('/delete/:id',roleAuth('Dealer'),TeamsControlller.deleteTeamMember);


// for retailer
router.get('/retailer/team',roleAuth('Retailer'),TeamsControlller.getAllTeamMembers );
router.get('/retailer/team/:id',roleAuth('Retailer'),TeamsControlller.getTeamMemberById);
router.post('/updateEmployee/:id',roleAuth('Retailer'),TeamsControlller.updateTeamMember);
router.post('/delete/:id',roleAuth('Retailer'),TeamsControlller.deleteTeamMember);

//Add Demand of stock
router.post('/addDemand/:id',companyController.addDemand);
router.post('/updateDemand/:id',companyController.updateDemand);
router.post('/deleteDemandById/:id', companyController.deleteDemandById);

//sales invoice 
router.post('/createInvoice',salesInvoiceValidation,companyController.createInvoice )
router.post('/updateInvoice/:id',salesInvoiceValidation,companyController.updateInvoice )
router.get('/getInvoiceById/:id',salesInvoiceValidation,companyController.getInvoiceById )
router.post('/deleteInvoice/:id',salesInvoiceValidation,companyController.deleteInvoice )

// Third Eye
// router.get('/get-Third-eye/:id',roleAuth('Company'), companyController.thiredEye);
router.get('/searchCompany',companyController.searchCompany);


module.exports = router;
