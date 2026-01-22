const commonDefault = require('../Common/parse_default_header_bar');
const commonUtils = require('../../utility/common_utils');
const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./android_create_page_design');
const commonUtilsAndroid = require('./utils');

class AndroidParserBottomMenu {

    constructor(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parentType) {
        this.startingColum = startingColum;
        this.fileName = fileName;
        this.jsonObjects = jsonObjects;
        this.parentWidth = parentWidth; 
        this.parentHeight = parentHeight;
        this.parentType = parentType;
   }

   async parseBottomMenu(){
        console.log("data : parseBottomMenu");

        let getDefaultObject = await commonDefault.getDefaultObject();
        let frame = await commonUtilsAndroid.componentFrame(this.jsonObjects, getDefaultObject, this.parentWidth, this.parentHeight, false, true);
        
        let paddingProps = await commonUtilsAndroid.extractPadding(this.jsonObjects, getDefaultObject);
        let marginProps = await commonUtilsAndroid.extractMargin(this.jsonObjects, getDefaultObject);
        let shadowProps = await commonUtilsAndroid.extractShadow(this.jsonObjects, getDefaultObject);
                
        const mainAlignment = (() => {
            switch (this.jsonObjects['mainAlignment']) {
                case 'align_start':
                        return 'Arrangement.Start';
                case 'align_center':
                        return 'Arrangement.Center';
                case 'align_end':
                        return 'Arrangement.End';
                case 'space_between':
                        return 'Arrangement.SpaceBetween';
                case 'space_evenly':
                        return 'Arrangement.SpaceEvenly';
                default:
                        return 'Arrangement.Start'; // Default value if no match
                }
        })();

        const crossAlignment = (() => {
            switch (this.jsonObjects['crossAlignment']) {
                case 'align_start':
                        return 'Alignment.Top';
                case 'align_center':
                        return 'Alignment.CenterVertically';
                case 'align_end':
                        return 'Alignment.Bottom';
                case 'space_between':
                        return 'Alignment.SpaceBetween';
                case 'space_evenly':
                        return 'Alignment.SpaceEvenly';
                default:
                        return 'Alignment.Top'; // Default value if no match
            }
        })();

        let pageName = './created_files/Android/BottomMenuView.kt';
        await readWriteFile.deleteFile(pageName);

        this.fileName = pageName
        await readWriteFile.writeToFile(this.fileName,
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
            "import com.redoq.mylibrary.utils.*\n\n" +
            "@Composable\n" +
            `fun ` + `BottomMenuView(){ \n\n` +
            ' '.repeat(this.startingColum) + 'QBottomMenu( \n'+ 
            ' '.repeat(this.startingColum + 1) + `${frame} \n` +
            ' '.repeat(this.startingColum + 1) + `bgColor = "${this.jsonObjects["bgColor"] ?? "#00FFFFFF"}", \n` +
            ' '.repeat(this.startingColum + 1) + `isFixed = ${this.jsonObjects?.["isFixed"] ?? false}, \n` +
            // Padding
            Object.entries(paddingProps).map(([key, value]) => 
                ' '.repeat(this.startingColum + 1) + `${key} = ${value}, \n`
            ).join("") +
            // Margin
            Object.entries(marginProps).map(([key, value]) => 
                ' '.repeat(this.startingColum + 1) + `${key} = ${value}, \n`
            ).join("") +
            // Shadow
            Object.entries(shadowProps).map(([key, value]) => 
                ' '.repeat(this.startingColum + 1) + `${key} = "${value}", \n`
            ).join("") +
            ' '.repeat(this.startingColum + 1) + `mainAlignment = ${mainAlignment}, \n` +
            ' '.repeat(this.startingColum + 1) + `crossAlignment = ${crossAlignment}, \n` +
            ' '.repeat(this.startingColum + 1) + 'children = listOf{\n'
        ).then(async(content)=>{
            if (content == 'success') {
                let getDefaultObject = await commonDefault.getDefaultObject();
                let widthHeight = await commonUtils.getComponentWidthHeight(this.jsonObjects, getDefaultObject, this.parentWidth, this.parentHeight, true);
                                                
                if (this.jsonObjects["children"] != null && this.jsonObjects["children"].length > 0) {
                    await this.parsePage(this.startingColum + 3, this.fileName, this.jsonObjects["children"], widthHeight.width ?? this.parentWidth, widthHeight.height ?? this.parentHeight);
                }
                await this.endFile(this.fileName, this.startingColum);
            }
        });
   }

   async parsePage(startingColum, fileName, jsonObjects, parentWidth, parentHeight) { 
        for (const index in jsonObjects) {
            var jsonObj = jsonObjects[index];
            await createPageDesign.pageDesign(startingColum + 1, fileName, jsonObj, parentWidth, parentHeight, "QBottomMenu"); 
        }
    }

    async endFile(pageName, startingColum) {
        await readWriteFile.writeToFile(pageName, 
            ' '.repeat(startingColum+1) + `}\n`+
            ' '.repeat(startingColum) + `)\n`+
            '}'
        );
    }
}

module.exports = {
    AndroidParserBottomMenu
}
