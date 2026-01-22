const parserPageContentReact = require("./parser/React/react_parser_page_content");
const reactParserComponent = require("./parser/React/react_parser_component");
const commonUtils = require("./utility/common_utils");
const commonPath = require("./utility/common_path");
const readWriteFile = require("./utility/read_write_file");
const path = require("path");
const homeController = require("./parser/React/react_parser_home_controller");
const styleProps = require("./parser/React/react_style_props");
const reactCommonUtilits = require("./parser/React/common_utilits_react");
const apiService = require("./API_Service/api_service");

const reactProjectPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectPath.get(commonPath.environmentHosting)}`
);

async function createReactjsProject(projectID, pageId, platform) {
  reactCommonUtilits.props = [];
  commonUtils.projectId = projectID;
  commonUtils.pageId = pageId;
  commonUtils.currentPage = "";
  commonUtils.platform = platform;
  homeController.destinations.length = 0;
  styleProps.valueProps = [];
  styleProps.tailwaindClasses = "";

  let subProjectPath = projectID;
  console.log(
    `Starting project creation for ID: ${projectID}, PageID: ${pageId}`
  );
  console.log(`homeController.destinations: ${homeController.destinations}`);

  let jsonPath = `${reactProjectPath}/${subProjectPath}/jsons`;
  await readWriteFile.deleteFilesInFolder(jsonPath);
  await readWriteFile.createFolderIfNotExists(jsonPath);

  try {
    const projectContent = await apiService.fetchProjectInfo(
      projectID,
      jsonPath
    );

    if (projectContent === "success") {
      console.log("Project content fetched successfully.");

      let projectInfoPath = jsonPath + `/project_info.json`;
      await readWriteFile.createFolderIfNotExists(reactProjectPath);

      // Setup project structure
      let sourceProject = "./created_files/React/react_export";
      let projectFolderPath = `${reactProjectPath}/${subProjectPath}/react_project`;
      await readWriteFile.deleteFilesAndFolders(`${projectFolderPath}`);
      await readWriteFile.createFolderIfNotExists(projectFolderPath);
      await readWriteFile.copyPasteSourceToDestination(
        sourceProject,
        projectFolderPath
      );

      let sourceProjectTemplate = "./created_files/template/react";
      let projectTemplatePath = `${reactProjectPath}/${subProjectPath}/template`;
      await readWriteFile.deleteFilesAndFolders(projectTemplatePath);
      await readWriteFile.createFolderIfNotExists(projectTemplatePath);
      await readWriteFile.copyPasteSourceToDestination(
        sourceProjectTemplate,
        projectTemplatePath
      );

      // Clear require cache and load project info
      await delete require.cache[require.resolve(projectInfoPath)];
      let objects = await require(projectInfoPath);

      if (objects.status === "success") {
        await updateComponent(
          objects?.data?.skeleton,
          projectID,
          jsonPath,
          "skeleton"
        );
        await updateComponent(
          objects?.data?.component,
          projectID,
          jsonPath,
          "components"
        );

        await updatePages(objects, projectID, jsonPath, pageId);
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

async function updateComponent(objects, projectID, jsonPath, component) {
  let jsonObjects = objects ?? [];
  // Choose processing method based on your needs
  const USE_BATCH_PROCESSING = true; // Set to false for sequential processing
  let processingResults;

  if (USE_BATCH_PROCESSING) {
    // Process pages in batches with enhanced error handling
    processingResults = await this.processPagesInBatches(
      jsonObjects,
      3, // Reduced batch size for better reliability
      async (jsonObj, index) => {
        let pageId = jsonObj["cms_page_Id"];
        let slug =
          (jsonObj["cms_page_Slug"] ?? "").length > 0
            ? jsonObj["cms_page_Slug"]
            : `${pageId}`;
        try {
          // Add small delay before each page processing within batch
          if (index > 0) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          const result = await reactParserComponent.parseComponent(
            projectID,
            pageId,
            slug,
            jsonPath,
            component
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

async function updatePages(objects, projectID, jsonPath, pageId) {
  let jsonObjects = objects?.data?.pages ?? [];
  if (!Array.isArray(jsonObjects) || jsonObjects.length === 0) {
    console.log("No pages found in project or invalid pages data");
    return;
  }

  console.log(`Found ${jsonObjects.length} pages to process`);

  // Add all destinations first (synchronous operation)
  jsonObjects.forEach((jsonObj) => {
    let page_id = jsonObj["cms_page_Id"];
    let slug = jsonObj["cms_page_Slug"];
    let isCurrentPage = String(page_id) === String(pageId);
    console.log(`Adding destination: ${slug} (current: ${isCurrentPage})`);
    homeController.addDestinations(`${slug}`, isCurrentPage);
  });

  console.log(`All destinations added: ${homeController.destinations.length}`);

  // Choose processing method based on your needs
  const USE_BATCH_PROCESSING = true; // Set to false for sequential processing
  let processingResults;

  if (USE_BATCH_PROCESSING) {
    // Process pages in batches with enhanced error handling
    processingResults = await this.processPagesInBatches(
      jsonObjects,
      3, // Reduced batch size for better reliability
      async (jsonObj, index) => {
        let pageId = jsonObj["cms_page_Id"];
        let slug = jsonObj["cms_page_Slug"];
        try {
          // Add small delay before each page processing within batch
          if (index > 0) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          const result = await parserPageContentReact.parsePageContent(
            projectID,
            pageId,
            slug,
            jsonPath
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
  console.log(
    `Page processing completed: ${successful} successful, ${failed} failed`
  );

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
  let defaultPageId = objects?.data?.default?.default_page ?? 0;
  const defaultPage = jsonObjects.find(
    (page) => page.cms_page_Id === defaultPageId
  );
  // const defaultSlug = defaultPage?.cms_page_Slug ?? "";
  let currentPageView = commonUtils.currentPage ?? "";
  const defaultSlug =
    currentPageView.length > 0
      ? currentPageView
      : defaultPage?.cms_page_Slug ?? "";

  await homeController.createAndUpdateHomeController(defaultSlug);
}

module.exports = {
  createReactjsProject,
};
