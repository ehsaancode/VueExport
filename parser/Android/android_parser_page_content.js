const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./android_create_page_design");
const commonUtils = require("../../utility/common_utils");
const topComponent = require("./android_create_top_component");
const navController = require("./android_parser_nav_controller");
const commonUtilsAndroid = require("./utils");
const apiService = require("../../API_Service/api_service");
const commonPath = require("../../utility/common_path");
const path = require("path");

const androidProjectPath = path.resolve(
  __dirname,
  `${commonPath.androidProjectPath.get(commonPath.environmentHosting)}`
);

async function mobilePage(appFilesPath) {
  let jsonPath = `${androidProjectPath}/${commonUtils.projectId}/jsons`;
  console.log(`jsonPath: ${jsonPath}`);
  await readWriteFile.createFolderIfNotExists(jsonPath);
  await readWriteFile.deleteFilesInFolder(jsonPath);
  let slug = commonUtils.pageId > 0 ? `${commonUtils.pageId}` : "home";
  try {
    commonUtils.windowDevice = "M";
    const pageContent = await apiService.fetchPageJson(
      "Home",
      slug, //"home",
      "M",
      commonUtils.projectId,
      slug,
      `${commonUtils.screenSizeAndroid().width}x${
        commonUtils.screenSizeAndroid().height
      }`,
      commonUtils.environment,
      jsonPath
    );
    if (pageContent === "success") {
      //  homeController.addDestinations(`home`);
      await parsePageContent(
        appFilesPath,
        `${jsonPath}/${slug}_M.json`,
        "Home"
      );
    } else {
      console.log("fetchPageJson failed:", pageContent);
    }
  } catch (error) {
    console.error("Error in run:", error);
  }
}

async function parsePageContent(appFilesPath, filePath, fileName) {
  // console.log("start...");
  // const jsonObject = require(filePath);
  const object = require(filePath);
  //   const jsonObject = object["pageContent"]["pageJson"]["template"]["children"][0];
  const jsonObjects = object?.data?.children ?? "";
  if (jsonObjects?.length > 0) {
    const jsonObject = jsonObjects[0];
    let drawer = await commonUtils.hasDrawerMenu(jsonObject);
    //console.log("drawer value => "+drawer);

    let pageName = `${appFilesPath}/${fileName}Screen.kt`;
    readWriteFile.deleteFile(pageName);

    let containsBodyPageName = `${appFilesPath}/HomeContainsBody.kt`;
    readWriteFile.deleteFile(containsBodyPageName);

    let topComponents = new topComponent.AndroidCreateTopComponent(
      pageName,
      jsonObject,
      "Home"
    );
    await topComponents.parseTopComponent();

    let mainCanvasJson = "./created_files/common_private/main_canvas.json";
    await readWriteFile.deleteFile(mainCanvasJson);

    const objects = jsonObject;
    var width = objects["width"] != null ? objects["width"] : `0`;
    var height = objects["height"] != null ? objects["height"] : `0`;
    var screenWidth = commonUtils.screenSizeAndroid().width;
    var screenHeight = commonUtils.screenSizeAndroid().height;
    await readWriteFile
      .writeToFile(
        mainCanvasJson,
        "{ \n" +
          `\"width\": \"${width}\", \n` +
          `\"height\": \"${height}\", \n` +
          `\"screenWidth\": \"${screenWidth}\", \n` +
          `\"screenHeight\": \"${screenHeight}\", \n` +
          `\"bgColor\": \"${objects["bgColor"]}\" \n` +
          "}"
      )
      .then(async (content) => {
        if (content == "success") {
          await readWriteFile
            .writeToFile(
              containsBodyPageName,
              // await commonUtilsAndroid.writeComposableBody(fileName)
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
                "import com.redoq.mylibrary.utils.*\n\n\n" +
                "@Composable \n" +
                `fun ${fileName}ContainBody (\n` +
                " ".repeat(3) +
                `navController:NavHostController\n` +
                `) { \n` +
                " ".repeat(1) +
                "val textFieldStates = rememberTextFieldState()\n" +
                " ".repeat(1) +
                "val scrollState = rememberScrollState()\n" +
                " ".repeat(1) +
                "val isVisible = rememberAnimationState()\n\n" +
                " ".repeat(1) +
                "Column ( \n" +
                " ".repeat(2) +
                "modifier = Modifier \n" +
                " ".repeat(3) +
                ".fillMaxSize()\n" +
                " ".repeat(3) +
                ".verticalScroll(state = scrollState)\n" +
                " ".repeat(2) +
                "){ \n"
            )
            .then(async (content) => {
              if (content == "success") {
                console.log("*********** success mainCanvasJson ************");
                await parsePage(
                  3,
                  containsBodyPageName,
                  objects["children"],
                  0
                );
                await endFile(containsBodyPageName);
              }
            });
        }
      });
  }
}

async function parsePage(startingColum, fileName, jsonObjects, index) {
  // console.log(`jsonObjects: ${jsonObjects}`);
  navController.addDestinations("home");
  let mainCanvasJsonFile =
    "../.././created_files/common_private/main_canvas.json";
  const mainCanvasObject = require(mainCanvasJsonFile);
  let parantWidth = mainCanvasObject["screenWidth"];
  let parantHeight = mainCanvasObject["screenHeight"];
  for (const index in jsonObjects) {
    var jsonObj = jsonObjects[index];
    await createPageDesign.pageDesign(
      startingColum,
      fileName,
      jsonObj,
      parantWidth,
      parantHeight,
      "MainCanvas"
    );
  }
}

async function endFile(pageName) {
  await readWriteFile.writeToFile(
    pageName,
    "\n" + " ".repeat(3) + ") \n"
    + " ".repeat(1) + ") \n"
    + "}"
  );
  console.log(
    "nav items:",
    JSON.stringify(navController.destinations, null, 2)
  );
  navController.createAndUpdateNavController();
}

module.exports = {
  parsePageContent,
  mobilePage,
};
