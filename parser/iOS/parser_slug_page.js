const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./create_page_design");
const commonUtils = require("../../utility/common_utils");
const apiService = require("../../API_Service/api_service");
const navController = require("./parser_nav_controller");
const commonUtilsIos = require("./common_utilits_ios");
const commonDefault = require("../Common/parse_default_main_canvas");

async function downloadPageContentForSlug(filePath, fileName, slug) {
  navController.addDestinations(slug);
  let pageName = `./created_files/iOS/${fileName}.swift`;
  if ((await readWriteFile.fileExists(pageName)) === true) {
    return;
  }
  
  try {
    const pageContent = await apiService.fetchPageJson(
      "Home",
      slug,
      commonUtils.windowDevice,
      commonUtils.projectId,
      `${commonUtils.screenSizeIphone().width}x${
        commonUtils.screenSizeIphone().height
      }`,
      commonUtils.environment
    );
    if (pageContent === "success") {
      console.log("Page JSON fetched successfully");
      await parsePageContentForSlug(filePath, fileName);
    } else {
      console.log("fetchPageJson failed:", pageContent);
    }
  } catch (error) {
    console.error("Error in run:", error);
  }
}

async function parsePageContentForSlug(filePath, fileName) {
  const jsonObject = require(filePath);

  let pageName = `./created_files/iOS/${fileName}.swift`;
  readWriteFile.deleteFile(pageName);

  const objects =
    jsonObject["pageContent"]["pageJson"]["template"]["children"][0];
  await readWriteFile.deleteFile(pageName);

  await readWriteFile.deleteFile(await commonUtilsIos.actionFilePath());

  await readWriteFile.writeToFile(
    pageName,
    "import SwiftUI \n\n" +
      "struct " +
      `${fileName}` +
      ": View { \n" +
      " ".repeat(1) +
      "@State private var animatedComponentsIds: [String] = [] \n"
  );

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
        let mainCanvasJson = "./created_files/common_private/main_canvas.json";
        await readWriteFile.deleteFile(mainCanvasJson);

        const objects =
          jsonObject["pageContent"]["pageJson"]["template"]["children"][0]; //['data']['children'][0];
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
  downloadPageContentForSlug,
};
