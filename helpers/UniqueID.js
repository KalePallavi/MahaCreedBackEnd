const generateID = new Set();

function generateUniqueID() {
    let id;
    do{
        //id = Math.floor(1000 + Math.random() * 9000);
        id = Math.floor(1000000 + Math.random() * 9000000);
       // console.log("genertaed id",id);
        
    }
    while( generateID.has(id));
    generateID.add(id);
    //console.log("we are in while",id);
    
    return id;
}

module.exports = {generateUniqueID};