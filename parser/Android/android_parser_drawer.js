//https://img.icons8.com/?size=100&id=tIGF40qilLXA&format=png&color=000000 //todo: 

const commonUtils = require('../../utility/common_utils');
const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./android_create_page_design');
const commonUtilsAndroid = require('./utils');
const commonDefault = require('../Common/parse_default_drawer');

class AndroidParserDrawer {

    constructor(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parentType) {
        this.startingColum = startingColum;
        this.fileName = fileName;
        this.jsonObjects = jsonObjects;
        this.parentWidth = parentWidth; 
        this.parentHeight = parentHeight;
        this.parentType = parentType;
    }

    async parseDrawer() {
        await readWriteFile.writeToFile(this.fileName,
            ' '.repeat(this.startingColum) + "Box (\n"+
            ' '.repeat(this.startingColum+1) + "modifier = Modifier\n"+
            ' '.repeat(this.startingColum+3) + ".padding(8.dp)\n"+
            ' '.repeat(this.startingColum+3) + ".border(\n"+
            ' '.repeat(this.startingColum+5) + "width = 1.dp,\n"+
            ' '.repeat(this.startingColum+5) + "shape = RoundedCornerShape(4.dp),\n"+
            ' '.repeat(this.startingColum+5) + "color = Color.Black.copy(alpha = 0.7f)\n"+
            ' '.repeat(this.startingColum+3) + ")\n"+
            ' '.repeat(this.startingColum+3) + ".align(Alignment.End)\n"+
            ' '.repeat(this.startingColum+1) + "){\n"+
            ' '.repeat(this.startingColum+3) + "Image(\n"+
            ' '.repeat(this.startingColum+5) + "painter = painterResource(R.drawable.ic_menu),\n"+
            ' '.repeat(this.startingColum+5) + `contentDescription = "Parallax Background",\n`+
            ' '.repeat(this.startingColum+5) + "contentScale = ContentScale.Fit,\n"+
            ' '.repeat(this.startingColum+5) + "modifier = Modifier\n"+
            ' '.repeat(this.startingColum+7) + ".height(32.dp)\n"+
            ' '.repeat(this.startingColum+7) + ".width(32.dp)\n"+
            ' '.repeat(this.startingColum+7) + ".clickable {\n"+
            ' '.repeat(this.startingColum + 9) + "CustomState.isLeftDrawerOpen.value = true\n"+
            ' '.repeat(this.startingColum+7) + "}\n"+
            ' '.repeat(this.startingColum+3) + ")\n"+
            ' '.repeat(this.startingColum+1) + "}\n"

        );

        const pageName = `DrawerScreen`;
        let pagePath = `./created_files/Android/${pageName}.kt`;
        if(await readWriteFile.fileExists(pagePath) === true) {
            console.log(`fileExists`);
            return;
        }
        await readWriteFile.deleteFile(pagePath);

        let getDefaultObject = await commonDefault.getDefaultObject();
        let frame = await commonUtilsAndroid.componentFrame(this.jsonObjects, getDefaultObject, this.parentWidth, this.parentHeight, false, true);

        this.fileName = pagePath
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
            "import androidx.navigation.*\n"+
            "import com.redoq.mylibrary.QDrawer.*\n"+
            "import androidx.compose.animation.*\n" +
            "import androidx.compose.foundation.layout.*\n" +
            "import androidx.compose.ui.unit.*\n" +
            "import com.redoq.mylibrary.utils.*\n\n" +
            "@Composable\n" +
            `fun DrawerScreen(navController:NavHostController) { \n\n` + //` + `${pageName}` + `
            ' '.repeat(1) + "QDrawer( \n"+
            // ' '.repeat(2) + `${frame}`+
            ' '.repeat(2) + `openDrawer = "left",\n`+
            ' '.repeat(2) + "children = listOf { \n"
        ).then(async (content) => {
            if (content == 'success') {
                let getDefaultObject = await commonDefault.getDefaultObject();
                let widthHeight = await commonUtils.getComponentWidthHeight(this.jsonObjects, getDefaultObject, this.parentWidth, this.parentHeight, true);
                                                
                if (this.jsonObjects["dChildren"] != null && this.jsonObjects["dChildren"].length > 0) {
                    await this.parsePage(this.startingColum + 3, this.fileName, this.jsonObjects["dChildren"], widthHeight.width ?? this.parentWidth, widthHeight.height ?? this.parentHeight);
                }
                await this.endFile(this.fileName, this.startingColum);
            }
        });
    }

    async parsePage(startingColum, fileName, jsonObjects, parentWidth, parentHeight) {    
        for (const index in jsonObjects) {
            var jsonObj = jsonObjects[index];
            await createPageDesign.pageDesign(startingColum, fileName, jsonObj, parentWidth, parentHeight, "QDrawer");
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
    AndroidParserDrawer
}