
// const mongoose = require('mongoose');
// const { generateUniqueID } = require("../helpers/UniqueID");
// const data = require('../state_district_data.json');



// const MONGO_URL = "mongodb://localhost/MahaCrred";

// // Async function to handle MongoDB connection
// async function main() {
//     try {
//         // Connect to MongoDB
//         await mongoose.connect(MONGO_URL, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             writeConcern: { w: 1 } // Ensuring write acknowledgment
//         });
//        // console.log(`MongoDB connected successfully to ${MONGO_URL}`);
//     } catch (err) {
//         console.error("Failed to connect to the database:", err.message);
//         process.exit(1); 
//     }
// }

// // main();




// const stateSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     stateID: {
//         type:Number,
//         unique:true
//     }
// });

// const districtSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     stateID: {
//         type:Number,
//         required:true
//     },
//     districtID : {
//         type:Number,
//         unique: true
//     },
// });

// const subDistrictSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     districtID : {
//         type:Number,
//         required: true
//     },
//     subDistrictID: {
//         type:Number,
//         unique:true
//     },
// });

// const villageSchema = new mongoose.Schema({
//     name: {
//          type: String, 
//          required: true
//          },
//     subDistrictID: {
//          type: Number, 
//          required: true
//          },
// });

// const State = mongoose.model('State',stateSchema);
// const District = mongoose.model('District',districtSchema);
// const SubDistrict = mongoose.model('SubDistric',subDistrictSchema);
// const Village = mongoose.model('Village', villageSchema);



// const BATCH_SIZE = 1000;

// async function insertData() {
//     try {
//         const stateDocs = [];
//         const districtDocs = [];
//         const subDistrictDocs = [];
//         const villageDocs = [];
//         console.log('Starting data processing...');

//         for (const item of data) {
//             const stateID = generateUniqueID();
//             stateDocs.push({
//                 name: item.state,
//                 stateID,
//             });

//             for (const dist of item.districts) {
//                 const districtID = generateUniqueID();
//                 districtDocs.push({
//                     name: dist.district,
//                     stateID,
//                     districtID,
//                 });

//                 for (const subDist of dist.subDistricts) {
//                     const subDistrictID = generateUniqueID();
//                     subDistrictDocs.push({
//                         name: subDist.subDistrict,
//                         districtID,
//                         subDistrictID,
//                     });


//                     for (const village of subDist.villages) {
//                         if (village && village) {
//                             villageDocs.push({
//                                 name: village,  
//                                 subDistrictID,
//                             });
//                         } else {
//                             console.warn(`Skipping village with missing name: ${JSON.stringify(village)}`);
//                         }

//                         if (villageDocs.length >= BATCH_SIZE) {
//                             await Village.insertMany(villageDocs);
//                             villageDocs.length = 0;
//                         } 
//                     }
//                     if (subDistrictDocs.length >= BATCH_SIZE) {
//                         await SubDistrict.insertMany(subDistrictDocs);
//                         subDistrictDocs.length = 0;
//                     }
//                 }

//                 if (districtDocs.length >= BATCH_SIZE) {
//                     await District.insertMany(districtDocs);
//                     districtDocs.length = 0;
//                 }
//             }

//             if (stateDocs.length >= BATCH_SIZE) {
//                 await State.insertMany(stateDocs);
//                 stateDocs.length = 0;
//             }
//         }

//         if (villageDocs.length > 0) await Village.insertMany(villageDocs);
//         if (subDistrictDocs.length > 0) await SubDistrict.insertMany(subDistrictDocs);
//         if (districtDocs.length > 0) await District.insertMany(districtDocs);
//         if (stateDocs.length > 0) await State.insertMany(stateDocs);

//         console.log('Data insertion completed successfully.');
//         process.exit();
//     } catch (error) {
//         console.error('Error inserting data:', error);
//         process.exit(1);
//     }
// }
// // insertData();

// // 