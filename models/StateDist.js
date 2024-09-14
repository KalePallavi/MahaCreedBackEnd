// const axios = require('axios');
// require('dotenv').config();
// const mongoose = require('mongoose');

// const MONGO_URL = "mongodb://localhost/MahaCrred1"
//  const url = process.env.MONGO_URL;


// //console.log(MONGO_URL);

// //connection with DB
// main().then(()=>{
//   //  console.log("MongoDb conneted to port 5000");
    
// }).catch((err=>{
//     console.log("Failed to connect database");
    
// }));

// async function main() {
//     mongoose.connect(MONGO_URL);
// }

// //Design schema
// const stateSchema = new mongoose.Schema({
//     name: String,
//     stateID: Number,
// });

// const districtSchema = new mongoose.Schema({
//     name: String,
//     stateID: Number,
//     districtID: Number,
// });

// const subDistrictSchema = new mongoose.Schema({
//     name: String,
//     districtID: Number,
//     subDistrictID: Number,
// });

// const State = mongoose.model('State', stateSchema);
// const District = mongoose.model('District', districtSchema);
// const SubDistrict = mongoose.model('SubDistrict', subDistrictSchema);

// module.exports = {
//     State,
//     District,
//     SubDistrict
// };

// //logic 

// // async function storeStateDist() {
// //     try {
// //         const indiaGeonameId = 1269750;
        
// //         // Fetch States
// //         const stateResponse = await axios.get(`http://api.geonames.org/childrenJSON?geonameId=${indiaGeonameId}&username=akshay26`);
// //         const states = stateResponse.data.geonames;
// //         //console.log(states);
        
        
// //         for (let state of states) {
// //             // console.log('=====================================');
// //             // console.log(state.name);
// //             // console.log(state.geonameId);
// //             // console.log('=====================================');

// //            // Store State in DB
// //             const storedState = await State.create({
// //                 name: state.name,
// //                 stateID: state.geonameId
// //             });
        

// //         //     // Fetch Districts for each State 1262271
// //         //const districtResponse = await axios.get(`http://api.geonames.org/childrenJSON?geonameId=1262271&username=akshay26`);

// //             const districtResponse = await axios.get(`http://api.geonames.org/childrenJSON?geonameId=${state.geonameId}&username=akshay26`);
// //             const districts = districtResponse.data.geonames;
            
// //             for (let district of districts) {
// //                 // Store District in DB
// //         //     console.log('=====================================');
// //         //     console.log(district.name);
// //         //     console.log(district.geonameId);
// //         //     console.log(state.geonameId);
// //         //     }
// //         // }
// //             //console.log('=====================================');
// //                 const storedDistrict = await District.create({
// //                     name: district.name,
// //                     stateID: state.geonameId,
// //                     districtID: district.geonameId
// //                 });

// //                  // Fetch Sub-Districts for each District
// //                 const subDistrictResponse = await axios.get(`http://api.geonames.org/childrenJSON?geonameId=${district.geonameId}&username=akshay26`);
// //                 const subDistricts = subDistrictResponse.data.geonames;
                
// //                 for (let subDistrict of subDistricts) {
// //                     // Store Sub-District in DB
// //                     await SubDistrict.create({
// //                         name: subDistrict.name,
// //                         districtID: district.geonameId,
// //                         subDistrictID: subDistrict.geonameId
// //                     });
// //                 }
// //            }
// //        }

// //         console.log('All geographical data stored successfully.');

// //     } catch (error) {
// //         console.error('Error storing geographical data:', error);
// //     }
// // }

// // storeStateDist();
