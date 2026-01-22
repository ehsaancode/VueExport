const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./react_native_create_page_design");
const commonUtils = require("../../utility/common_utils");
const apiService = require("../../API_Service/api_service");
const commonPath = require("../../utility/common_path");
const path = require("path");

const reactNativeProjectPath = path.resolve(
  __dirname,
  `${commonPath.reactNativeProjectPath.get(commonPath.environmentHosting)}`
);

async function page(
  appFilesPath,
  projectId,
  pageId,
  slug,
  jsonPath,
  pageName,
  layoutId
) {
  const destination = slug.trim();
  const destinationFileName = destination.replace(/-/g, "_");
  const fileName = commonUtils.toPascalCase(destinationFileName);
  await readWriteFile.createFolderIfNotExists(jsonPath);

  let pagePath = `${appFilesPath}/${pageName}/${pageName}.jsx`;
  await mapperService.fetchMapperJson(projectId, pageId, jsonPath, "M");
  await androidMapper.startMapper(projectId, pageId, pagePath);

  try {
    commonUtils.windowDevice = "M";
    const pageContent = await apiService.fetchPageJson(
      fileName,
      slug,
      "M",
      projectId,
      pageId,
      `${commonUtils.screenSizeAndroid().width}x${
        commonUtils.screenSizeAndroid().height
      }`,
      commonUtils.environment,
      jsonPath
    );
    if (pageContent === "success") {
      let layoutName = await commonUtilsAndroid.getLayoutNameByPageId(layoutId);
      await parsePageContent(
        appFilesPath,
        `${jsonPath}/${slug}_M.json`,
        pageName,
        layoutName
      );

      await createFinalPage(
        appFilesPath,
        fileName,
        pageName,
        layoutId,
        layoutName
      );
    } else {
      console.log("fetchPageJson failed:", pageContent);
    }
  } catch (error) {
    console.error("Error in run:", error);
  }
}

async function parsePageContent(
  appFilesPath,
  filePath,
  fileName,
  layoutName,
  projectId = 0,
  pageId = 0
) {
  const object = require(filePath);
  const jsonObjects = object?.data?.children ?? "";
  if (jsonObjects?.length > 0) {
    // console.log(`jsonObject page1 -> ${JSON.stringify(jsonObjects)}`);
    // const jsonObject = jsonObjects[0];
    let pageName = `${appFilesPath}/${fileName}/${fileName}.kt`;
    await androidMapper.startMapper(projectId, pageId, pageName);
    // delete require.cache[require.resolve(pageName)];
    await readWriteFile.createFolderIfNotExists(`${appFilesPath}/${fileName}`);
    // console.log(`jsonObject page1 -> ${JSON.stringify(jsonObjects)}`);
    // const objects = jsonObject;
    await readWriteFile
      .writeToFile(
        pageName,
        `package ${commonUtils.android_project_package_name}.presentation.pages.${fileName}\n\n` +
          "import androidx.compose.foundation.*\n" +
          "import androidx.compose.runtime.*\n" +
          "import androidx.compose.ui.*\n" +
          "import androidx.compose.ui.graphics.*\n" +
          "import androidx.compose.ui.layout.*\n" +
          "import androidx.compose.ui.text.font.*\n" +
          "import androidx.compose.ui.text.style.*\n" +
          `import com.redoq.qlib.*\n` +
          "import androidx.compose.animation.*\n" +
          "import androidx.compose.foundation.layout.*\n" +
          "import androidx.compose.ui.unit.*\n" +
          "import androidx.compose.foundation.shape.*\n" +
          "import androidx.compose.ui.res.* \n" +
          "import androidx.navigation.* \n" +
          // `import ${commonUtils.android_project_package_name}.R \n` +
          `import com.redoq.qlib.utils.*\n` +
          `import com.redoq.qlib.new_component.*\n` +
          `import androidx.compose.runtime.Composable\n` +
          "[import_files]\n\n\n" +
          "@Composable \n" +
          `fun ${fileName} (\n` +
          " ".repeat(3) +
          `navController:NavHostController\n` +
          `) { \n` +
          (layoutName !== ""
            ? " ".repeat(3) +
              `QColumn ( \n` +
              " ".repeat(5) +
              `children = listOf(\n`
            : "")
      )
      .then(async (content) => {
        if (content == "success") {
          // console.log("*********** success mainCanvasJson ************");
          await parsePage(3, pageName, jsonObjects, 0);
          await endFile(pageName, layoutName);
        }
      });
  }
}

async function createFinalPage(
  appFilesPath,
  filePath,
  fileName,
  layoutId,
  layoutName
) {
  // console.log(`layout name - ${layoutName}`)
  // let layoutName = await commonUtilsAndroid.getLayoutNameByPageId(layoutId);
  let pageName = `${appFilesPath}/${fileName}/${fileName}Screen.kt`;
  if (layoutName === "") {
    await readWriteFile.writeToFile(
      pageName,
      `import ${commonUtils.android_project_package_name}.presentation.pages.${fileName}.${fileName}\n` +
        `import ${commonUtils.android_project_package_name}.presentation.layouts.${fileName}.${fileName}\n` +
        `import androidx.navigation.NavHostController\n` +
        `import androidx.compose.runtime.Composable\n\n\n` +
        `@Composable \n` +
        `fun ${fileName}Screen (navController: NavHostController) {\n` +
        ` `.repeat(3) +
        `${fileName}(navController = navController)\n` +
        `}\n`
    );
  } else {
    await readWriteFile.writeToFile(
      pageName,
      `import ${commonUtils.android_project_package_name}.presentation.layouts.${layoutName}.${layoutName}\n` +
        `import ${commonUtils.android_project_package_name}.presentation.pages.${fileName}.${fileName}\n\n\n` +
        `import androidx.navigation.NavHostController\n` +
        `import androidx.compose.runtime.Composable\n\n\n` +
        `@Composable \n` +
        `fun ${fileName}Screen (navController: NavHostController) {\n` +
        " ".repeat(3) +
        `${layoutName}(navController = navController) {\n` +
        " ".repeat(5) +
        `${fileName}(navController = navController)\n` +
        " ".repeat(3) +
        `}\n` +
        `}\n`
    );
  }
}

async function parsePage(startingColum, fileName, jsonObjects, index) {
  // console.log(`jsonObjects - ${fileName}: ${JSON.stringify(jsonObjects)}`);
  let parantWidth = 0.0;
  let parantHeight = 0.0;
  // console.log(`jsonObject page2 -> ${JSON.stringify(jsonObjects)}`);
  for (const index in jsonObjects) {
    var jsonObj = jsonObjects[index];
    await createPageDesign.pageDesign(
      startingColum,
      fileName,
      jsonObj,
      parantWidth,
      parantHeight,
      "page"
    );
  }
}

async function endFile(pageName, layoutName) {
  await readWriteFile.writeToFile(
    pageName,
    (layoutName !== ""
      ? "\n" + " ".repeat(3) + ") \n" + " ".repeat(1) + ")"
      : "") + "\n}"
  );
  await readWriteFile.replaceWordInFile(pageName, "[import_files]", "");
}

module.exports = {
  parsePageContent,
  page,
};
