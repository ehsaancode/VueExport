// const commonDefault = require('../Common/parse_default_accordion');
const commonUtils = require('../../utility/common_utils');
const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./android_create_page_design');
const commonUtilsAndroid = require('./utils');

class AndroidParserAccordionItem {
    constructor(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parentType) {
        this.startingColum = startingColum;
        this.fileName = fileName;
        this.jsonObjects = jsonObjects;
        this.parentWidth = parentWidth; 
        this.parentHeight = parentHeight;
        this.parentType = parentType;
    }

    async parseAccordionItem() {
        // console.log("AndroidParserAccordionItem");
        await readWriteFile.writeToFile(this.fileName, ''

        ).then(async (content) => {
            if (content == 'success') {
                await readWriteFile.writeToFile(this.fileName, "\n" +
                    ' '.repeat(this.startingColum + 1) + "QAccordionItem(\n" +
                    ' '.repeat(this.startingColum + 2) + "children = listOf {\n" 
                );

                await this.parsePage(this.startingColum + 2, this.fileName, this.jsonObjects['children'], 
                    this.parentWidth, this.parentHeight);

                await readWriteFile.writeToFile(this.fileName, "\n" +
                    ' '.repeat(this.startingColum + 2) + "},\n" +
                    ' '.repeat(this.startingColum + 2) + "dChildren = listOf {\n" 
                );

                await this.parsePage(this.startingColum + 2, this.fileName, this.jsonObjects['dChildren'], 
                    this.parentWidth, this.parentHeight);

                await readWriteFile.writeToFile(this.fileName, "\n" +
                    ' '.repeat(this.startingColum + 2) + "}\n"+
                    ' '.repeat(this.startingColum + 1) + ")\n"
                );

            }
        });
    }

    async parsePage(startingColum, fileName, jsonObjects, parentWidth, parentHeight) {   
        for (const index in jsonObjects) {
            var jsonObj = jsonObjects[index];
            await createPageDesign.pageDesign(startingColum + 1, fileName, jsonObj, parentWidth, parentHeight, "QAccordionItem");
        }
    }
}

module.exports = {
    AndroidParserAccordionItem
}