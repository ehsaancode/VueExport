const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./create_page_design');
class ParserAccordionItem {
     constructor(startingColum, fileName, jsonObjects, parentWidth, parentHeight, 
          parantMainAlignment, parantCrossAlignment, parantType) {
          this.startingColum = startingColum;
          this.fileName = fileName;
          this.jsonObjects = jsonObjects;
          this.parentWidth = parentWidth; 
          this.parentHeight = parentHeight;
          this.parantMainAlignment = parantMainAlignment;
          this.parantCrossAlignment = parantCrossAlignment;
          this.parantType = parantType;
     }

     async parseAccordionItem() {
          let itemId = this.jsonObjects["id"];
          let mainAlignment = this.jsonObjects["mainAlignment"];
          let crossAlignment = this.jsonObjects["crossAlignment"];
          let alignment = "";
          if (mainAlignment === "align_left" || crossAlignment === "align_left") {
               alignment = alignment + "VStack (alignment: .leading)";
          } else if (mainAlignment === "align_right" || crossAlignment === "align_right") {
               alignment = alignment + "VStack (alignment: .trailing)";
          } else if (mainAlignment === "align_center" || crossAlignment === "align_center") {
               alignment = alignment + "VStack (alignment: .center)";
          } else {
               alignment = alignment + "VStack (alignment: .leading)";
          }

          await readWriteFile.writeToFile(this.fileName,
               ' '.repeat(this.startingColum) + `${alignment} { \n`
          ).then(async content => {
               if (content == 'success') {
                    await readWriteFile.writeToFile(this.fileName, "\n" +
                         ' '.repeat(this.startingColum + 1) + "Button(action: { \n" +
                         ' '.repeat(this.startingColum + 2) + "withAnimation(.easeInOut(duration: 0.3)) { \n" +
                         ' '.repeat(this.startingColum + 3) + `if expandedQuestions.contains(\"${itemId}\") { \n` +
                         ' '.repeat(this.startingColum + 4) + `expandedQuestions.remove(\"${itemId}\") \n` +
                         ' '.repeat(this.startingColum + 3) + `} else { \n` +
                         ' '.repeat(this.startingColum + 4) + `expandedQuestions.insert(\"${itemId}\") \n` +
                         ' '.repeat(this.startingColum + 3) + `} \n` +
                         ' '.repeat(this.startingColum + 2) + `} \n` +
                         ' '.repeat(this.startingColum + 1) + `}) { \n`
                    );

                    await this.parsePage(this.startingColum + 2, this.fileName, this.jsonObjects['children'], 
                         this.parentWidth, this.parentHeight, mainAlignment, crossAlignment);

                    await readWriteFile.writeToFile(this.fileName, "\n" +
                         ' '.repeat(this.startingColum + 1) + "} \n" +
                         ' '.repeat(this.startingColum + 1) + `if expandedQuestions.contains(\"${itemId}\") { \n`
                    );

                    await this.parsePage(this.startingColum + 2, this.fileName, this.jsonObjects['dChildren'], 
                         this.parentWidth, this.parentHeight, mainAlignment, crossAlignment);

                    await readWriteFile.writeToFile(this.fileName, "\n" +
                         ' '.repeat(this.startingColum + 1) + "} \n" 
                    );

                    await this.endFile(this.fileName, this.startingColum, this.jsonObjects);
               }
          });
     }
     
     async parsePage(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment) {   
          for (const index in jsonObjects) {
               var jsonObj = jsonObjects[index];
               await createPageDesign.pageDesign(startingColum + 1, fileName, jsonObj, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, "QAccordion");
          }
     }
     
     async endFile(pageName, startingColum, jsonObjects) {
          await readWriteFile.writeToFile(pageName, "\n" +
               ' '.repeat(startingColum) + "}\n" +
               ' '.repeat(startingColum) + ".listRowSeparator(.hidden)\n"
          );
     }
}



module.exports = {
     ParserAccordionItem
}

