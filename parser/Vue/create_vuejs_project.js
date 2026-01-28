const parserPageContentVue = require("./vue_parser_page_content");
const vueParserComponent = require("./vue_parser_component");
const commonUtils = require("../../utility/common_utils");
const commonPath = require("../../utility/common_path");
const readWriteFile = require("../../utility/read_write_file");
const path = require("path");
const homeController = require("./vue_parser_home_controller");
const styleProps = require("./vue_style_props");
const vueCommonUtilits = require("./common_utilits_vue");
const apiService = require("../../API_Service/api_service");
const routesController = require("./vue_parser_routes");

const vueProjectPath = path.resolve(
  __dirname,
  `${commonPath.vueProjectPath.get(commonPath.environmentHosting)}`
);

async function createVuejsProject(projectID, pageId, platform) {
  vueCommonUtilits.props = [];
  commonUtils.projectId = projectID;
  commonUtils.pageId = pageId;
  commonUtils.currentPage = "";
  commonUtils.platform = platform;
  homeController.destinations.length = 0;
  styleProps.valueProps = [];
  styleProps.tailwaindClasses = "";

  let subProjectPath = projectID;
  console.log(
    `Starting Vue project creation for ID: ${projectID}, PageID: ${pageId}`
  );
  console.log(`homeController.destinations: ${homeController.destinations}`);

  let jsonPath = `${vueProjectPath}/${subProjectPath}/jsons`;
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
      await readWriteFile.createFolderIfNotExists(vueProjectPath);

      // Setup project structure
      let sourceProject = "./created_files/Vue/vue_export";
      let projectFolderPath = `${vueProjectPath}/${subProjectPath}/vue_project`;
      await readWriteFile.deleteFilesAndFolders(`${projectFolderPath}`);
      await readWriteFile.createFolderIfNotExists(projectFolderPath);
      await readWriteFile.copyPasteSourceToDestination(
        sourceProject,
        projectFolderPath
      );

      let sourceProjectTemplate = "./created_files/template/vue";
      let projectTemplatePath = `${vueProjectPath}/${subProjectPath}/template`;
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
        
        await populateRoutes(objects, projectID, pageId);
      } else {
        console.error("Project object status is not success:", objects?.status);
      }
    } else {
      console.error("fetchProjectInfo failed:", projectContent);
    }
  } catch (error) {
    console.error("Error in createVuejsProject:", error);
    throw error;
  }
}

async function updateComponent(objects, projectID, jsonPath, component) {
  let jsonObjects = objects ?? [];
  const USE_BATCH_PROCESSING = true;
  let processingResults;

  if (USE_BATCH_PROCESSING) {
    processingResults = await processPagesInBatches(
      jsonObjects,
      3,
      async (jsonObj, index) => {
        let pageId = jsonObj["cms_page_Id"];
        let slug =
          (jsonObj["cms_page_Slug"] ?? "").length > 0
            ? jsonObj["cms_page_Slug"]
            : `${pageId}`;
        try {
          if (index > 0) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          let componentName = jsonObj["cms_page_Name"].replace(" ", "_");
          const refPageName = componentName.replace(/-/g, "_");
          const updatedPageName = commonUtils.toPascalCase(refPageName);
          let defaultSceneName = await getDefaultSceneName(jsonObj);

          const result = await vueParserComponent.parseComponent(
            jsonObj,
            projectID,
            pageId,
            slug,
            jsonPath,
            updatedPageName,
            defaultSceneName,
            component
          );

          return { success: true, slug, pageId, result };
        } catch (error) {
          console.error(
            `Error processing page ${jsonObj.cms_page_Slug}:`,
            error
          );
          throw error;
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

  jsonObjects.forEach((jsonObj) => {
    let page_id = jsonObj["cms_page_Id"];
    let slug = jsonObj["cms_page_Slug"];
    let isCurrentPage = String(page_id) === String(pageId);
    console.log(`Adding destination: ${slug} (current: ${isCurrentPage})`);
    homeController.addDestinations(`${slug}`, isCurrentPage);
  });

  console.log(`All destinations added: ${homeController.destinations.length}`);

  const USE_BATCH_PROCESSING = true;
  let processingResults;

  if (USE_BATCH_PROCESSING) {
    processingResults = await processPagesInBatches(
      jsonObjects,
      3,
      async (jsonObj, index) => {
        let pageId = jsonObj["cms_page_Id"];
        let slug = jsonObj["cms_page_Slug"];
        try {
          if (index > 0) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          let pageNameRaw = jsonObj["cms_page_Name"].replace(" ", "_");
          const refPageName = pageNameRaw.replace(/-/g, "_");
          const updatedPageName = commonUtils.toPascalCase(refPageName);
          let defaultSceneName = await getDefaultSceneName(jsonObj);

          const result = await parserPageContentVue.parsePageContent(
            jsonObj,
            projectID,
            pageId,
            slug,
            jsonPath,
            updatedPageName,
            defaultSceneName
          );

          return { success: true, slug, pageId, result };
        } catch (error) {
          console.error(
            `Error processing page ${jsonObj.cms_page_Slug}:`,
            error
          );
          throw error;
        }
      }
    );
  } else {
    // Sequential processing
    processingResults = await processPageSequentially(jsonObjects, 400);
  }

  const successful = Array.isArray(processingResults)
    ? processingResults.filter((r) => r?.success !== false && !r?.error).length
    : 0;
  const failed = Array.isArray(processingResults)
    ? processingResults.filter((r) => r?.success === false || r?.error).length
    : 0;
  console.log(
    `Page processing completed: ${successful} successful, ${failed} failed`
  );

  const failedPages = Array.isArray(processingResults)
    ? processingResults.filter((r) => r?.success === false || r?.error)
    : [];
  if (failedPages.length > 0) {
    console.log(
      "Failed pages:",
      failedPages.map((p) => p?.slug || p?.page).join(", ")
    );
  }

  let defaultPageId = objects?.data?.default?.default_page ?? 0;
  const defaultPage = jsonObjects.find(
    (page) => page.cms_page_Id === defaultPageId
  );
  let currentPageView = commonUtils.currentPage ?? "";
  const defaultSlug =
    currentPageView.length > 0
      ? currentPageView
      : defaultPage?.cms_page_Slug ?? "";

  await homeController.createAndUpdateHomeController(defaultSlug);
}

// Added Helper Functions
async function processPagesInBatches(pages, batchSize, processFn) {
  const results = [];
  const totalBatches = Math.ceil(pages.length / batchSize);

  for (let i = 0; i < pages.length; i += batchSize) {
    const batchNumber = Math.floor(i / batchSize) + 1;
    const batch = pages.slice(i, i + batchSize);

    try {
      const batchPromises = batch.map((page, index) => {
        const globalIndex = i + index;
        return processFn(page, globalIndex);
      });

      // Use Promise.allSettled for better error handling
      const batchResults = await Promise.allSettled(batchPromises);

      // Log results and handle failures
      batchResults.forEach((result, index) => {
        const globalIndex = i + index;
        const pageSlug = batch[index].cms_page_Slug;

        if (result.status === "fulfilled") {
          results.push(result.value);
        } else {
          console.error(
            `❌ Failed page ${globalIndex + 1}: ${pageSlug}`,
            result.reason
          );
          results.push({ error: result.reason, page: pageSlug });
        }
      });

      // Optional: Add a small delay between batches to prevent overwhelming the system
      if (i + batchSize < pages.length) {
        await new Promise((resolve) => setTimeout(resolve, 200)); // 200ms delay
      }
    } catch (error) {
      console.error(`Error in batch ${batchNumber}:`, error);
      // Continue with next batch even if current batch fails
    }
  }

  return results;
}

async function processPageSequentially(pages, delayMs = 300) {
  const results = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const pageId = page["cms_page_Id"];
    const slug = page["cms_page_Slug"];

    try {
      const result = await parserPageContentVue.parsePageContent(
        commonUtils.projectId,
        pageId,
        slug,
        `${vueProjectPath}/${commonUtils.projectId}/jsons`
      );

      results.push({ success: true, slug, pageId, result });

      // Add delay between pages to prevent overwhelming the system
      if (i < pages.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      console.error(`❌ Failed page ${i + 1}: ${slug}`, error);
      results.push({ success: false, slug, pageId, error: error.message });

      // Continue with next page even if current one fails
    }
  }

  return results;
}

async function getDefaultSceneName(data) {
  if (!data || !data.scene || !Array.isArray(data.scene)) {
    return "";
  }
  const defaultSceneId = data.cms_page_Default_Scene;
  const defaultScene = data.scene.find(
    (scene) => scene.cms_page_Id === defaultSceneId
  );
  const defaultSceneName = (defaultScene ? defaultScene.cms_page_Name : "")
    .replace(/-/g, "_")
    .replace(/-/g, "_");
    
  return commonUtils.toPascalCase(defaultSceneName);
}

async function populateRoutes(objects, projectID, pageId) {
    // Flush existing data
    await routesController.flushAllData();
  
    let jsonPageObjects = objects?.data?.pages ?? [];
    
    // Process Pages
    jsonPageObjects.forEach((page) => {
      let page_id = page["cms_page_Id"];
      let slug = page["cms_page_Slug"];
      let cmsPageSkeleton = page["cms_page_Skeleton"];
      let isCurrentPage = String(page_id) === String(pageId);
      let pageName = page["cms_page_Name"].replace(" ", "_");
      const refPageName = pageName.replace(/-/g, "_");
      const updatedPageName = commonUtils.toPascalCase(refPageName);
      
      routesController.pages.push({
        slug: slug,
        pageId: page_id,
        cmsPageSkeleton: cmsPageSkeleton,
        isCurrentPage: isCurrentPage,
        pageName: updatedPageName,
      });
    });
  
    let jsonLayoutObjects = objects?.data?.skeleton ?? [];
    
    // Process Layouts
    jsonLayoutObjects.forEach((layout) => {
      let page_id = layout["cms_page_Id"];
      let slug = layout["cms_page_Slug"];
      let pageName = layout["cms_page_Name"].replace(" ", "_");
      const refPageName = pageName.replace(/-/g, "_");
      const updatedPageName = commonUtils.toPascalCase(refPageName);
      
      routesController.layouts.push({
        slug: slug,
        pageId: page_id,
        layoutName: updatedPageName,
      });
    });
  
    let jsonModelObjects = objects?.data?.model ?? [];
    
    // Process Models (for modal containers etc)
    jsonModelObjects.forEach((model) => {
      let page_id = model["cms_page_Id"];
      let slug = model["cms_page_Slug"];
      let modelName = model["cms_page_Name"].replace(" ", "_");
      const refModelName = modelName.replace(/-/g, "_");
      const updatedModelName = commonUtils.toPascalCase(refModelName);
      
      routesController.models.push({
        slug: slug,
        pageId: page_id,
        modelName: updatedModelName,
      });
    });
  
    try {
      let defaultPageId = objects?.data?.default?.default_page ?? 0;
      await routesController.updateRoutes(projectID, defaultPageId);
      console.log("Routes updated successfully.");
    } catch (error) {
      console.error("Error in populateRoutes:", error);
      throw error; 
    }
}

module.exports = {
  createVuejsProject,
};
