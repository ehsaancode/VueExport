const commonDefault = require('../Common/parse_default_floating_button');
const commonUtils = require('../../utility/common_utils');
const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./android_create_page_design');
const commonUtilsAndroid = require('./utils');


class AndroidParserFloatingButton{
    constructor(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parentType) {
        this.startingColum = startingColum;
        this.fileName = fileName;
        this.jsonObjects = jsonObjects;
        this.parentWidth = parentWidth; 
        this.parentHeight = parentHeight;
        this.parentType = parentType;
   }

   async parseFloatingButton() {
        console.log("---- floating button 1 ----")
        let getDefaultObject = await commonDefault.getDefaultObject();
        let frame = await commonUtilsAndroid.componentFrame(this.jsonObjects, getDefaultObject, this.parentWidth, this.parentHeight, false, true);
        let borderProperties = await commonUtilsAndroid.extractBorderProperties(this.jsonObjects);
        console.log("---- floating button 2 ----")

        if(this.parentType == "QStack"){
            await readWriteFile.writeToFile(this.fileName, 
                ' '.repeat(this.startingColum) + `Box(\n`+
                ' '.repeat(this.startingColum+1) + `modifier = Modifier.fillMaxSize()\n`+
                ' '.repeat(this.startingColum+1) + `.padding(start = ${parseFloat(this.jsonObjects['positionedLeft'] ?? 0)}.dp, end = ${parseFloat(this.jsonObjects['positionedRight'] ?? 0)}.dp, top = ${parseFloat(this.jsonObjects['positionedTop'] ?? 0)}.dp, bottom = ${parseFloat(this.jsonObjects['positionedBottom'] ?? 0)}.dp)\n`+
                ' '.repeat(this.startingColum+1) + `) { \n`
            );
        }

        await readWriteFile.writeToFile(this.fileName,
            ' '.repeat(this.startingColum) + 'QFloatingButton( \n' +
            ' '.repeat(this.startingColum + 1) + `${frame} \n` +
            // Border
            Object.entries(borderProperties).map(([key, value]) => 
                ' '.repeat(this.startingColum + 1) +`${key} = "${value}", \n`
            ).join('') +
            // position
            ' '.repeat(this.startingColum + 1) + `positionedTop = "${this.jsonObjects?.["positionedTop"] ?? '0px' }",\n` +
            ' '.repeat(this.startingColum + 1) + `positionedBottom = "${this.jsonObjects?.["positionedBottom"] ?? '0px' }",\n` +
            ' '.repeat(this.startingColum + 1) + `positionedStart = "${this.jsonObjects?.["positionedLeft"] ?? '0px' }",\n` +
            ' '.repeat(this.startingColum + 1) + `positionedEnd = "${this.jsonObjects?.["positionedRight"] ?? '0px' }",\n` +
            ' '.repeat(this.startingColum + 1) + `bgColor = "${this.jsonObjects?.["bgColor"] ?? "#00000000"}",\n` +
            await commonUtilsAndroid.handleOnClickNavigation(this.jsonObjects, this.startingColum) +
            ' '.repeat(this.startingColum + 1) + `children = listOf { \n`
        ).then(async (content) => {
            if (content == "success") {
                let widthHeight = await commonUtils.getComponentWidthHeight(this.jsonObjects, getDefaultObject, this.parentWidth, this.parentHeight, true);
            
                //console.log("*********** Success Floating Button ************");
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
            await createPageDesign.pageDesign(startingColum, fileName, jsonObj, parentWidth, parentHeight, "QFloatingButton");
        }
    }

    async endFile(pageName, startingColum, parentType) {
        await readWriteFile.writeToFile(pageName, "\n" +
            ' '.repeat(startingColum + 1) + '}\n' +
            ' '.repeat(startingColum) + ')\n'
        );

        if(parentType == "QStack"){
            await readWriteFile.writeToFile(pageName, 
                ' '.repeat(startingColum) + `}\n`
            );
        }
    }
}

module.exports = {
    AndroidParserFloatingButton
}