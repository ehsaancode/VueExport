const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./vue_create_page_design");
const commonUtils = require("../../utility/common_utils");
const commonPath = require("../../utility/common_path");
const apiService = require("../../API_Service/api_service");
const apiStatesService = require("../../API_Service/states_service");
const homeController = require("./vue_parser_home_controller");
const commonUtilsReact = require("./common_utilits_vue");
const mapperService = require("../../API_Service/mapper_service");
const reactjsMapper = require("../../mapper/vuejs/vuejs_mapper");
const batchProcessor = require("../../utility/batche_process");
const parserScene = require("./vue_parser_scene");
const projectMetadata = require("../../utility/project_metadata");
const stateHandler = require("../../utility/state_handler");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const vueProjectPath = path.resolve(
  __dirname,
  `${commonPath.vueProjectPath.get(commonPath.environmentHosting)}`
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
  let projectPagePath = `${vueProjectPath}/${projectId}/vue_project/src/${component}/${componentName}`;
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
  let layoutPathDesktop = `${vueProjectPath}/${subProjectPath}/vue_project/src/${component}/${componentName}/Desktop/${componentName}.vue`;
  let layoutPathMobile = `${vueProjectPath}/${subProjectPath}/vue_project/src/${component}/${componentName}/Mobile/${componentName}.vue`;
  let layoutPathIndex = `${vueProjectPath}/${subProjectPath}/vue_project/src/${component}/${componentName}/${componentName}_index.vue`;

  const data = {
    LayoutTitle: componentName,
    hasDesktop: await readWriteFile.fileExists(layoutPathDesktop),
    hasMobile: await readWriteFile.fileExists(layoutPathMobile),
  };

  // Read the Handlebars template from a file
  let projectTemplatePath = `${vueProjectPath}/${subProjectPath}/template`;
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
  let layoutPathDesktop = `${vueProjectPath}/${subProjectPath}/vue_project/src/${component}/${componentName}/Desktop/${componentName}.vue`;

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
  let projectTemplatePath = `${vueProjectPath}/${subProjectPath}/template`;
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
      // Vue State Generation
      pageStates += `const ${info.name} = ref(${value});\n`;
      pageStates += `const ${info.setMethodName} = (val) => { ${info.name}.value = val; };\n`;
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
  let layoutPathMobile = `${vueProjectPath}/${subProjectPath}/vue_project/src/${component}/${componentName}/Tablet/${componentName}.vue`;

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
  let projectTemplatePath = `${vueProjectPath}/${subProjectPath}/template`;
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
      // Vue State Generation
      pageStates += `const ${info.name} = ref(${value});\n`;
      pageStates += `const ${info.setMethodName} = (val) => { ${info.name}.value = val; };\n`;
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
  let layoutPathMobile = `${vueProjectPath}/${subProjectPath}/vue_project/src/${component}/${componentName}/Mobile/${componentName}.vue`;

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
  let projectTemplatePath = `${vueProjectPath}/${subProjectPath}/template`;
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
      // Vue State Generation
      pageStates += `const ${info.name} = ref(${value});\n`;
      pageStates += `const ${info.setMethodName} = (val) => { ${info.name}.value = val; };\n`;
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


// Legacy code removed

module.exports = {
  parseComponent,
};
