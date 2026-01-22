const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./create_page_design');


class ParserDiv {
     constructor(startingColum, fileName, jsonObjects) {
          this.startingColum = startingColum;
          this.fileName = fileName;
          this.jsonObjects = jsonObjects;
     }

     async parseRowCol() {
          await readWriteFile.writeToFile(this.fileName,
               ' '.repeat(this.startingColum) + 'QGridWidget( \n' +
               ' '.repeat(this.startingColum + 1) + 'aligbment: .center,\n' +
               ' '.repeat(this.startingColum + 2) + 'contents: [\n' +
               ' '.repeat(this.startingColum + 3) + 'AnyView(_fromValue: ContainerView(aligbment: .center,\n' +
               ' '.repeat(this.startingColum + 4) + 'Container: {AnyView(_fromValue: VStack {\n');
     
          await readWriteFile.writeToFile(this.fileName, 
               ' '.repeat(this.startingColum + 5) + "HStack { \n");
     
          let columns = this.jsonObjects['webdesign_Columns'];
          for (const index in columns) {  
               await readWriteFile.writeToFile(this.fileName, 
                    ' '.repeat(this.startingColum + 6) + "VStack (alignment: .leading) { \n");
               let containers = columns[index];
               for (const index2 in containers) {  
                    let contain = containers[index2];
                    await createPageDesign.pageDesign(this.startingColum + 7, this.fileName, contain);
               }
               await readWriteFile.writeToFile(this.fileName, 
                    ' '.repeat(this.startingColum + 6) + "} \n");
          }
          await readWriteFile.writeToFile(this.fileName, 
                    ' '.repeat(this.startingColum + 5) + "} \n");
          await readWriteFile.writeToFile(this.fileName, 
                    ' '.repeat(this.startingColum + 2) + "})}))! \n");
          await readWriteFile.writeToFile(this.fileName, 
                    ' '.repeat(this.startingColum) + "]) \n");
     }
}

module.exports = {
     // parseRowCol
     ParserDiv
}


