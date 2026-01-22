// const parserPageContentAndroid = require("./android_parser_page_content");
const createReactNativeComponent = require("./create_react_native_component");
const createReactNativeLayout = require("./create_react_native_layout");
const createReactNativePage = require("./create_react_native_page");
const commonUtils = require("../../utility/common_utils");
const processTasksInBatches = require("../../utility/process_tasks_in_batches");
const commonPath = require("../../utility/common_path");
const readWriteFile = require("../../utility/read_write_file");
const path = require("path");
const apiService = require("../../API_Service/api_service");

const reactNativeProjectPath = path.resolve(
  __dirname,
  `${commonPath.reactNativeProjectPath.get(commonPath.environmentHosting)}`
);

async function createReactNativeProject(projectID, pageId) {
  commonUtils.projectId = projectID;
  commonUtils.pageId = pageId;
  let subProjectPath = `${reactNativeProjectPath}/${projectID}`;
  await readWriteFile.deleteFilesAndFolders(subProjectPath);
  let jsonPath = `${subProjectPath}/jsons`;
  // await readWriteFile.deleteFilesInFolder(jsonPath);
  await readWriteFile.createFolderIfNotExists(jsonPath);

  try {
    const projectContent = await apiService.fetchProjectInfo(
      projectID,
      jsonPath
    );
    if (projectContent === "success") {
      let projectInfoPath = jsonPath + `/project_info.json`;
      await readWriteFile.createFolderIfNotExists(projectInfoPath);
      console.log(`projectInfoPath: ${projectInfoPath}`);

      // Clear require cache and load project info
      delete require.cache[require.resolve(projectInfoPath)];
      let objects = require(projectInfoPath);

      if (objects.status === "success") {
        await updateComponent(
          objects?.data?.component,
          projectID,
          jsonPath,
          "components"
        );

        await updateLayout(objects?.data?.skeleton, projectID, jsonPath);
        // await updatePages(objects, projectID, jsonPath, pageId);
        await updatePages(objects?.data?.pages, projectID, jsonPath);
      } else {
        console.error("Project object status is not success:", objects?.status);
      }
    } else {
      console.error("fetchProjectInfo failed:", projectContent);
    }
  } catch (error) {
    console.error("Error in createReactjsProject:", error);
    throw error; // Re-throw if you want calling code to handle it
  }
}

async function updateComponent(objects, projectID, jsonPath, component) {}

async function updateLayout(objects, projectID, jsonPath) {}

async function updatePages(objects, projectID, jsonPath) {
  let jsonObjects = objects ?? [];
  let projectPath = `${reactNativeProjectPath}/${projectID}/src/pages`;
  const USE_BATCH_PROCESSING = true;
  let processingResults;

  if (USE_BATCH_PROCESSING) {
    // Process pages in batches with enhanced error handling
    processingResults = await processTasksInBatches.processTasksInBatches(
      jsonObjects,
      1, // Reduced batch size for better reliability
      async (jsonObj, index) => {
        let pageId = jsonObj["cms_page_Id"];
        let layoutId = jsonObj["cms_page_Skeleton"];
        let comName = jsonObj["cms_page_Name"].replace(" ", "_");
        const componentName = comName.replace(/-/g, "_");
        const updatedComponentName = commonUtils.toPascalCase(componentName);
        let slug =
          (jsonObj["cms_page_Slug"] ?? "").length > 0
            ? jsonObj["cms_page_Slug"]
            : `${pageId}`;
        try {
          // Add small delay before each page processing within batch
          if (index > 0) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          const result = await createReactNativePage.page(
            projectFolderPath,
            projectID,
            pageId,
            slug,
            jsonPath,
            updatedComponentName,
            layoutId
          );

          return { success: true, slug, pageId, result };
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
  }
}

module.exports = {
  createReactNativeProject,
};
