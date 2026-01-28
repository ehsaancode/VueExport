const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./vue_create_page_design");
const commonUtils = require("../../utility/common_utils");
const commonPath = require("../../utility/common_path");
const reactJsMapper = require("../../mapper/vuejs/vuejs_mapper");
const apiService = require("../../API_Service/api_service");
const apiStatesService = require("../../API_Service/states_service");
const actionService = require("../../API_Service/action_service");
const homeController = require("./vue_parser_home_controller");
const commonUtilsReact = require("./common_utilits_vue");
const mapperService = require("../../API_Service/mapper_service");
//const reactjsMapper = require("../../mapper/vuejs/vuejs_mapper");
const projectMetadata = require("../../utility/project_metadata");
const stateHandler = require("../../utility/state_handler");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const vueProjectPath = path.resolve(
  __dirname,
  `${commonPath.vueProjectPath.get(commonPath.environmentHosting)}`
);

async function parsePageContent(
  projectId,
  sceneId,
  slug,
  jsonPath,
  pageName,
  sceneName,
  sceneParentType = "pages"
) {
  commonUtils.projectId = projectId;
  commonUtils.pageId = sceneId;
  const destination = slug.trim();
  const destinationFileName = destination.replace(/-/g, "_");
  const pascalCaseName = commonUtils.toPascalCase(destinationFileName);
  await apiStatesService.fetchPageState(projectId, sceneId);
  await actionService.fetchPageAction(projectId, sceneId);
  await desktopPage(
    pascalCaseName,
    projectId,
    sceneId,
    `${pageName}_${slug}`,
    jsonPath,
    pageName,
    sceneName,
    sceneParentType
  );

  await tabletPage(
    pascalCaseName,
    projectId,
    sceneId,
    `${pageName}_${slug}`,
    jsonPath,
    pageName,
    sceneName,
    sceneParentType
  );

  await mobilePage(
    pascalCaseName,
    projectId,
    sceneId,
    `${pageName}_${slug}`,
    jsonPath,
    pageName,
    sceneName,
    sceneParentType
  );
}

async function desktopPage(
  fileName,
  projectId,
  sceneId,
  slug,
  jsonPath,
  pageName,
  sceneName,
  sceneParentType
) {
  try {
    commonUtils.windowDevice = "D";
    let subProjectPath = projectId;
    let filePath = `${vueProjectPath}/${subProjectPath}/vue_project/src/${sceneParentType}/${pageName}/Desktop/${sceneName}.vue`;
    await readWriteFile.createFileIfNotExists(filePath);

    // await apiStatesService.fetchgetPageState(projectId, sceneId, filePath);
    // const projectMapperContent = await mapperService.fetchMapperJson(
    //   projectId,
    //   sceneId,
    //   jsonPath,
    //   "D"
    // );
    /*const projectMapperContent = await mapperService.fetchMapperJson(
      projectId,
      sceneId,
      jsonPath,
      "D"
    );*/
    const pageContent = await apiService.fetchPageJson(
      fileName,
      slug,
      "D",
      projectId,
      sceneId,
      `${commonUtils.screenSizeAndroid().width}x${commonUtils.screenSizeAndroid().height
      }`,
      commonUtils.environment,
      jsonPath
    );
    if (pageContent === "success") {
      //  await reactjsMapper.startMapper(projectId, sceneId, pageName2); // Clear previous actions
      //  console.log(`pageName: ${pageName}-D`);
      let jsonFilePath = `${jsonPath}/${slug}_D.json`;
      await delete require.cache[require.resolve(jsonFilePath)];
      let objects = await require(jsonFilePath);
      await parseScene(
        fileName,
        projectId,
        sceneId,
        objects, //`${jsonPath}/${slug}_M.json`,
        pageName,
        filePath,
        sceneName
      );
      // console.log(`pageName end: ${pageName}-D`);
      await endActionmapper(filePath, sceneId);
    } else {
      console.log("fetchPageJson failed:", pageContent);
    }
  } catch (error) {
    console.error("Error in run:", error);
  }
}

async function tabletPage(
  fileName,
  projectId,
  sceneId,
  slug,
  jsonPath,
  pageName,
  sceneName,
  sceneParentType
) {
  try {
    commonUtils.windowDevice = "T";
    let subProjectPath = projectId;
    let filePath = `${vueProjectPath}/${subProjectPath}/vue_project/src/${sceneParentType}/${pageName}/Tablet/${sceneName}.vue`;
    await readWriteFile.createFileIfNotExists(filePath);

    /*const projectMapperContent = await mapperService.fetchMapperJson(
      projectId,
      sceneId,
      jsonPath,
      "D"
    );*/
    const pageContent = await apiService.fetchPageJson(
      fileName,
      slug,
      "T",
      projectId,
      sceneId,
      `${commonUtils.screenSizeAndroid().width}x${commonUtils.screenSizeAndroid().height
      }`,
      commonUtils.environment,
      jsonPath
    );
    if (pageContent === "success") {
      //  await reactjsMapper.startMapper(projectId, sceneId, pageName2); // Clear previous actions
      //  console.log(`pageName: ${pageName}-D`);
      let jsonFilePath = `${jsonPath}/${slug}_T.json`;
      await delete require.cache[require.resolve(jsonFilePath)];
      let objects = await require(jsonFilePath);
      let jsonObjects = objects?.data?.children ?? "";
      if (jsonObjects?.length > 0) {
        await parseScene(
          fileName,
          projectId,
          sceneId,
          objects, //`${jsonPath}/${slug}_M.json`,
          pageName,
          filePath,
          sceneName
        );
      } else {
        jsonFilePath = `${jsonPath}/${slug}_D.json`;
        await delete require.cache[require.resolve(jsonFilePath)];
        objects = await require(jsonFilePath);
        await parseScene(
          fileName,
          projectId,
          sceneId,
          objects, //`${jsonPath}/${slug}_M.json`,
          pageName,
          filePath,
          sceneName
        );
      }
      // console.log(`pageName end: ${pageName}-D`);
      await endActionmapper(filePath, sceneId);
    } else {
      console.log("fetchPageJson failed:", pageContent);
    }
  } catch (error) {
    console.error("Error in run:", error);
  }
}

async function mobilePage(
  fileName,
  projectId,
  sceneId,
  slug,
  jsonPath,
  pageName,
  sceneName,
  sceneParentType
) {
  try {
    commonUtils.windowDevice = "M";
    let subProjectPath = projectId;
    let filePath = `${vueProjectPath}/${subProjectPath}/vue_project/src/${sceneParentType}/${pageName}/Mobile/${sceneName}.vue`;
    await readWriteFile.createFileIfNotExists(filePath);

    // await apiStatesService.fetchgetPageState(projectId, sceneId, filePath);
    /*const projectMapperContent = await mapperService.fetchMapperJson(
      projectId,
      sceneId, 
      jsonPath,
      "D"
    );*/
    /*const projectMapperContent = await mapperService.fetchMapperJson(
      projectId,
      sceneId,
      jsonPath,
      "D"
    );*/
    const pageContent = await apiService.fetchPageJson(
      fileName,
      slug,
      "M",
      projectId,
      sceneId,
      `${commonUtils.screenSizeAndroid().width}x${commonUtils.screenSizeAndroid().height
      }`,
      commonUtils.environment,
      jsonPath
    );
    if (pageContent === "success") {
      //  await reactjsMapper.startMapper(projectId, sceneId, pageName2); // Clear previous actions
      //  console.log(`pageName: ${pageName}-D`);
      let jsonFilePath = `${jsonPath}/${slug}_M.json`;
      await delete require.cache[require.resolve(jsonFilePath)];
      let objects = await require(jsonFilePath);
      let jsonObjects = objects?.data?.children ?? "";
      if (jsonObjects?.length > 0) {
        await parseScene(
          fileName,
          projectId,
          sceneId,
          objects, //`${jsonPath}/${slug}_M.json`,
          pageName,
          filePath,
          sceneName
        );
      } else {
        jsonFilePath = `${jsonPath}/${slug}_T.json`;
        await delete require.cache[require.resolve(jsonFilePath)];
        objects = await require(jsonFilePath);
        jsonObjects = objects?.data?.children ?? "";
        if (jsonObjects?.length > 0) {
          await parseScene(
            fileName,
            projectId,
            sceneId,
            objects, //`${jsonPath}/${slug}_M.json`,
            pageName,
            filePath,
            sceneName
          );
        } else {
          jsonFilePath = `${jsonPath}/${slug}_D.json`;
          await delete require.cache[require.resolve(jsonFilePath)];
          objects = await require(jsonFilePath);
          await parseScene(
            fileName,
            projectId,
            sceneId,
            objects, //`${jsonPath}/${slug}_M.json`,
            pageName,
            filePath,
            sceneName
          );
        }
      }

      // console.log(`pageName end: ${pageName}-D`);
      await endActionmapper(filePath, sceneId);
    } else {
      console.log("fetchPageJson failed:", pageContent);
    }
  } catch (error) {
    console.error("Error in run:", error);
  }
}

async function parseScene(
  fileName,
  projectId,
  sceneId,
  objects, //jsonPath,
  pageName,
  filePath,
  sceneName,
  sceneParentType
) {
  let subProjectPath = projectId;

  // await delete require.cache[require.resolve(jsonPath)];
  // let objects = await require(jsonPath);
  let jsonObjects = objects?.data?.children ?? "";
  if (jsonObjects?.length > 0) {
    let projectTemplatePath = `${vueProjectPath}/${subProjectPath}/template`;
    let sourceTopPage = `${projectTemplatePath}/pageTopTemplate.txt`;
    await readWriteFile.copyPasteFileContent(sourceTopPage, filePath);
    // await readWriteFile.replaceWordInFile(
    //   filePath,
    //   `export const createTemplate`,
    //   `export const ${sceneName}`
    // );

    await reactJsMapper.startReactjsMapper(projectId, sceneId, filePath, 0);

    const jsonObject = jsonObjects[0];
    await readWriteFile.writeToFile(filePath, "").then(async (content) => {
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
              const handler = stateHandler.getInstance();
              let pageStateInfo = handler.getFilesFor(String(sceneId));
              // console.log("pageStateInfo", pageStateInfo);

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
                    value = `"${value}"`; // Normal string like "#3B1706" or "Hello txt"
                  }
                } else {
                  // number, boolean primitive
                  value = JSON.stringify(value);
                }
                
                // Cleanup double quotes if they appear wrap-around style unexpectedly
                if (typeof value === 'string' && value.startsWith('""') && value.endsWith('""')) {
                   value = value.slice(1, -1);
                }

                // ------------------------------
                // Final generated useState line
                // ------------------------------
                // Vue State Generation
                pageStates += `const ${info.name} = ref(${value});\n`;
                pageStates += `const ${info.setMethodName} = (val) => { ${info.name}.value = val; };\n`;
              }
              // Write to file
              await readWriteFile.replaceWordInFile(
                filePath,
                "[page_states]",
                pageStates
              );

              // await readWriteFile.writeToFile(filePath, "\n<>\n");

              await commonUtilsReact.generateVueTemplate({
                componentName: "QDiv",
                isSelfClosing: false,
                props: await commonUtilsReact.componentProps(
                  objects,
                  "",
                  "",
                  "",
                  "",
                  "",
                  // projectId,
                  // sceneId,
                  // "",
                  // ""
                ),
                startingIndent: 1,
                fileName: filePath,
                writeToFile: true,
              });

              await parsePage(
                projectId,
                sceneId,
                5,
                filePath,
                jsonObjects,
                // objects["children"],
                0
              ).then(async (content) => {
                if (content == "success") {
                  await endFile(filePath);
                  let projectTemplatePath = `${vueProjectPath}/${subProjectPath}/template`;
                  let sourceBottomPage = `${projectTemplatePath}/pageBottomTemplate.txt`;
                  // console.log(`sourceBottomPage: ${sourceBottomPage}`);
                  await readWriteFile.appendFileContent(
                    sourceBottomPage,
                    filePath
                  );
                  // await readWriteFile.replaceWordInFile(
                  //   filePath,
                  //   `[class_name]`,
                  //   `${sceneName}`
                  // );
                  let importFiles = "";
                  const metadata = projectMetadata.getInstance();
                  const lastComponent = path.basename(filePath);
                  const objects = metadata.getFilesFor(lastComponent);
                  for (const value in objects) {
                    importFiles += objects[value];
                  }
                  projectMetadata.removeAllFilesFor(lastComponent);

                  await readWriteFile.replaceWordInFile(
                    filePath,
                    "[import_files]",
                    importFiles
                  );
                }
              });
            }
          });
      }
    });
  } else {
    const data = {
      pageName: sceneName,
    };

    // Read the Handlebars template from a file
    let projectTemplatePath = `${vueProjectPath}/${subProjectPath}/template`;
    let templatePath = `${projectTemplatePath}/empty_page.hbs`;
    const templateString = fs.readFileSync(templatePath, "utf8");

    // Compile the template
    const template = handlebars.compile(templateString);

    // Render the template with data
    const output = template(data);

    // Ensure the directory exists before writing the file
    const pageDir = path.dirname(filePath);
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }

    // Write the rendered output to a file (remove the callback for sync operation)
    try {
      fs.writeFileSync(filePath, output, "utf8");
      // console.log(`File has been written successfully: ${filePath}`);
    } catch (err) {
      console.error("Error writing file:", err);
      throw err; // Re-throw to handle the error upstream
    }
  }

  await reactJsMapper.endReactjsMapper(projectId, sceneId, filePath, 0);
}

async function parseDesktopPage(
  fileName,
  projectId,
  sceneId,
  jsonPath,
  pageName,
  filePath,
  sceneName,
  sceneParentType
) {
  let subProjectPath = projectId;

  await delete require.cache[require.resolve(jsonPath)];
  let objects = await require(jsonPath);
  let jsonObjects = objects?.data?.children ?? "";
  if (jsonObjects?.length > 0) {
    let projectTemplatePath = `${vueProjectPath}/${subProjectPath}/template`;
    let sourceTopPage = `${projectTemplatePath}/pageTopTemplate.txt`;
    await readWriteFile.copyPasteFileContent(sourceTopPage, filePath);
    // await readWriteFile.replaceWordInFile(
    //   filePath,
    //   `export const createTemplate`,
    //   `export const ${sceneName}`
    // );

    await reactJsMapper.startReactjsMapper(projectId, sceneId, filePath, 0);

    const jsonObject = jsonObjects[0];
    await readWriteFile.writeToFile(filePath, "").then(async (content) => {
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
              const handler = stateHandler.getInstance();
              let pageStateInfo = handler.getFilesFor(String(sceneId));
              // console.log("pageStateInfo", pageStateInfo);

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
                    value = `"${value}"`; // Normal string like "#3B1706" or "Hello txt"
                  }
                } else {
                  // number, boolean primitive
                  value = JSON.stringify(value);
                }
                
                // Cleanup double quotes if they appear wrap-around style unexpectedly
                if (typeof value === 'string' && value.startsWith('""') && value.endsWith('""')) {
                   value = value.slice(1, -1);
                }

                // ------------------------------
                // Final generated useState line
                // ------------------------------
                // Vue State Generation
                pageStates += `const ${info.name} = ref(${value});\n`;
                pageStates += `const ${info.setMethodName} = (val) => { ${info.name}.value = val; };\n`;
              }
              // Write to file
              await readWriteFile.replaceWordInFile(
                filePath,
                "[page_states]",
                pageStates
              );

              // await readWriteFile.writeToFile(filePath, "\n<>\n");

               await commonUtilsReact.generateVueTemplate({
                componentName: "QDiv",
                isSelfClosing: false,
                props: await commonUtilsReact.componentProps(
                  objects,
                  "",
                  "",
                  "",
                  "",
                  "",
                  // projectId,
                  // sceneId,
                  // "",
                  // ""
                ),
                startingIndent: 1,
                fileName: filePath,
                writeToFile: true,
              });

              await parsePage(
                projectId,
                sceneId,
                5,
                filePath,
                jsonObjects,
                // objects["children"],
                0
              ).then(async (content) => {
                if (content == "success") {
                  await endFile(filePath);
                  let projectTemplatePath = `${vueProjectPath}/${subProjectPath}/template`;
                  let sourceBottomPage = `${projectTemplatePath}/pageBottomTemplate.txt`;
                  // console.log(`sourceBottomPage: ${sourceBottomPage}`);
                  await readWriteFile.appendFileContent(
                    sourceBottomPage,
                    filePath
                  );
                  // await readWriteFile.replaceWordInFile(
                  //   filePath,
                  //   `[class_name]`,
                  //   `${sceneName}`
                  // );
                  let importFiles = "";
                  const metadata = projectMetadata.getInstance();
                  const lastComponent = path.basename(filePath);
                  const objects = metadata.getFilesFor(lastComponent);
                  for (const value in objects) {
                    importFiles += objects[value];
                  }
                  projectMetadata.removeAllFilesFor(lastComponent);

                  await readWriteFile.replaceWordInFile(
                    filePath,
                    "[import_files]",
                    importFiles
                  );
                }
              });
            }
          });
      }
    });
  } else {
    const data = {
      pageName: sceneName,
    };

    // Read the Handlebars template from a file
    let projectTemplatePath = `${vueProjectPath}/${subProjectPath}/template`;
    let templatePath = `${projectTemplatePath}/empty_page.hbs`;
    const templateString = fs.readFileSync(templatePath, "utf8");

    // Compile the template
    const template = handlebars.compile(templateString);

    // Render the template with data
    const output = template(data);

    // Ensure the directory exists before writing the file
    const pageDir = path.dirname(filePath);
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }

    // Write the rendered output to a file (remove the callback for sync operation)
    try {
      fs.writeFileSync(filePath, output, "utf8");
      // console.log(`File has been written successfully: ${filePath}`);
    } catch (err) {
      console.error("Error writing file:", err);
      throw err; // Re-throw to handle the error upstream
    }
  }

  await reactJsMapper.endReactjsMapper(projectId, sceneId, filePath, 0);
}

async function parseMobilePage(
  fileName,
  projectId,
  sceneId,
  jsonPath,
  pageName,
  filePath,
  sceneName,
  sceneParentType
) {
  let subProjectPath = projectId;
  await delete require.cache[require.resolve(jsonPath)];
  let objects = await require(jsonPath);
  let jsonObjects = objects?.data?.children ?? "";
  if (jsonObjects?.length > 0) {
    let projectTemplatePath = `${vueProjectPath}/${subProjectPath}/template`;
    let sourceTopPage = `${projectTemplatePath}/pageTopTemplate.txt`;
    await readWriteFile.copyPasteFileContent(sourceTopPage, filePath);
    // await readWriteFile.replaceWordInFile(
    //   filePath,
    //   `export const createTemplate`,
    //   `export const ${sceneName}`
    // );

    await reactJsMapper.startReactjsMapper(projectId, sceneId, filePath, 0);

    const jsonObject = jsonObjects[0];
    await readWriteFile.writeToFile(filePath, "").then(async (content) => {
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
              // await readWriteFile.writeToFile(filePath, "\n<>\n");

              const handler = stateHandler.getInstance();
              let pageStateInfo = handler.getFilesFor(String(sceneId));

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
                    value = `"${value}"`; // Normal string like "#3B1706" or "Hello txt"
                  }
                } else {
                  // number, boolean primitive
                  value = JSON.stringify(value);
                }
                
                // Cleanup double quotes if they appear wrap-around style unexpectedly
                if (typeof value === 'string' && value.startsWith('""') && value.endsWith('""')) {
                   value = value.slice(1, -1);
                }

                // ------------------------------
                // Final generated useState line
                // ------------------------------
                // Vue State Generation
                pageStates += `const ${info.name} = ref(${value});\n`;
                pageStates += `const ${info.setMethodName} = (val) => { ${info.name}.value = val; };\n`;
              }
              // Write to file
              await readWriteFile.replaceWordInFile(
                filePath,
                "[page_states]",
                pageStates
              );

              // await readWriteFile.writeToFile(filePath, "\n<>\n");

              await commonUtilsReact.generateVueTemplate({
                componentName: "QDiv",
                isSelfClosing: false,
                props: await commonUtilsReact.componentProps(
                  objects,
                  "",
                  "",
                  "",
                  "",
                  "",
                  // projectId,
                  // sceneId,
                  // "",
                  // ""
                ),
                startingIndent: 1,
                fileName: filePath,
                writeToFile: true,
              });

              await parsePage(
                projectId,
                sceneId,
                5,
                filePath,
                jsonObjects,
                // objects["children"],
                0
              ).then(async (content) => {
                if (content == "success") {
                  await endFile(filePath);
                  let projectTemplatePath = `${vueProjectPath}/${subProjectPath}/template`;
                  let sourceBottomPage = `${projectTemplatePath}/pageBottomTemplate.txt`;
                  // console.log(`sourceBottomPage: ${sourceBottomPage}`);
                  await readWriteFile.appendFileContent(
                    sourceBottomPage,
                    filePath
                  );
                  // await readWriteFile.replaceWordInFile(
                  //   filePath,
                  //   `[class_name]`,
                  //   `${sceneName}`
                  // );
                  let importFiles = "";
                  const metadata = projectMetadata.getInstance();
                  const lastComponent = path.basename(filePath);
                  const objects = metadata.getFilesFor(lastComponent);
                  for (const value in objects) {
                    importFiles += objects[value];
                  }
                  projectMetadata.removeAllFilesFor(lastComponent);

                  await readWriteFile.replaceWordInFile(
                    filePath,
                    "[import_files]",
                    importFiles
                  );
                }
              });
            }
          });
      }
    });
  } else {
    const data = {
      pageName: sceneName,
    };

    // Read the Handlebars template from a file
    let projectTemplatePath = `${vueProjectPath}/${subProjectPath}/template`;
    let templatePath = `${projectTemplatePath}/empty_page.hbs`;
    const templateString = fs.readFileSync(templatePath, "utf8");

    // Compile the template
    const template = handlebars.compile(templateString);

    // Render the template with data
    const output = template(data);

    // Ensure the directory exists before writing the file
    const pageDir = path.dirname(filePath);
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }

    // Write the rendered output to a file (remove the callback for sync operation)
    try {
      fs.writeFileSync(filePath, output, "utf8");
      // console.log(`File has been written successfully: ${filePath}`);
    } catch (err) {
      console.error("Error writing file:", err);
      throw err; // Re-throw to handle the error upstream
    }
  }
  await reactJsMapper.endReactjsMapper(projectId, sceneId, filePath, 0);
}

async function parsePage(
  projectId,
  sceneId,
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
        sceneId,
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

async function endFile(filePath) {
  await readWriteFile.writeToFile(filePath, "</QDiv>\n");
  // await readWriteFile.writeToFile(filePath, "</>");
  await reactJsMapper.endFileActions(filePath);
  // await homeController.createAndUpdateHomeController();
  //   await readWriteFile.replaceWordInFile(pageName, "[import_files]", '');
}

async function endActionmapper(pageName, pageId) {
  // await reactJsMapper.endMapper(pageName, pageId);
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
