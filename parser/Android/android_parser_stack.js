const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./android_create_page_design');
const commonUtils = require('../../utility/common_utils');
const commonUtilsAndroid = require('./utils');
const commonDefault = require('../Common/parse_default_stack');

class AndroidParserStack{
    constructor(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parentType) {
        this.startingColum = startingColum;
        this.fileName = fileName;
        this.jsonObjects = jsonObjects;
        this.parentWidth = parentWidth; 
        this.parentHeight = parentHeight;
        this.parentType = parentType;
   }

    async parseStack(){
            let getDefaultObject = await commonDefault.getDefaultObject();
            let frame = await commonUtilsAndroid.componentFrame(this.jsonObjects, getDefaultObject, this.parentWidth, this.parentHeight, false, true);
     
            // if(this.parentType == "QStack"){
            //     await readWriteFile.writeToFile(fileName, 
            //         ' '.repeat(this.startingColum) + `Box(\n`+
            //         ' '.repeat(this.startingColum+1) + `modifier = Modifier.fillMaxSize()\n`+
            //         ' '.repeat(this.startingColum+1) + `.padding(start = ${parseFloat(this.jsonObjects['positionedLeft'] ?? 0)}.dp, end = ${parseFloat(this.jsonObjects['positionedRight'] ?? 0)}.dp, top = ${parseFloat(this.jsonObjects['positionedTop'] ?? 0)}.dp, bottom = ${parseFloat(this.jsonObjects['positionedBottom'] ?? 0)}.dp)\n`+
            //         ' '.repeat(this.startingColum+1) + `) { \n`
            //     );
            // }  

            await readWriteFile.writeToFile(
                this.fileName,
                ' '.repeat(this.startingColum) + 'QStack(\n' +
                ' '.repeat(this.startingColum + 1) + `${frame} \n` +
                await commonUtilsAndroid.getFormattedAnimationsData(this.jsonObjects["id"], this.jsonObjects?.["AnimationsData"], this.startingColum) +
                await commonUtilsAndroid.handleOnClickNavigation(this.jsonObjects, this.startingColum) +
                ' '.repeat(this.startingColum + 1) + `children = listOf { \n`
            ).then(async (content) => {
                if (content == "success") {
                    let widthHeight = await commonUtils.getComponentWidthHeight(this.jsonObjects, getDefaultObject, this.parentWidth, this.parentHeight, true);
                                                    
                    //console.log("*********** success Stack ************");
                    if (this.jsonObjects["children"] != null && this.jsonObjects["children"].length > 0) {
                        await this.parsePage(this.startingColum + 3, this.fileName, this.jsonObjects["children"], widthHeight.width ?? this.parentWidth, widthHeight.height ?? this.parentHeight);
                    }
                    await this.endFile(this.fileName, this.startingColum, this.parentType);
                }
          });
                  
    }

    async parsePage(startingColum, fileName, jsonObjects, parentWidth, parentHeight) {    
        for (const index in jsonObjects) {
            var jsonObj = jsonObjects[index];
            await createPageDesign.pageDesign(startingColum, fileName, jsonObj, parentWidth, parentHeight, "QStack");
        }
    }
            
    async endFile(pageName, startingColum, parentType) {
        await readWriteFile.writeToFile(pageName, "\n" +
            ' '.repeat(startingColum + 1) + '}\n' +
            ' '.repeat(startingColum) + ')\n'
        );

        // if(parentType == "QStack"){
        //     await readWriteFile.writeToFile(pageName, 
        //         ' '.repeat(startingColum) + `}\n`
        //     );
        // }
    }
}

module.exports = {
    AndroidParserStack
}