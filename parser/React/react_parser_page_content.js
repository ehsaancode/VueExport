const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./react_create_page_design");
const commonUtils = require("../../utility/common_utils");
const commonPath = require("../../utility/common_path");
const apiService = require("../../API_Service/api_service");
const homeController = require("./react_parser_home_controller");
const commonUtilsReact = require("./common_utilits_react");
const mapperService = require("../../API_Service/mapper_service");
const apiStatesService = require("../../API_Service/states_service");
const reactjsMapper = require("../../mapper/reactjs/reactjs_mapper");
const batchProcessor = require("../../utility/batche_process");
const parserScene = require("./react_parser_scene");
const stateHandler = require("../../utility/state_handler");
const projectMetadata = require("../../utility/project_metadata");
const actionService = require("../../API_Service/action_service");

const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const reactProjectPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectPath.get(commonPath.environmentHosting)}`
);

async function parsePageContent(
  objects,
  projectId,
  pageId,
  slug,
  jsonPath,
  pageName,
  defaultSceneName
) {
  /*console.log(
    `parsePageContent called for defaultSceneName: ${defaultSceneName}`
  );*/
  commonUtils.pageId = pageId;
  commonUtils.projectId = projectId;
  let jsonObjects = objects?.scene ?? [];
  if (!Array.isArray(jsonObjects) || jsonObjects.length === 0) {
    console.log("No pages found in project or invalid pages data");
    return;
  }
  let projectPagePath = `${reactProjectPath}/${projectId}/react_project/src/pages/${pageName}`;
  await readWriteFile.createFolderIfNotExists(projectPagePath);
  await apiStatesService.fetchPageState(projectId, pageId);
  await actionService.fetchPageAction(projectId, pageId);

  // Add all destinations first (synchronous operation)
  /*jsonObjects.forEach((jsonObj) => {
    let page_id = jsonObj["cms_page_Id"];
    let slug = jsonObj["cms_page_Slug"];
    let isCurrentPage = false;
    homeController.addDestinations(`${slug}`, isCurrentPage);
  });
*/
  // Choose processing method based on your needs
  const USE_BATCH_PROCESSING = true; // Set to false for sequential processing
  let processingResults;

  if (USE_BATCH_PROCESSING) {
    // Process pages in batches with enhanced error handling
    processingResults = await batchProcessor.processPagesInBatches(
      jsonObjects,
      1, // Reduced batch size for better reliability
      async (jsonObj, index) => {
        let sceneId = jsonObj["cms_page_Id"];
        let sceneName = jsonObj["cms_page_Name"].replace(" ", "_");
        const refPageName = sceneName.replace(/-/g, "_");
        const updatedPageName = commonUtils.toPascalCase(refPageName);
        let slug = jsonObj["cms_page_Slug"];
        try {
          // Add small delay before each page processing within batch
          if (index > 0) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          const result = await parserScene.parsePageContent(
            projectId,
            sceneId,
            slug,
            jsonPath,
            pageName,
            updatedPageName
          );

          return { success: true, slug, sceneId, result };
        } catch (error) {
          console.error(
            `Error processing page ${jsonObj.cms_page_Slug}:`,
            error
          );
          throw error; // Re-throw to be caught by Promise.allSettled
        }
      }
    );
  } else {
    // Sequential processing (more reliable but slower)
    processingResults = await this.processPageSequentially(jsonObjects, 400); // 400ms delay
  }

  // Log final results
  const successful = Array.isArray(processingResults)
    ? processingResults.filter((r) => r?.success !== false && !r?.error).length
    : 0;
  const failed = Array.isArray(processingResults)
    ? processingResults.filter((r) => r?.success === false || r?.error).length
    : 0;

  // List failed pages for debugging
  const failedPages = Array.isArray(processingResults)
    ? processingResults.filter((r) => r?.success === false || r?.error)
    : [];
  if (failedPages.length > 0) {
    console.log(
      "Failed pages:",
      failedPages.map((p) => p?.slug || p?.page).join(", ")
    );
  }

  // Create home controller after all pages are processed
  /*let defaultPageId = objects?.data?.default?.default_page ?? 0;
  const defaultPage = jsonObjects.find(
    (page) => page.cms_page_Id === defaultPageId
  );
  // const defaultSlug = defaultPage?.cms_page_Slug ?? "";
  let currentPageView = commonUtils.currentPage ?? "";
  const defaultSlug =
    currentPageView.length > 0
      ? currentPageView
      : defaultPage?.cms_page_Slug ?? "";*/

  // await homeController.createAndUpdateHomeController(defaultSlug);

  await desktopPage(jsonObjects, projectId, pageName, defaultSceneName, pageId);
  await tabletPage(jsonObjects, projectId, pageName, defaultSceneName, pageId);
  await mobilePage(jsonObjects, projectId, pageName, defaultSceneName, pageId);
  await indexPage(projectId, pageName);
  /*commonUtils.pageId = pageId;
  const destination = slug.trim();
  const destinationFileName = destination.replace(/-/g, "_");
  const pascalCaseName = commonUtils.toPascalCase(destinationFileName);
  await desktopPage(
    jsonObjects,
    pascalCaseName,
    projectId,
    pageId,
    slug,
    jsonPath,
    pageName,
    defaultSceneName
  );
  await mobilePage(
    jsonObjects,
    pascalCaseName,
    projectId,
    pageId,
    slug,
    jsonPath,
    pageName
  );
  await indexPage(projectId, pageName);*/

  // return { success: true, slug, sceneId, result };
}

async function indexPage(projectId, pageName) {
  let subProjectPath = projectId;
  let pagePathDesktop = `${reactProjectPath}/${subProjectPath}/react_project/src/pages/${pageName}/Desktop/${pageName}.jsx`;
  let pagePathTablet = `${reactProjectPath}/${subProjectPath}/react_project/src/pages/${pageName}/Tablet/${pageName}.jsx`;
  let pagePathMobile = `${reactProjectPath}/${subProjectPath}/react_project/src/pages/${pageName}/Mobile/${pageName}.jsx`;
  let pagePathIndex = `${reactProjectPath}/${subProjectPath}/react_project/src/pages/${pageName}/${pageName}_index.jsx`;

  const data = {
    importDesktopPage: (await readWriteFile.fileExists(pagePathDesktop))
      ? `import ${pageName}_desktop from \"./Desktop/${pageName}\";`
      : "",

    importTabletPage: (await readWriteFile.fileExists(pagePathTablet))
      ? `import ${pageName}_tablet from \"./Tablet/${pageName}\";`
      : "",

    importMobilePage: (await readWriteFile.fileExists(pagePathMobile))
      ? `import ${pageName}_mobile from \"./Mobile/${pageName}\";`
      : "",
    Page: pageName,
    DesktopPage: `<${pageName}_desktop/>`,

    TabPage: `<${pageName}_tablet/>`,

    MobilePage: `<${pageName}_mobile/>`,
  };

  // Read the Handlebars template from a file
  let projectTemplatePath = `${reactProjectPath}/${subProjectPath}/template`;
  let templatePath = `${projectTemplatePath}/main_page_index.hbs`;
  const templateString = fs.readFileSync(templatePath, "utf8");

  // Compile the template
  const template = handlebars.compile(templateString);

  // Render the template with data
  const output = template(data);

  // Ensure the directory exists before writing the file
  const pageDir = path.dirname(pagePathIndex);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  // Write the rendered output to a file (remove the callback for sync operation)
  try {
    fs.writeFileSync(pagePathIndex, output, "utf8");
    // console.log(`File has been written successfully: ${pagePathIndex}`);
  } catch (err) {
    console.error("Error writing file:", err);
    throw err; // Re-throw to handle the error upstream
  }
}

async function desktopPage(
  jsonObjects,
  // fileName,
  projectId,
  // pageId,
  // slug,
  // jsonPath,
  pageName,
  currentSceneName,
  pageId
) {
  let subProjectPath = projectId;
  let pagePathDesktop = `${reactProjectPath}/${subProjectPath}/react_project/src/pages/${pageName}/Desktop/${pageName}.jsx`;

  const data = {
    importScenes: jsonObjects.map((scene) => ({
      sceneName: commonUtils.toPascalCase(
        scene["cms_page_Name"].replace(" ", "_").replace(/-/g, "_")
      ),
    })),
    pageName: pageName,
    currentSceneName: currentSceneName,
    scenes: jsonObjects.map((scene) => ({
      sceneName: commonUtils.toPascalCase(
        scene["cms_page_Name"].replace(" ", "_").replace(/-/g, "_")
      ),
    })),
  };

  // Read the Handlebars template from a file
  let projectTemplatePath = `${reactProjectPath}/${subProjectPath}/template`;
  let templatePath = `${projectTemplatePath}/main_page.hbs`;
  const templateString = fs.readFileSync(templatePath, "utf8");

  // Compile the template
  const template = handlebars.compile(templateString);

  // Render the template with data
  const output = template(data);

  // Ensure the directory exists before writing the file
  const pageDir = path.dirname(pagePathDesktop);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  // Write the rendered output to a file (remove the callback for sync operation)
  try {
    fs.writeFileSync(pagePathDesktop, output, "utf8");

    const handler = stateHandler.getInstance();
    let pageStateInfo = handler.getFilesFor(String(pageId));

    let pageStates = "";
    // Loop through ALL items inside pageStateInfo
    for (const info of pageStateInfo) {
      let value = info.defaultValue;

      // ------------------------------
      // TYPE HANDLING FOR defaultValue
      // ------------------------------
      if (Array.isArray(value)) {
        value = JSON.stringify(value); // → []
      } else if (value && typeof value === "object") {
        value = JSON.stringify(value); // → {}
      } else if (typeof value === "string") {
        // Trim spaces
        const trimmed = value.trim();

        // If it looks like a number, boolean, array, object → no quotes
        const looksJson =
          trimmed === "true" ||
          trimmed === "false" ||
          !isNaN(trimmed) ||
          (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
          (trimmed.startsWith("[") && trimmed.endsWith("]"));

        if (!looksJson) {
          value = `"${value}"`; // Normal string like "#3B1706" or "Helo txt"
        }
      } else {
        // number, boolean primitive
        value = JSON.stringify(value);
      }

      // ------------------------------
      // Final generated useState line
      // ------------------------------
      pageStates += `const [${info.name}, ${info.setMethodName}] = useState(${value});\n`;
    }
    // Write to file
    await readWriteFile.replaceWordInFile(
      pagePathDesktop,
      "[page_states]",
      pageStates
    );
    await reactjsMapper.startReactjsMapper(
      projectId,
      pageId,
      pagePathDesktop,
      pageId
    );
  } catch (err) {
    console.error("Error writing file:", err);
    throw err; // Re-throw to handle the error upstream
  }
  /*try {
    commonUtils.windowDevice = "D";
    let subProjectPath = projectId;
    let pageName2 = `${reactProjectPath}/${subProjectPath}/react_project/src/pages/${pageName}/Desktop/${pageName}.jsx`;
    await apiStatesService.fetchgetPageState(projectId, pageId, pageName2, "D");
    const projectMapperContent = await mapperService.fetchMapperJson(
      projectId,
      pageId,
      jsonPath,
      "D"
    );
    const pageContent = await apiService.fetchPageJson(
      fileName,
      slug,
      "D",
      projectId,
      pageId,
      `${commonUtils.screenSizeAndroid().width}x${
        commonUtils.screenSizeAndroid().height
      }`,
      commonUtils.environment,
      jsonPath
    );
    if (pageContent === "success") {
      await reactjsMapper.startMapper(projectId, pageId, pageName2); // Clear previous actions
      console.log(`pageName: ${pageName}-D`);
      await parseDesktopPage(
        fileName,
        projectId,
        pageId,
        `${jsonPath}/${slug}_D.json`,
        pageName,
        slug
      );
      console.log(`pageName end: ${pageName}-D`);
      await endActionmapper(pageName2);
    } else {
      console.log("fetchPageJson failed:", pageContent);
    }
  } catch (error) {
    console.error("Error in run:", error);
  }*/
  await reactjsMapper.endReactjsMapper(
    projectId,
    pageId,
    pagePathDesktop,
    pageId
  );
}

async function parseDesktopPage(
  fileName,
  projectId,
  pageId,
  filePath,
  pageName,
  slug
) {
  let subProjectPath = projectId;
  // if (commonUtils.pageId > 0) {
  //   subProjectPath = `${commonUtils.pageId}`;
  // } else {
  //   subProjectPath = `${commonUtils.projectId}`;
  // }
  console.log(`parseDesktopPage pageName: ${pageName}`);
  await delete require.cache[require.resolve(filePath)];
  let objects = await require(filePath);
  let jsonObjects = objects?.data?.children ?? "";
  if (jsonObjects?.length > 0) {
    let pagePath = `${reactProjectPath}/${subProjectPath}/react_project/src/pages/${pageName}/${pageName}_desktop.jsx`;
    // console.log(`pagePath: ${pagePath}`);
    let projectTemplatePath = `${reactProjectPath}/${subProjectPath}/template`;
    let sourceTopPage = `${projectTemplatePath}/pageTopTemplate.txt`;
    await readWriteFile.copyPasteFileContent(sourceTopPage, pagePath);
    await readWriteFile.replaceWordInFile(
      pagePath,
      `export const createTemplate`,
      `export const ${fileName}_desktop`
    );

    const jsonObject = jsonObjects[0];
    await readWriteFile.writeToFile(pagePath, "").then(async (content) => {
      if (content == "success") {
        let mainCanvasJson = "./created_files/common_private/main_canvas.json";
        await readWriteFile.deleteFile(mainCanvasJson);

        // const objects = jsonObject; //["data"]["children"][0];
        //["pageContent"]["pageJson"]["template"]["children"][0];
        var width = 0; //objects["width"] != null ? objects["width"] : `0.0`;
        var height = 0; // objects["height"] != null ? objects["height"] : `0.0`;

        // var screenWidth = objects["screenWidth"] != null ? objects["screenWidth"] : 0.0;
        // var screenHeight = objects["screenHeight"] != null ? objects["screenHeight"] : 0.0;
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
              `\"bgColor\": \"#FFFFFF\" \n` +
              "}"
          )
          .then(async (content) => {
            if (content == "success") {
              // await readWriteFile.writeToFile(pagePath, "\n<>\n");

              // var seoContent = await commonUtils.generateSCO();

              // await readWriteFile.writeToFile(pagePath, `\n${seoContent}\n`);

              // // await commonUtilsReact.generateJSX({
              // //   componentName: "QDiv",
              // //   isSelfClosing: false,
              // //   props: await commonUtilsReact.componentProps(
              // //     objects,
              // //     "",
              // //     "",
              // //     "",
              // //     "",
              // //     ""
              // //   ),
              // //   startingIndent: 1,
              // //   fileName: pagePath,
              // //   writeToFile: true,
              // // });
              await readWriteFile.writeToFile(pagePath, "\n<>\n");

              // await commonUtilsReact.generateJSX({
              //   componentName: "QDiv",
              //   isSelfClosing: false,
              //   props: await commonUtilsReact.componentProps(
              //     objects,
              //     "",
              //     "",
              //     "",
              //     "",
              //     ""
              //   ),
              //   startingIndent: 1,
              //   fileName: pagePath,
              //   writeToFile: true,
              // });

              await parsePage(
                projectId,
                pageId,
                5,
                pagePath,
                jsonObjects,
                // objects["children"],
                0
              ).then(async (content) => {
                if (content == "success") {
                  await endFile(pagePath);
                  let projectTemplatePath = `${reactProjectPath}/${subProjectPath}/template`;
                  let sourceBottomPage = `${projectTemplatePath}/pageBottomTemplate.txt`;
                  // console.log(`sourceBottomPage: ${sourceBottomPage}`);
                  await readWriteFile.appendFileContent(
                    sourceBottomPage,
                    pagePath
                  );
                  await readWriteFile.replaceWordInFile(
                    pagePath,
                    `[class_name]`,
                    `${fileName}_desktop`
                  );
                  let importFiles = "";
                  const metadata = projectMetadata.getInstance();
                  const lastComponent = path.basename(pagePath);
                  const objects = metadata.getFilesFor(lastComponent);
                  for (const value in objects) {
                    importFiles += objects[value];
                  }
                  projectMetadata.removeAllFilesFor(lastComponent);

                  await readWriteFile.replaceWordInFile(
                    pagePath,
                    "[import_files]",
                    importFiles
                  );
                }
              });
            }
          });
      }
    });
  }
}

async function tabletPage(
  jsonObjects,
  // fileName,
  projectId,
  // pageId,
  // slug,
  // jsonPath,
  pageName,
  currentSceneName,
  pageId
) {
  let subProjectPath = projectId;
  let pagePathDesktop = `${reactProjectPath}/${subProjectPath}/react_project/src/pages/${pageName}/Tablet/${pageName}.jsx`;

  const data = {
    importScenes: jsonObjects.map((scene) => ({
      sceneName: commonUtils.toPascalCase(
        scene["cms_page_Name"].replace(" ", "_").replace(/-/g, "_")
      ),
    })),
    pageName: pageName,
    currentSceneName: currentSceneName,
    scenes: jsonObjects.map((scene) => ({
      sceneName: commonUtils.toPascalCase(
        scene["cms_page_Name"].replace(" ", "_").replace(/-/g, "_")
      ),
    })),
  };

  // Read the Handlebars template from a file
  let projectTemplatePath = `${reactProjectPath}/${subProjectPath}/template`;
  let templatePath = `${projectTemplatePath}/main_page.hbs`;
  const templateString = fs.readFileSync(templatePath, "utf8");

  // Compile the template
  const template = handlebars.compile(templateString);

  // Render the template with data
  const output = template(data);

  // Ensure the directory exists before writing the file
  const pageDir = path.dirname(pagePathDesktop);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  // Write the rendered output to a file (remove the callback for sync operation)
  try {
    fs.writeFileSync(pagePathDesktop, output, "utf8");

    const handler = stateHandler.getInstance();
    let pageStateInfo = handler.getFilesFor(String(pageId));

    let pageStates = "";
    // Loop through ALL items inside pageStateInfo
    for (const info of pageStateInfo) {
      let value = info.defaultValue;

      // ------------------------------
      // TYPE HANDLING FOR defaultValue
      // ------------------------------
      if (Array.isArray(value)) {
        value = JSON.stringify(value); // → []
      } else if (value && typeof value === "object") {
        value = JSON.stringify(value); // → {}
      } else if (typeof value === "string") {
        // Trim spaces
        const trimmed = value.trim();

        // If it looks like a number, boolean, array, object → no quotes
        const looksJson =
          trimmed === "true" ||
          trimmed === "false" ||
          !isNaN(trimmed) ||
          (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
          (trimmed.startsWith("[") && trimmed.endsWith("]"));

        if (!looksJson) {
          value = `"${value}"`; // Normal string like "#3B1706" or "Helo txt"
        }
      } else {
        // number, boolean primitive
        value = JSON.stringify(value);
      }

      // ------------------------------
      // Final generated useState line
      // ------------------------------
      pageStates += `const [${info.name}, ${info.setMethodName}] = useState(${value});\n`;
    }
    // Write to file
    await readWriteFile.replaceWordInFile(
      pagePathDesktop,
      "[page_states]",
      pageStates
    );

    await reactjsMapper.startReactjsMapper(
      projectId,
      pageId,
      pagePathDesktop,
      pageId
    );
  } catch (err) {
    console.error("Error writing file:", err);
    throw err; // Re-throw to handle the error upstream
  }
  await reactjsMapper.endReactjsMapper(
    projectId,
    pageId,
    pagePathDesktop,
    pageId
  );
}

async function mobilePage(
  jsonObjects,
  // fileName,
  projectId,
  // pageId,
  // slug,
  // jsonPath,
  pageName,
  currentSceneName,
  pageId
) {
  let subProjectPath = projectId;
  let pagePathDesktop = `${reactProjectPath}/${subProjectPath}/react_project/src/pages/${pageName}/Mobile/${pageName}.jsx`;

  const data = {
    importScenes: jsonObjects.map((scene) => ({
      sceneName: commonUtils.toPascalCase(
        scene["cms_page_Name"].replace(" ", "_").replace(/-/g, "_")
      ),
    })),
    pageName: pageName,
    currentSceneName: currentSceneName,
    scenes: jsonObjects.map((scene) => ({
      sceneName: commonUtils.toPascalCase(
        scene["cms_page_Name"].replace(" ", "_").replace(/-/g, "_")
      ),
    })),
  };

  // Read the Handlebars template from a file
  let projectTemplatePath = `${reactProjectPath}/${subProjectPath}/template`;
  let templatePath = `${projectTemplatePath}/main_page.hbs`;
  const templateString = fs.readFileSync(templatePath, "utf8");

  // Compile the template
  const template = handlebars.compile(templateString);

  // Render the template with data
  const output = template(data);

  // Ensure the directory exists before writing the file
  const pageDir = path.dirname(pagePathDesktop);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  // Write the rendered output to a file (remove the callback for sync operation)
  try {
    fs.writeFileSync(pagePathDesktop, output, "utf8");

    const handler = stateHandler.getInstance();
    let pageStateInfo = handler.getFilesFor(String(pageId));

    let pageStates = "";
    // Loop through ALL items inside pageStateInfo
    for (const info of pageStateInfo) {
      let value = info.defaultValue;

      // ------------------------------
      // TYPE HANDLING FOR defaultValue
      // ------------------------------
      if (Array.isArray(value)) {
        value = JSON.stringify(value); // → []
      } else if (value && typeof value === "object") {
        value = JSON.stringify(value); // → {}
      } else if (typeof value === "string") {
        // Trim spaces
        const trimmed = value.trim();

        // If it looks like a number, boolean, array, object → no quotes
        const looksJson =
          trimmed === "true" ||
          trimmed === "false" ||
          !isNaN(trimmed) ||
          (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
          (trimmed.startsWith("[") && trimmed.endsWith("]"));

        if (!looksJson) {
          value = `"${value}"`; // Normal string like "#3B1706" or "Helo txt"
        }
      } else {
        // number, boolean primitive
        value = JSON.stringify(value);
      }

      // ------------------------------
      // Final generated useState line
      // ------------------------------
      pageStates += `const [${info.name}, ${info.setMethodName}] = useState(${value});\n`;
    }
    // Write to file
    await readWriteFile.replaceWordInFile(
      pagePathDesktop,
      "[page_states]",
      pageStates
    );

    await reactjsMapper.startReactjsMapper(
      projectId,
      pageId,
      pagePathDesktop,
      pageId
    );
  } catch (err) {
    console.error("Error writing file:", err);
    throw err; // Re-throw to handle the error upstream
  }
  await reactjsMapper.endReactjsMapper(
    projectId,
    pageId,
    pagePathDesktop,
    pageId
  );
}

async function parseMobilePage(
  fileName,
  projectId,
  pageId,
  filePath,
  pageName
) {
  let subProjectPath = projectId;
  await delete require.cache[require.resolve(filePath)];
  let objects = await require(filePath);
  let jsonObjects = objects?.data?.children ?? "";
  if (jsonObjects?.length > 0) {
    const jsonObject = jsonObjects[0];
    let pagePath = `${reactProjectPath}/${subProjectPath}/react_project/src/pages/${pageName}/${pageName}_mobile.jsx`;
    let projectTemplatePath = `${reactProjectPath}/${subProjectPath}/template`;
    let sourceTopPage = `${projectTemplatePath}/pageTopTemplate.txt`;
    await readWriteFile.copyPasteFileContent(sourceTopPage, pagePath);
    await readWriteFile.replaceWordInFile(
      pagePath,
      `export const createTemplate`,
      `export const ${fileName}_mobile`
    );

    await readWriteFile.writeToFile(pagePath, "").then(async (content) => {
      if (content == "success") {
        let mainCanvasJson = "./created_files/common_private/main_canvas.json";
        await readWriteFile.deleteFile(mainCanvasJson);

        const objects = jsonObject; //["data"]["children"][0];
        //["pageContent"]["pageJson"]["template"]["children"][0];
        var width = 0; //objects["width"] != null ? objects["width"] : `0.0`;
        var height = 0; // objects["height"] != null ? objects["height"] : `0.0`;

        // var screenWidth = objects["screenWidth"] != null ? objects["screenWidth"] : 0.0;
        // var screenHeight = objects["screenHeight"] != null ? objects["screenHeight"] : 0.0;
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
              `\"bgColor\": \"#FFFFFF\" \n` +
              "}"
          )
          .then(async (content) => {
            if (content == "success") {
              await readWriteFile.writeToFile(pagePath, "\n<>\n");

              // await commonUtilsReact.generateJSX({
              //   componentName: "QDiv",
              //   isSelfClosing: false,
              //   props: await commonUtilsReact.componentProps(
              //     objects,
              //     "",
              //     "",
              //     "",
              //     "",
              //     ""
              //   ),
              //   startingIndent: 1,
              //   fileName: pagePath,
              //   writeToFile: true,
              // });

              await parsePage(
                projectId,
                pageId,
                5,
                pagePath,
                objects["children"],
                0
              ).then(async (content) => {
                if (content == "success") {
                  await endFile(pagePath);
                  let projectTemplatePath = `${reactProjectPath}/${subProjectPath}/template`;
                  let sourceBottomPage = `${projectTemplatePath}/pageBottomTemplate.txt`;
                  // console.log(`sourceBottomPage: ${sourceBottomPage}`);
                  await readWriteFile.appendFileContent(
                    sourceBottomPage,
                    pagePath
                  );
                  await readWriteFile.replaceWordInFile(
                    pagePath,
                    `[class_name]`,
                    `${fileName}_mobile`
                  );
                  let importFiles = "";
                  const metadata = projectMetadata.getInstance();
                  const lastComponent = path.basename(pagePath);
                  const objects = metadata.getFilesFor(lastComponent);
                  for (const value in objects) {
                    importFiles += objects[value];
                  }
                  projectMetadata.removeAllFilesFor(lastComponent);
                  await readWriteFile.replaceWordInFile(
                    pagePath,
                    "[import_files]",
                    importFiles
                  );
                }
              });
            }
          });
      }
    });
  }
}

async function parsePage(
  projectId,
  pageId,
  startingColum,
  fileName,
  jsonObjects,
  index
) {
  try {
    // let mainCanvasJsonFile =
    ("../.././created_files/common_private/main_canvas.json");
    // const mainCanvasObject = require(mainCanvasJsonFile);
    // let parantWidth = mainCanvasObject["screenWidth"];
    // let parantHeight = mainCanvasObject["screenHeight"];
    let parantWidth = '"100%"';
    let parantHeight = '"100%"';
    for (const index in jsonObjects) {
      var jsonObj = jsonObjects[index];
      await createPageDesign.pageDesign(
        projectId,
        pageId,
        startingColum,
        fileName,
        jsonObj,
        parantWidth,
        parantHeight
      );
    }
    return "success";
  } catch (err) {
    console.error(err);
    return "failure";
  }
}

async function endFile(pagePath) {
  await readWriteFile.writeToFile(pagePath, "</>");
  await reactjsMapper.endFileActions(pagePath);
  // await homeController.createAndUpdateHomeController();
  //   await readWriteFile.replaceWordInFile(pageName, "[import_files]", '');
}

async function endActionmapper(pageName, pageId) {
  await reactjsMapper.endMapper(pageName, pageId);
  await readWriteFile.replaceWordInFile(pageName, "[onload_useEffect]", "\n");
  await readWriteFile.replaceWordInFile(pageName, "[action_variable]", "\n");
  await readWriteFile.replaceWordInFile(pageName, "[action_method]", "");
  await readWriteFile.replaceWordInFile(pageName, "[action_actions]", "");
  await readWriteFile.replaceWordInFile(pageName, "[action_imports]", "");
}

module.exports = {
  parsePageContent,
  parseDesktopPage,
};
