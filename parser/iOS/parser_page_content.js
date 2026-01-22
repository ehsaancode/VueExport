const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./create_page_design");
const parserDrawer = require("./parser_drawer");
const commonUtils = require("../../utility/common_utils");
const commonPath = require("../../utility/common_path");
const commonDefault = require("../Common/parse_default_main_canvas");
const commonUtilsIos = require("./common_utilits_ios");
const apiService = require("../../API_Service/api_service");
const path = require("path");

const iosProjectPath = path.resolve(
  __dirname,
  `${commonPath.iosProjectPath.get(commonPath.environmentHosting)}`
);

async function mobilePage(appFilesPath) {
  let jsonPath = `${iosProjectPath}/${commonUtils.projectId}/jsons`;
  console.log(`jsonPath: ${jsonPath}`);
  await readWriteFile.createFolderIfNotExists(jsonPath);
  await readWriteFile.deleteFilesInFolder(jsonPath);
  let slug = commonUtils.pageId > 0 ? `${commonUtils.pageId}` : "home";
  try {
    commonUtils.windowDevice = "M";
    const pageContent = await apiService.fetchPageJson(
      "Home",
      slug,
      "M",
      commonUtils.projectId,
      slug,
      `${commonUtils.screenSizeIphone().width}x${
        commonUtils.screenSizeIphone().height
      }`,
      commonUtils.environment,
      jsonPath
    );
    if (pageContent === "success") {
      //  homeController.addDestinations(`home`);
      await parseMobilePage(appFilesPath, `${jsonPath}/${slug}_M.json`, "Home");
    } else {
      console.log("fetchPageJson failed:", pageContent);
    }
  } catch (error) {
    console.error("Error in run:", error);
  }
}

async function parseMobilePage(appFilesPath, filePath, fileName) {
  const jsonObject = require(filePath);
  // const objects = jsonObject["pageContent"]["pageJson"]["template"]["children"][0];
  const jsonObjects = jsonObject?.data?.children ?? "";
  if (jsonObjects?.length > 0) {
    const objects = jsonObjects[0];
    let pageName = `${appFilesPath}/${fileName}.swift`; // + jsonObject['webdesign_Attrs']['wstyle']['page-name'] + '.swift';
    await readWriteFile.deleteFile(pageName);
    await readWriteFile.deleteFile(
      await commonUtilsIos.actionFilePath(appFilesPath)
    );

    let isDrawer = false;
    for (const index in objects["children"]) {
      var jsonObj = objects["children"][index];
      isDrawer = await commonUtilsIos.hasDrawerMenu(jsonObj);
      if (isDrawer == "success") {
        break;
      } else {
      }
    }

    if (isDrawer == "success") {
      await readWriteFile.writeToFile(
        pageName,
        "import SwiftUI \n\n" +
          "struct " +
          "HomeWithDrawer" +
          ": View { \n" +
          " ".repeat(1) +
          "@State private var animatedComponentsIds: [String] = [] \n" +
          " ".repeat(1) +
          "@Binding var isDrawerOpen: Bool \n"
      );
    } else {
      await readWriteFile.writeToFile(
        pageName,
        "import SwiftUI \n\n" +
          "struct " +
          "Home" +
          ": View { \n" +
          " ".repeat(1) +
          "@State private var animatedComponentsIds: [String] = [] \n"
      );
    }

    await readWriteFile
      .writeToFile(
        pageName,
        "\n" +
          " ".repeat(1) +
          "var body: some View { \n" +
          " ".repeat(2) +
          "GeometryReader { proxy in \n" +
          " ".repeat(3) +
          "QScrollView ( \n" +
          " ".repeat(4) +
          "View1: {\n" +
          " ".repeat(5) +
          "VStack (spacing: 0) {\n"
      )
      .then(async (content) => {
        if (content == "success") {
          let mainCanvasJson =
            "./created_files/common_private/main_canvas.json";
          await readWriteFile.deleteFile(mainCanvasJson);

          // const objects = objects;
          // jsonObject["pageContent"]["pageJson"]["template"]["children"][0]; //['data']['children'][0];
          var width = objects["width"] != null ? objects["width"] : `0.0`;
          var height = objects["height"] != null ? objects["height"] : `0.0`;
          var screenWidth = commonUtils.screenSizeIphone().width;
          var screenHeight = commonUtils.screenSizeIphone().height;
          // var screenWidth = objects["screenWidth"] != null ? objects["screenWidth"] : `0.0`;
          // var screenHeight = objects["screenHeight"] != null ? objects["screenHeight"] : `0.0`;
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
                await parsePage(5, pageName, objects).then(async (content) => {
                  if (content == "success") {
                    // await endFile(pageName);
                  }
                });
              }
            });
        }
      });
  }
}

async function parsePage(startingColum, fileName, jsonObjects) {
  try {
    let mainCanvasJsonFile =
      "../.././created_files/common_private/main_canvas.json";
    const mainCanvasObject = require(mainCanvasJsonFile);
    let parantWidth = mainCanvasObject["screenWidth"];
    let parantHeight = mainCanvasObject["screenHeight"];
    let mainAlignment =
      jsonObjects["mainAlignment"] ??
      commonDefault.getDefaultObject()["mainAlignment"] ??
      "";
    let crossAlignment =
      jsonObjects["crossAlignment"] ??
      commonDefault.getDefaultObject()["crossAlignment"] ??
      "";
    let childrens = await jsonObjects["children"];

    for (const index in childrens) {
      await readWriteFile.writeToFile(
        fileName,
        "\n" + " ".repeat(7) + `section_${index}(); \n`
      );
    }

    await endFile(fileName);

    for (const index in childrens) {
      await readWriteFile.writeToFile(
        fileName,
        "\n" + " ".repeat(2) + `func section_${index}() -> some View { \n`
      );

      var jsonObj = childrens[index];
      await createPageDesign.pageDesign(
        4,
        fileName,
        jsonObj,
        parantWidth,
        parantHeight,
        mainAlignment,
        crossAlignment,
        "main_canvas"
      );

      await readWriteFile.writeToFile(fileName, "\n" + " ".repeat(2) + `} \n`);
      /*let isDrawer = await hasDrawerMenu(jsonObj);
               if(isDrawer == 'success') {
                    await parserDrawer.parseDrawer(jsonObj);
               } else {
                    await createPageDesign.pageDesign(startingColum, fileName, jsonObj, parantWidth, parantHeight, mainAlignment, crossAlignment, "main_canvas");
               }*/
    }

    await readWriteFile.writeToFile(fileName, "\n" + `} \n`);

    return "success";
  } catch (err) {
    console.error(err);
    return "failure";
  }
}

async function endFile(pageName, jsonObjects) {
  await readWriteFile.writeToFile(
    pageName,
    "\n" +
      " ".repeat(5) +
      "} \n" +
      " ".repeat(4) +
      "} \n" +
      " ".repeat(3) +
      ") \n" +
      " ".repeat(2) +
      "} \n" +
      " ".repeat(1) +
      "} \n"
    // "}"
  );
}

module.exports = {
  mobilePage,
};
