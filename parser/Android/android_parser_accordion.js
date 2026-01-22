const commonDefault = require('../Common/parse_default_accordion');
const commonUtils = require('../../utility/common_utils');
const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./android_create_page_design');
const commonUtilsAndroid = require('./utils');

class AndroidParserAccordion {
    constructor(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parentType) {
        this.startingColum = startingColum;
        this.fileName = fileName;
        this.jsonObjects = jsonObjects;
        this.parentWidth = parentWidth; 
        this.parentHeight = parentHeight;
        this.parentType = parentType;
    }

    async parseAccordion() {
        // console.log("AndroidParserAccordion");
        const pageName = `Accordion${this.jsonObjects["id"] ?? ""}`;
        let pagePath = `./created_files/Android/${pageName}.kt`;

        await readWriteFile.deleteFile(pagePath);

        if(this.parentType == "QStack"){
            await readWriteFile.writeToFile(this.fileName, 
                ' '.repeat(this.startingColum) + `Box(\n`+
                ' '.repeat(this.startingColum+1) + `modifier = Modifier.fillMaxSize()\n`+
                ' '.repeat(this.startingColum+1) + `.padding(start = ${parseFloat(this.jsonObjects['positionedLeft'] ?? 0)}.dp, end = ${parseFloat(this.jsonObjects['positionedRight'] ?? 0)}.dp, top = ${parseFloat(this.jsonObjects['positionedTop'] ?? 0)}.dp, bottom = ${parseFloat(this.jsonObjects['positionedBottom'] ?? 0)}.dp)\n`+
                ' '.repeat(this.startingColum+1) + `) { \n`
            );
        }

        await readWriteFile.writeToFile(this.fileName,
            ' '.repeat(this.startingColum) + `\n${pageName}(navController) \n` 
        ).then(async (content) => {
            if (content == 'success') {
                await readWriteFile.writeToFile(pagePath, 
                    "package com.redoq.appbuilder.ui.screen.tab \n\n" +
                    "import androidx.compose.foundation.*\n" +
                    "import androidx.compose.runtime.*\n" +
                    "import androidx.compose.ui.*\n" +
                    "import androidx.compose.ui.graphics.*\n" +
                    "import androidx.compose.ui.layout.*\n" +
                    "import androidx.compose.ui.text.font.*\n" +
                    "import androidx.compose.ui.text.style.*\n" +
                    "import com.redoq.mylibrary.*\n" +
                    "import androidx.compose.animation.*\n" +
                    "import androidx.compose.foundation.layout.*\n" +
                    "import androidx.compose.ui.unit.*\n" +
                    "import androidx.navigation.*\n"+
                    "import com.redoq.mylibrary.QAccordion.*\n"+
                    "import com.redoq.mylibrary.utils.*\n\n\n" +
                    "@Composable\n" +
                    `fun ` + `${pageName}` + `(navController:NavHostController){ \n\n` +
                    ' '.repeat(1) + "val scrollState = rememberScrollState()\n\n" +
                    ' '.repeat(1) + "Column ( \n" +
                    ' '.repeat(2) + "modifier = Modifier.fillMaxSize()\n"+
                    ' '.repeat(4) + " .verticalScroll(state = scrollState)){ \n"+
                    ' '.repeat(3) + "QAccordion( \n"+
                    ' '.repeat(4) + "children = listOf { \n"
                );

                let getDefaultObject = await commonDefault.getDefaultObject();
                let widthHeight = await commonUtils.getComponentWidthHeight(this.jsonObjects, getDefaultObject, this.parentWidth, this.parentHeight, true);
                if (this.jsonObjects["children"] != null && this.jsonObjects["children"].length > 0) {
                    await this.parsePage(4, pagePath, this.jsonObjects['children'],widthHeight.width ?? this.parentWidth, widthHeight.height ?? this.parentHeight );
                }

                await readWriteFile.writeToFile(pagePath, "\n" +
                    ' '.repeat(4) + "}, \n" +
                    ' '.repeat(3) + ")\n" +
                    ' '.repeat(1) + "}\n" +
                    "}\n"
                );
                await this.endFile(this.fileName, this.startingColum, this.parentType);

            }
        });
    }

    async parsePage(startingColum, fileName, jsonObjects, parentWidth, parentHeight) {    
        for (const index in jsonObjects) {
            var jsonObj = jsonObjects[index];
            await createPageDesign.pageDesign(startingColum, fileName, jsonObj, parentWidth, parentHeight, "QAccordion");
        }
    }
   

    async endFile(pageName, startingColum, parentType) {
        if(parentType == "QStack"){
            await readWriteFile.writeToFile(pageName, 
                ' '.repeat(startingColum) + `}\n`
            );
        }
    }
}

module.exports = {
    AndroidParserAccordion
}