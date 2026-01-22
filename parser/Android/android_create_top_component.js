const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./android_create_page_design');
const commonUtils = require('../../utility/common_utils');

class AndroidCreateTopComponent {  
   
    constructor(pageName, jsonObject, screenName) {
        this.pageName = pageName;
        this.jsonObject = jsonObject;
        this.screenName = screenName;
    }

    async parseTopComponent() {
    
        let hasHeaderBar = await commonUtils.hasHeaderBar(this.jsonObject);
        console.log("headerbar json =>"+ hasHeaderBar.status)
        let isHeaderBar = hasHeaderBar.status === 'success';
        let hasBottomMenu = await commonUtils.hasBottomMenu(this.jsonObject);
        let isBottomMenu = hasBottomMenu.status === 'success';

        let hasDrawerMenu = await commonUtils.hasDrawerMenu(this.jsonObject);
        console.log("hasDrawerMenu object => "+ await hasDrawerMenu.status);
        let isDrawerMenu = hasDrawerMenu.status === 'success';
        let drawerMenu = "";
        if(isDrawerMenu){
            let drawerId = hasDrawerMenu.object["id"];
            // console.log("drawerId => "+ drawerId);
            
            drawerMenu = hasDrawerMenu.status === 'success' ? 
            ' '.repeat(2) + "Box (modifier = Modifier.fillMaxSize()){\n" +
            ' '.repeat(3) + `DrawerScreen(navController)\n` +
            ' '.repeat(2) + "} \n\n" : "";
        }
        

        await readWriteFile.writeToFile(this.pageName, 
            "package com.redoq.appbuilder.ui.screen.bottom \n\n" +

            "import androidx.compose.foundation.layout.*\n"+
            "import androidx.compose.runtime.*\n"+
            "import androidx.compose.ui.*\n"+
            "import androidx.navigation.*\n"+
            "import com.redoq.appbuilder.ui.screen.tab.*\n\n\n"+

            "@Composable \n" +
            `fun ${this.screenName}Screen(navController:NavHostController) { \n` +
            ' '.repeat(1) + "Box ( \n" +
            ' '.repeat(3) + "modifier = Modifier.fillMaxSize()\n" +
            ' '.repeat(1) + "){ \n" +
            ' '.repeat(3) + "Column(modifier = Modifier.fillMaxSize()) {\n" +
            (isHeaderBar ? ' '.repeat(3) + `HeaderBarView()\n\n` : "") +
            ' '.repeat(3) + "Box ( \n" +
            ' '.repeat(5) + "modifier = Modifier.fillMaxSize()\n" +
            ' '.repeat(3) + "){ \n" +
            ' '.repeat(5) + `${this.screenName}ContainBody(navController)\n` +
            ' '.repeat(3) + "} \n\n" +
            (isBottomMenu ? ' '.repeat(3) + `BottomMenuView()\n` : "") +
            ' '.repeat(3) + "} \n\n" +
            drawerMenu
        )

        await readWriteFile.writeToFile(this.pageName, "\n" +
                ' '.repeat(1) + "} \n" +
            "}"
        );
        
    }

}

module.exports = {
    AndroidCreateTopComponent
}