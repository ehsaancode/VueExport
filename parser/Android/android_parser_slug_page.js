const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./android_create_page_design');
const commonUtils = require('../../utility/common_utils');
const apiService = require('../../API_Service/api_service');
const topComponent = require('./android_create_top_component');
const navController = require('./android_parser_nav_controller');
const commonUtilsAndroid = require('./utils');

async function downloadPageContentForSlug(filePath, fileName, slug) {

    navController.addDestinations(slug);
    let pageName = `./created_files/Android/${fileName}Screen.kt`;
    if (await readWriteFile.fileExists(pageName) === true) {
        console.log(`fileExists`);
        return;
    }

    try {
        const pageContent = await apiService.fetchPageJson(
            "Home",
            slug,
            commonUtils.windowDevice,
            commonUtils.projectId,
            `${commonUtils.screenSizeAndroid().width}x${commonUtils.screenSizeAndroid().height}`,
            commonUtils.environment
        );
        if (pageContent === 'success') {
            console.log('Page JSON fetched successfully');
            await parsePageContentForSlug(filePath, fileName);
        } else {
            console.log('fetchPageJson failed:', pageContent);
        }
    } catch (error) {
        console.error('Error in run:', error);
    }

}


async function parsePageContentForSlug(filePath, fileName) {
    console.log(`filePath: ${filePath} \n fileName: ${fileName}`)
    const object = require(filePath);
    const jsonObject = object["pageContent"]["pageJson"]["template"]["children"][0];

    let pageName = `./created_files/Android/${fileName}Screen.kt`;
    readWriteFile.deleteFile(pageName);

    let containsBodyPageName = `./created_files/Android/${fileName}ContainsBody.kt`;
    readWriteFile.deleteFile(containsBodyPageName);

    let topComponents = new topComponent.AndroidCreateTopComponent(pageName, jsonObject, fileName)
    await topComponents.parseTopComponent();

    await readWriteFile.writeToFile(containsBodyPageName,
        //await commonUtilsAndroid.writeComposableBody(fileName)
        "package com.redoq.appbuilder.ui.screen.bottom \n\n" +
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
        "import androidx.compose.foundation.shape.*\n" +
        "import androidx.compose.ui.res.* \n" +
        "import androidx.navigation.* \n" +
        "import com.redoq.appbuilder.R \n" +
        "import com.redoq.mylibrary.CustomState.isLeftDrawerOpen\n" +
        "import com.redoq.mylibrary.utils.*\n\n" +
        "@Composable \n" +
        `fun ${fileName}ContainBody (\n` +
        ' '.repeat(3) + `navController:NavHostController\n` +
        `) { \n` +
        ' '.repeat(1) + "val textFieldStates = rememberTextFieldState()\n" +
        ' '.repeat(1) + "val scrollState = rememberScrollState()\n" +
        ' '.repeat(1) + "val isVisible = rememberAnimationState()\n\n" +
        ' '.repeat(1) + "Column ( \n" +
        ' '.repeat(2) + "modifier = Modifier \n" +
        ' '.repeat(3) + ".fillMaxSize()\n" +
        ' '.repeat(3) + ".verticalScroll(state = scrollState)\n" +
        ' '.repeat(2) + "){ \n"
    ).then(async content => {
        if (content == 'success') {
            console.log('*********** success mainCanvasJson ************');
            await parsePage(3, containsBodyPageName, jsonObject['children']);
            await endFile(containsBodyPageName);
        }
    })
}


async function parsePage(startingColum, fileName, jsonObjects) {
    // console.log(`jsonObjects: ${jsonObjects}`);
    let mainCanvasJsonFile = '../.././created_files/common_private/main_canvas.json';
    const mainCanvasObject = require(mainCanvasJsonFile);
    let parantWidth = mainCanvasObject["screenWidth"];
    let parantHeight = mainCanvasObject["screenHeight"];
    for (const index in jsonObjects) {
        var jsonObj = jsonObjects[index];
        await createPageDesign.pageDesign(startingColum, fileName, jsonObj, parantWidth, parantHeight, "MainCanvas");
    }
}

async function endFile(pageName) {
    await readWriteFile.writeToFile(pageName, "\n" +
        ' '.repeat(1) + "} \n" +
        "}"
    );
}

module.exports = {
    downloadPageContentForSlug
}