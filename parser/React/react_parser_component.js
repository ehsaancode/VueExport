const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./react_create_page_design");
const commonUtils = require("../../utility/common_utils");
const commonPath = require("../../utility/common_path");
const apiService = require("../../API_Service/api_service");
const apiStatesService = require("../../API_Service/states_service");
const homeController = require("./react_parser_home_controller");
const commonUtilsReact = require("./common_utilits_react");
const mapperService = require("../../API_Service/mapper_service");
const reactjsMapper = require("../../mapper/reactjs/reactjs_mapper");
const batchProcessor = require("../../utility/batche_process");
const parserScene = require("./react_parser_scene");
const projectMetadata = require("../../utility/project_metadata");
const stateHandler = require("../../utility/state_handler");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const reactProjectPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectPath.get(commonPath.environmentHosting)}`
);

async function parseComponent(
  objects,
  projectId,
  pageId,
  slug,
  jsonPath,
  componentName,
  defaultSceneName,
  component
) {
  commonUtils.pageId = pageId;
  commonUtils.projectId = projectId;
  let jsonObjects = objects?.scene ?? [];
  // console.log(`Total pages to process: ${jsonObjects.length}`);
  if (!Array.isArray(jsonObjects) || jsonObjects.length === 0) {
    console.log("No pages found in project or invalid pages data");
    return;
  }
  let projectPagePath = `${reactProjectPath}/${projectId}/react_project/src/${component}/${componentName}`;
  await readWriteFile.createFolderIfNotExists(projectPagePath);

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
            componentName,
            updatedPageName,
            component
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

  await desktopLayout(
    jsonObjects,
    projectId,
    componentName,
    defaultSceneName,
    component,
    pageId
  );
  await tabletLayout(
    jsonObjects,
    projectId,
    componentName,
    defaultSceneName,
    component,
    pageId
  );
  await mobileLayout(
    jsonObjects,
    projectId,
    componentName,
    defaultSceneName,
    component,
    pageId
  );
  await indexPage(projectId, componentName, component);
}

async function indexPage(projectId, componentName, component) {
  let subProjectPath = projectId;
  let layoutPathDesktop = `${reactProjectPath}/${subProjectPath}/react_project/src/${component}/${componentName}/Desktop/${componentName}.jsx`;
  let layoutPathMobile = `${reactProjectPath}/${subProjectPath}/react_project/src/${component}/${componentName}/Mobile/${componentName}.jsx`;
  let layoutPathIndex = `${reactProjectPath}/${subProjectPath}/react_project/src/${component}/${componentName}/${componentName}_index.jsx`;

  const data = {
    LayoutTitle: componentName,
    importDesktopLayout: (await readWriteFile.fileExists(layoutPathDesktop))
      ? `import("./Desktop/${componentName}")
      .then((mod) => setDesktopSkeleton(() => mod.default))
      .catch(() => setDesktopSkeleton(null));`
      : "",
    importMobileLayout: (await readWriteFile.fileExists(layoutPathMobile))
      ? `import("./Mobile/${componentName}")
      .then((mod) => setMobileSkeleton(() => mod.default))
      .catch(() => setMobileSkeleton(null));`
      : "",
  };

  // Read the Handlebars template from a file
  let projectTemplatePath = `${reactProjectPath}/${subProjectPath}/template`;
  let templatePath = `${projectTemplatePath}/main_layout_index.hbs`;
  const templateString = fs.readFileSync(templatePath, "utf8");

  // Compile the template
  const template = handlebars.compile(templateString);

  // Render the template with data
  const output = template(data);

  // Ensure the directory exists before writing the file
  const pageDir = path.dirname(layoutPathIndex);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  // Write the rendered output to a file (remove the callback for sync operation)
  try {
    fs.writeFileSync(layoutPathIndex, output, "utf8");
    // console.log(`File has been written successfully: ${layoutPathIndex}`);
  } catch (err) {
    console.error("Error writing file:", err);
    throw err; // Re-throw to handle the error upstream
  }
}

async function desktopLayout(
  jsonObjects,
  projectId,
  componentName,
  currentSceneName,
  component,
  pageId
) {
  let subProjectPath = projectId;
  let layoutPathDesktop = `${reactProjectPath}/${subProjectPath}/react_project/src/${component}/${componentName}/Desktop/${componentName}.jsx`;

  const data = {
    importScenes: jsonObjects.map((scene) => ({
      sceneName: commonUtils.toPascalCase(
        scene["cms_page_Name"].replace(" ", "_").replace(/-/g, "_")
      ),
    })),
    pageName: componentName,
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
  const pageDir = path.dirname(layoutPathDesktop);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  // Write the rendered output to a file (remove the callback for sync operation)
  try {
    fs.writeFileSync(layoutPathDesktop, output, "utf8");

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
      layoutPathDesktop,
      "[page_states]",
      pageStates
    );
  } catch (err) {
    console.error("Error writing file:", err);
    throw err; // Re-throw to handle the error upstream
  }
}

async function tabletLayout(
  jsonObjects,
  projectId,
  componentName,
  currentSceneName,
  component,
  pageId
) {
  let subProjectPath = projectId;
  let layoutPathMobile = `${reactProjectPath}/${subProjectPath}/react_project/src/${component}/${componentName}/Tablet/${componentName}.jsx`;

  const data = {
    importScenes: jsonObjects.map((scene) => ({
      sceneName: commonUtils.toPascalCase(
        scene["cms_page_Name"].replace(" ", "_").replace(/-/g, "_")
      ),
    })),
    pageName: componentName,
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
  const pageDir = path.dirname(layoutPathMobile);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  // Write the rendered output to a file (remove the callback for sync operation)
  try {
    fs.writeFileSync(layoutPathMobile, output, "utf8");

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
      layoutPathMobile,
      "[page_states]",
      pageStates
    );
  } catch (err) {
    console.error("Error writing file:", err);
    throw err; // Re-throw to handle the error upstream
  }
}

async function mobileLayout(
  jsonObjects,
  projectId,
  componentName,
  currentSceneName,
  component,
  pageId
) {
  let subProjectPath = projectId;
  let layoutPathMobile = `${reactProjectPath}/${subProjectPath}/react_project/src/${component}/${componentName}/Mobile/${componentName}.jsx`;

  const data = {
    importScenes: jsonObjects.map((scene) => ({
      sceneName: commonUtils.toPascalCase(
        scene["cms_page_Name"].replace(" ", "_").replace(/-/g, "_")
      ),
    })),
    pageName: componentName,
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
  const pageDir = path.dirname(layoutPathMobile);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  // Write the rendered output to a file (remove the callback for sync operation)
  try {
    fs.writeFileSync(layoutPathMobile, output, "utf8");

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
      layoutPathMobile,
      "[page_states]",
      pageStates
    );
  } catch (err) {
    console.error("Error writing file:", err);
    throw err; // Re-throw to handle the error upstream
  }
}

/*
async function parseComponent(
  projectId,
  pageId,
  slug,
  jsonPath,
  component,
  componentName
) {
  commonUtils.pageId = pageId;
  const destination = slug.trim();
  const destinationFileName = destination.replace(/-/g, "_");
  const pascalCaseName = commonUtils.toPascalCase(destinationFileName);
  await desktopComponent(
    pascalCaseName,
    projectId,
    pageId,
    slug,
    jsonPath,
    component,
    componentName
  );
  await mobileComponent(
    pascalCaseName,
    projectId,
    pageId,
    slug,
    jsonPath,
    component,
    componentName
  );

  await indexPage(projectId, component, componentName);
}

async function indexPage(projectId, component, componentName) {
  let subProjectPath = projectId;
  let componentPathDesktop = `${reactProjectPath}/${subProjectPath}/react_project/src/${component}/${componentName}/${componentName}_desktop.jsx`;
  let componentPathMobile = `${reactProjectPath}/${subProjectPath}/react_project/src/${component}/${componentName}/${componentName}_mobile.jsx`;
  let componentPathIndex = `${reactProjectPath}/${subProjectPath}/react_project/src/${component}/${componentName}/${componentName}_index.jsx`;

  const data = {
    ComponentTitle: componentName,
    importDesktopComponent: (await readWriteFile.fileExists(
      componentPathDesktop
    ))
      ? `import("./${componentName}_desktop")
      .then((mod) => setDesktopComponent(() => mod.default))
      .catch(() => setDesktopComponent(null));`
      : "",
    importMobileComponent: (await readWriteFile.fileExists(componentPathMobile))
      ? `import("./${componentName}_mobile")
      .then((mod) => setMobileComponent(() => mod.default))
      .catch(() => setMobileComponent(null));`
      : "",
  };

  // Read the Handlebars template from a file
  let projectTemplatePath = `${reactProjectPath}/${subProjectPath}/template`;
  let templatePath = `${projectTemplatePath}/main_component_index.hbs`;
  const templateString = fs.readFileSync(templatePath, "utf8");

  // Compile the template
  const template = handlebars.compile(templateString);

  // Render the template with data
  const output = template(data);

  // Ensure the directory exists before writing the file
  const pageDir = path.dirname(componentPathIndex);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  // Write the rendered output to a file (remove the callback for sync operation)
  try {
    fs.writeFileSync(componentPathIndex, output, "utf8");
    console.log(`File has been written successfully: ${componentPathIndex}`);
  } catch (err) {
    console.error("Error writing file:", err);
    throw err; // Re-throw to handle the error upstream
  }
}

async function desktopComponent(
  fileName,
  projectId,
  pageId,
  slug,
  jsonPath,
  component,
  componentName
) {
  try {
    commonUtils.windowDevice = "D";
    let subProjectPath = projectId;
    let pageName = `${reactProjectPath}/${subProjectPath}/react_project/src/${component}/${componentName}/${componentName}_desktop.jsx`;
    await apiStatesService.fetchgetPageState(projectId, pageId, pageName, "D");
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
      await reactjsMapper.startMapper(projectId, pageId, pageName); // Clear previous actions
      console.log(`componentName: ${componentName}-D`);
      await parseDesktopComponent(
        fileName,
        projectId,
        pageId,
        `${jsonPath}/${slug}_D.json`,
        component,
        componentName
      );
      console.log(`componentName end: ${componentName}-D`);
      await endActionmapper(pageName);
    } else {
      console.log("fetchPageJson failed:", pageContent);
    }
  } catch (error) {
    console.error("Error in run:", error);
  }
}

async function parseDesktopComponent(
  fileName,
  projectId,
  pageId,
  filePath,
  component,
  componentName
) {
  let subProjectPath = projectId;
  await delete require.cache[require.resolve(filePath)];
  let objects = await require(filePath);
  let jsonObjects = objects?.data?.children ?? "";
  if (jsonObjects?.length > 0) {
    const jsonObject = jsonObjects[0];
    let pageName = `${reactProjectPath}/${subProjectPath}/react_project/src/${component}/${componentName}/${componentName}_desktop.jsx`;
    let projectTemplatePath = `${reactProjectPath}/${subProjectPath}/template`;
    let sourceTopPage = `${projectTemplatePath}/componentTopTemplate.txt`;
    await readWriteFile.copyPasteFileContent(sourceTopPage, pageName);
    await readWriteFile.replaceWordInFile(
      pageName,
      `export const createTemplate`,
      `export const ${componentName}_desktop`
    );

    await readWriteFile.writeToFile(pageName, "").then(async (content) => {
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
              await readWriteFile.writeToFile(pageName, "\n<>\n");


              // await readWriteFile.writeToFile(pageName, `\n${seoContent}\n`);
              await readWriteFile.writeToFile(pageName, "\n<QCustom>\n");

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
              //   fileName: pageName,
              //   writeToFile: true,
              // });

              await parseComponentObjects(
                projectId,
                pageId,
                5,
                pageName,
                objects["children"],
                0
              ).then(async (content) => {
                if (content == "success") {
                  await endFile(pageName);
                  let projectTemplatePath = `${reactProjectPath}/${subProjectPath}/template`;
                  let sourceBottomPage = `${projectTemplatePath}/componentBottomTemplate.txt`;
                  console.log(`sourceBottomPage: ${sourceBottomPage}`);
                  await readWriteFile.appendFileContent(
                    sourceBottomPage,
                    pageName
                  );
                  await readWriteFile.replaceWordInFile(
                    pageName,
                    `[class_name]`,
                    `${componentName}_desktop`
                  );
                }
              });
            }
          });
      }
    });
  }
}

async function mobileComponent(
  fileName,
  projectId,
  pageId,
  slug,
  jsonPath,
  component,
  componentName
) {
  try {
    commonUtils.windowDevice = "M";
    let subProjectPath = projectId;
    let pageName = `${reactProjectPath}/${subProjectPath}/react_project/src/${component}/${componentName}/${componentName}_mobile.jsx`;
    await apiStatesService.fetchgetPageState(projectId, pageId, pageName, "M");
    const projectMapperContent = await mapperService.fetchMapperJson(
      projectId,
      pageId,
      jsonPath,
      "M"
    );
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
      await reactjsMapper.startMapper(projectId, pageId, pageName); // Clear previous actions
      console.log(`componentName: ${componentName}-M`);
      await parseMobileComponent(
        fileName,
        projectId,
        pageId,
        `${jsonPath}/${slug}_M.json`,
        component,
        componentName
      );
      console.log(`componentName end: ${componentName}-M`);
      await endActionmapper(pageName);
    } else {
      console.log("fetchPageJson failed:", pageContent);
    }
  } catch (error) {
    console.error("Error in run:", error);
  }
}

async function parseMobileComponent(
  fileName,
  projectId,
  pageId,
  filePath,
  component,
  componentName
) {
  let subProjectPath = projectId;
  await delete require.cache[require.resolve(filePath)];
  let objects = await require(filePath);
  let jsonObjects = objects?.data?.children ?? "";
  if (jsonObjects?.length > 0) {
    const jsonObject = jsonObjects[0];
    let pageName = `${reactProjectPath}/${subProjectPath}/react_project/src/${component}/${componentName}/${componentName}_mobile.jsx`;
    let projectTemplatePath = `${reactProjectPath}/${subProjectPath}/template`;
    let sourceTopPage = `${projectTemplatePath}/componentTopTemplate.txt`;
    await readWriteFile.copyPasteFileContent(sourceTopPage, pageName);
    await readWriteFile.replaceWordInFile(
      pageName,
      `export const createTemplate`,
      `export const ${componentName}_mobile`
    );

    await readWriteFile.writeToFile(pageName, "").then(async (content) => {
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
              await readWriteFile.writeToFile(pageName, "\n<>\n");


              // await readWriteFile.writeToFile(pageName, `\n${seoContent}\n`);
              await readWriteFile.writeToFile(pageName, "\n<QCustom>\n");

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
              //   fileName: pageName,
              //   writeToFile: true,
              // });

              await parseComponentObjects(
                projectId,
                pageId,
                5,
                pageName,
                objects["children"],
                0
              ).then(async (content) => {
                if (content == "success") {
                  await endFile(pageName);
                  let projectTemplatePath = `${reactProjectPath}/${subProjectPath}/template`;
                  let sourceBottomPage = `${projectTemplatePath}/componentBottomTemplate.txt`;
                  console.log(`sourceBottomPage: ${sourceBottomPage}`);
                  await readWriteFile.appendFileContent(
                    sourceBottomPage,
                    pageName
                  );
                  await readWriteFile.replaceWordInFile(
                    pageName,
                    `[class_name]`,
                    `${componentName}_mobile`
                  );
                }
              });
            }
          });
      }
    });
  }
}*/

async function parseComponentObjects(
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

async function endFile(pageName) {
  await readWriteFile.writeToFile(pageName, "</QCustom></>");
  // await readWriteFile.writeToFile(pageName, "</QDiv></QCustom></>");
  await reactjsMapper.endFileActions(pageName);
  // await homeController.createAndUpdateHomeController();
  let importFiles = "";
  const metadata = projectMetadata.getInstance();
  const lastComponent = path.basename(pageName);
  const objects = metadata.getFilesFor(lastComponent);
  for (const value in objects) {
    importFiles += objects[value];
  }
  projectMetadata.removeAllFilesFor(lastComponent);

  // await readWriteFile.replaceWordInFile(pageName, "[import_files]", "");
  await readWriteFile.replaceWordInFile(
    pageName,
    "[import_files]",
    importFiles
  );
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
  parseComponent,
};
