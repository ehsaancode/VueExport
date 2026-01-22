const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./create_page_design');


async function parseBlockDiv(startingColum, fileName, jsonObjects) {
     await readWriteFile.writeToFile(fileName, 
          ' '.repeat(startingColum) + "HStack { \n");
     let columns = jsonObjects['webdesign_Columns'];
     for (const index in columns) {  
          await readWriteFile.writeToFile(fileName, 
               ' '.repeat(startingColum + 1) + "VStack { \n");
          let containers = columns[index];
          for (const index2 in containers) {  
               let contain = containers[index2];
               await createPageDesign.pageDesign(startingColum + 1, fileName, contain);
          }
          await readWriteFile.writeToFile(fileName, 
               ' '.repeat(startingColum + 1) + "} \n");
     }
     await readWriteFile.writeToFile(fileName, 
          ' '.repeat(startingColum) + "} \n");
}

// exports.parseBlockDiv = parseBlockDiv
module.exports = {
     parseBlockDiv
}


