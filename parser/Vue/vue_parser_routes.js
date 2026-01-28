const readWriteFile = require("../../utility/read_write_file");
const commonUtils = require("../../utility/common_utils");
const commonPath = require("../../utility/common_path");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const vueProjectPath = path.resolve(
  __dirname,
  `${commonPath.vueProjectPath.get(commonPath.environmentHosting)}`
);

const layouts = [];
const pages = [];
const components = [];
const elements = [];
const states = [];
const models = [];

async function updateRoutes(projectId, defaultPageId) {
  let subProjectPath = projectId;
  let routesPathIndex = `${vueProjectPath}/${subProjectPath}/vue_project/src/router/index.js`;
  const currentPage =
    pages.find((page) => page.isCurrentPage === true) ??
    pages.find((page) => page.pageId === defaultPageId);
  let data = {
    importLayouts: layouts.map((layout) => ({ layoutName: layout.layoutName })),

    importPages: pages.map((page) => ({ pageName: page.pageName })),

    importModels: models.map((model) => ({ modelName: model.modelName })),

    defaultPageLayoutName: await getLayoutNameByCmsPageSkeleton(
      currentPage?.cmsPageSkeleton
    ),
    defaultPageName: currentPage?.pageName || "",
    pages: await Promise.all(
      pages.map(async (page) => ({
        layoutName: await getLayoutNameByCmsPageSkeleton(page.cmsPageSkeleton),
        pageName: page.pageName,
      }))
    ),

    QModalContainers: models.map((model) => ({ modelName: model.modelName })),
  };

  // Remove duplicate states based on name and map to appStates
  const uniqueStates = states.reduce((acc, current) => {
    const existing = acc.find((item) => item.name === current.name);
    if (!existing) {
      acc.push(current);
    }
    return acc;
  }, []);

  // Append appStates to data object
  data.appStates = uniqueStates.map((state) => ({
    appState: `set("${state.name}", ${
      state.valueType == "JSON" ? state.defaultValue : `'${state.defaultValue}'`
    })`,
  }));

  const persistUniqueStates = uniqueStates.filter(
    (item) => item?.persist === true
  );
  // check appStates value already exit in localStorage
  data.checkStates = persistUniqueStates.map((state) => ({
    state: `${state.name}`,
  }));

  // Read the Handlebars template from a file
  let projectTemplatePath = `${vueProjectPath}/${subProjectPath}/template`;
  let templatePath = `${projectTemplatePath}/routes_index.hbs`; // Note: changed to match your filename

  // Check if template file exists
  if (!fs.existsSync(templatePath)) {
    console.error(`Template file not found: ${templatePath}`);
    return;
  }

  const templateString = fs.readFileSync(templatePath, "utf8");

  // Compile the template
  const template = handlebars.compile(templateString);

  // Render the template with data
  const output = template(data);
  
  // Ensure the directory exists before writing the file
  const routeDir = path.dirname(routesPathIndex);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  // Write the rendered output to a file
  try {
    fs.writeFileSync(routesPathIndex, output, "utf8");
  } catch (err) {
    console.error("Error writing file:", err);
    throw err;
  }
}

async function getLayoutNameByCmsPageSkeleton(layputPageId) {
  // Find the layout where pageId matches the cmsPageSkeleton value
  const layout = layouts.find((layout) => layout.pageId === layputPageId);

  return layout ? layout.layoutName : "DefaultLayout"; // Return layoutName or null if no matching layout is found
}

async function getComponentNameByPageId(pageId) {
  // Find the layout where pageId matches the cmsPageSkeleton value
  const component = components.find((component) => component.pageId === pageId);

  return component ? component.componentName : ""; // Return layoutName or null if no matching layout is found
}

async function flushAllData() {
  layouts.length = 0;
  pages.length = 0;
  components.length = 0;
  elements.length = 0;
  states.length = 0;
  models.length = 0;
}

module.exports = {
  layouts,
  pages,
  components,
  elements,
  states,
  models,
  updateRoutes,
  getComponentNameByPageId,
  flushAllData,
};
