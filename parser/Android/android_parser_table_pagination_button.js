const commonDefault = require('../Common/parse_default_div');
const commonUtils = require('../../utility/common_utils');
const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./android_create_page_design');
const commonUtilsAndroid = require('./utils');

class AndroidParserTablePaginationButton {

    constructor(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parentType) {
        this.startingColum = startingColum;
        this.fileName = fileName;
        this.jsonObjects = jsonObjects;
        this.parentWidth = parentWidth; 
        this.parentHeight = parentHeight;
        this.parentType = parentType;
    }
    
     async parseTablePaginationButton() {
        let getDefaultObject = await commonDefault.getDefaultObject();
        let frame = await commonUtilsAndroid.componentFrame(this.jsonObjects, getDefaultObject, this.parentWidth, this.parentHeight, false, true);

        await readWriteFile.writeToFile(this.fileName,
            ' '.repeat(this.startingColum) + 'QTablePaginationButton( \n' +
            ' '.repeat(this.startingColum + 2) + `${frame} \n` +
            ' '.repeat(this.startingColum + 2) + `totalPage = ${this.jsonObjects["totalPage"]}, \n` +
            ' '.repeat(this.startingColum + 2) + `currentPage = ${this.jsonObjects["currentPage"]}, \n` +
            ' '.repeat(this.startingColum + 1) + `)\n`
        )
    }

}

module.exports = {
     AndroidParserTablePaginationButton
}