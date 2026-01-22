const parserPageContentReact = require("./parser/React/react_parser_page_content");
const reactParserComponent = require("./parser/React/react_parser_component");
const reactParserLayout = require("./parser/React/react_parser_layout");
const parserPageContentIos = require("./parser/iOS/parser_page_content");
const parserPageContentAndroid = require("./parser/Android/android_parser_page_content");
const commonUtils = require("./utility/common_utils");
const commonPath = require("./utility/common_path");
const projectStatus = require("./utility/update_project_status");
const StateHandler = require("./utility/state_handler");
const actionFlowHandler = require("./utility/action_flow_handler");
const readWriteFile = require("./utility/read_write_file");
const path = require("path");
const homeController = require("./parser/React/react_parser_home_controller");
const routesController = require("./parser/React/react_parser_routes");
const styleProps = require("./parser/React/react_style_props");
const reactCommonUtilits = require("./parser/React/common_utilits_react");
const apiService = require("./API_Service/api_service");
const apiStatesService = require("./API_Service/states_service");
const collectionsService = require("./API_Service/collections_service");
const themeService = require("./API_Service/theme_service");
const { generateSitemap } = require("./parser/React/react_sitemap_generator");

const reactProjectPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectPath.get(commonPath.environmentHosting)}`
);

const androidProjectPath = path.resolve(
  __dirname,
  `${commonPath.androidProjectPath.get(commonPath.environmentHosting)}`
);

const iosProjectPath = path.resolve(
  __dirname,
  `${commonPath.iosProjectPath.get(commonPath.environmentHosting)}`
);

class App {
  constructor() {
    // Initialize if needed
  }

  async processData(projectID, pageId, platform) {
    const zipFolderPath = path.join(
      __dirname,
      "created_files",
      "export_files",
      `${projectID}`
    );
    await readWriteFile.createFolderIfNotExists(zipFolderPath);

    // Your method logic here
    await this.run(projectID, pageId, platform);
  }

  async run(projectID, pageId, platform) {
    try {
      commonUtils.projectId = projectID;
      commonUtils.pageId = pageId;
      commonUtils.platform = platform;
      await readWriteFile.deleteFilesInFolder("./created_files/pages");

      await readWriteFile.deleteFilesInFolder("./created_files/export_files");
      if (platform === "reactjs") {
        homeController.destinations = [];
        await readWriteFile.deleteFilesInFolder(
          "./created_files/React/react_export/src/templates"
        );
        await readWriteFile.deleteFilesInFolder(
          "./created_files/React/react_export/src/pages"
        );

        await parserPageContentReact.parsePageContent();

        await readWriteFile.zipFolder(
          "./created_files/React",
          `./created_files/export_files/${projectID}/output.zip`
        );
      } else if (platform === "ios") {
        await readWriteFile.deleteFilesInFolder("./created_files/iOS");
        await parserPageContentIos.mobilePage();
        await readWriteFile.zipFolder(
          "./created_files/iOS",
          `./created_files/export_files/${projectID}/output.zip`
        );
      } else if (platform === "android") {
        await readWriteFile.deleteFilesInFolder("./created_files/Android");
        await parserPageContentAndroid.mobilePage();
        await readWriteFile.zipFolder(
          "./created_files/Android",
          `./created_files/export_files/${projectID}/output.zip`
        );
      } else {
      }
    } catch (error) {
      console.error("Error in run:", error);
    }
  }

  // Enhanced batch processing with better error handling and logging
  async processPagesInBatches(pages, batchSize, processFn) {
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

    const successful = Array.isArray(results)
      ? results.filter((r) => r && !r?.error).length
      : 0;
    const failed = Array.isArray(results)
      ? results.filter((r) => r && r?.error).length
      : 0;

    return results;
  }

  // Alternative: Sequential processing for maximum reliability
  async processPageSequentially(pages, delayMs = 300) {
    const results = [];

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const pageId = page["cms_page_Id"];
      const slug = page["cms_page_Slug"];

      try {
        const result = await parserPageContentReact.parsePageContent(
          commonUtils.projectId,
          pageId,
          slug,
          `${reactProjectPath}/${commonUtils.projectId}/jsons`
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

  async createReactjsProject(projectID, pageId, platform) {
    reactCommonUtilits.props = [];
    const stateHandler = StateHandler.getInstance();
    stateHandler.flushAll();
    actionFlowHandler.flushAllData();
    commonUtils.projectId = projectID;
    commonUtils.pageId = pageId;
    commonUtils.currentPage = "";
    commonUtils.platform = platform;
    homeController.destinations.length = 0;
    // routesController.layouts.length = 0;
    // routesController.pages.length = 0;
    // routesController.models.length = 0;
    await routesController.flushAllData();
    styleProps.valueProps = [];
    styleProps.tailwaindClasses = "";

    let subProjectPath = projectID;
    console.log(
      `Starting project creation for ID: ${projectID}, PageID: ${pageId}`
    );

    let jsonPath = `${reactProjectPath}/${subProjectPath}/jsons`;
    await readWriteFile.deleteFilesInFolder(jsonPath);
    await readWriteFile.createFolderIfNotExists(jsonPath);

    try {
      const projectContent = await apiService.fetchProjectInfo(
        projectID,
        jsonPath
      );
      if (projectContent === "success") {
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

        await projectStatus.updateProjectStatus(
          projectID,
          platform,
          "processing"
        );

        await apiStatesService.fetchGlobalState(projectID);
        await collectionsService.fetchCollections(1, jsonPath);
        const projectThemeContent = await themeService.fetchThemeJson(
          projectID,
          jsonPath
        );

        // Clear require cache and load project info
        await delete require.cache[require.resolve(projectInfoPath)];
        let objects = await require(projectInfoPath);

        if (objects.status === "success") {
          await this.updateModules(objects);

          await this.updateComponent(
            objects?.data?.element,
            projectID,
            jsonPath,
            "elements"
          );

          await this.updateComponent(
            objects?.data?.component,
            projectID,
            jsonPath,
            "components"
          );

          await this.updateComponent(
            objects?.data?.model,
            projectID,
            jsonPath,
            "models"
          );

          await this.updateLayout(objects?.data?.skeleton, projectID, jsonPath);

          await this.updatePages(objects, projectID, jsonPath, pageId);

          await this.updateRoutes(objects, projectID, pageId);

          //generate sitemap
          const pages = objects?.data?.pages ?? []; //get pages from object // same data generated in the project info json
          // console.log("Pages found for sitemap:", pages);

          const sitemapUrls = pages.map((page) => {
            let slug = page["cms_page_Slug"];
            if (slug && !slug.startsWith("/")) slug = "/" + slug;
            // Handle home page or empty slug
            if (!slug) slug = "/";

            return {
              url: slug,
              lastmod: new Date().toISOString().split("T")[0], // Today's date
              changefreq: "daily",
              priority: 0.7,
            };
          });

          // Use hostname from project info or default
          // const hostname = objects?.data?.hostname ?? ;
          const hostname = `https://staging.cmsexport.react.redoq.host/${subProjectPath}/`;

          const projectFolderPath = `${reactProjectPath}/${subProjectPath}/react_project`;
          const publicFolderPath = `${projectFolderPath}/public`;
          await readWriteFile.createFolderIfNotExists(publicFolderPath);

          await generateSitemap(publicFolderPath, hostname, sitemapUrls);

          await this.generateRobotsTxt(projectID, jsonPath);
        } else {
          console.error(
            "Project object status is not success:",
            objects?.status
          );
        }
      } else {
        console.error("fetchProjectInfo failed:", projectContent);
      }
    } catch (error) {
      console.error("Error in createReactjsProject:", error);
      throw error; // Re-throw if you want calling code to handle it
    }
  }

  async updateModules(objects) {
    let jsonComponentObjects = objects?.data?.component ?? [];
    jsonComponentObjects.forEach((component) => {
      let page_id = component["cms_page_Id"];
      let slug = component["cms_page_Slug"];
      let pageName = component["cms_page_Name"].replace(" ", "_");
      const refPageName = pageName.replace(/-/g, "_");
      const updatedPageName = commonUtils.toPascalCase(refPageName);
      reactCommonUtilits.components.push({
        slug: slug,
        pageId: page_id,
        componentName: updatedPageName,
      });
    });

    let jsonElementObjects = objects?.data?.element ?? [];
    jsonElementObjects.forEach((element) => {
      let page_id = element["cms_page_Id"];
      let slug = element["cms_page_Slug"];
      let pageName = element["cms_page_Name"].replace(" ", "_");
      const refPageName = pageName.replace(/-/g, "_");
      const updatedPageName = commonUtils.toPascalCase(refPageName);
      reactCommonUtilits.elements.push({
        slug: slug,
        pageId: page_id,
        componentName: updatedPageName,
      });
    });
  }

  async updateRoutes(objects, projectID, pageId) {
    let jsonPageObjects = objects?.data?.pages ?? [];

    // await routesController.flushAllData();
    // Add all destinations first (synchronous operation)
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
    // Add all destinations first (synchronous operation)
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
    // Add all destinations first (synchronous operation)
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
    } catch (error) {
      console.error("Error in updateRoutes:", error);
      throw error; // Re-throw if you want calling code to handle it
    }
  }

  async updateComponent(objects, projectID, jsonPath, component) {
    let jsonObjects = objects ?? [];
    // Choose processing method based on your needs
    const USE_BATCH_PROCESSING = true; // Set to false for sequential processing
    let processingResults;

    if (USE_BATCH_PROCESSING) {
      // Process pages in batches with enhanced error handling
      processingResults = await this.processPagesInBatches(
        jsonObjects,
        1, // Reduced batch size for better reliability
        async (jsonObj, index) => {
          let pageId = jsonObj["cms_page_Id"];
          let componentName = jsonObj["cms_page_Name"].replace(" ", "_");
          const refPageName = componentName.replace(/-/g, "_");
          const updatedPageName = commonUtils.toPascalCase(refPageName);
          let slug = jsonObj["cms_page_Slug"];
          let defaultSceneName = await this.getDefaultSceneName(jsonObj);
          try {
            // Add small delay before each page processing within batch
            if (index > 0) {
              await new Promise((resolve) => setTimeout(resolve, 100));
            }

            const result = await reactParserComponent.parseComponent(
              jsonObj,
              projectID,
              pageId,
              slug,
              jsonPath,
              updatedPageName,
              defaultSceneName,
              component
              /*projectID,
              pageId,
              slug,
              jsonPath,
              component,
              updatedComponentName*/
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

  async updateElements(objects, projectID, jsonPath, component) {
    let jsonObjects = objects ?? [];
    // Choose processing method based on your needs
    const USE_BATCH_PROCESSING = true; // Set to false for sequential processing
    let processingResults;

    if (USE_BATCH_PROCESSING) {
      // Process pages in batches with enhanced error handling
      processingResults = await this.processPagesInBatches(
        jsonObjects,
        1, // Reduced batch size for better reliability
        async (jsonObj, index) => {
          let pageId = jsonObj["cms_page_Id"];
          let elementName = jsonObj["cms_page_Name"].replace(" ", "_");
          const refPageName = elementName.replace(/-/g, "_");
          const updatedPageName = commonUtils.toPascalCase(refPageName);
          let slug = jsonObj["cms_page_Slug"];
          let defaultSceneName = await this.getDefaultSceneName(jsonObj);
          try {
            // Add small delay before each page processing within batch
            if (index > 0) {
              await new Promise((resolve) => setTimeout(resolve, 100));
            }

            const result = await reactParserComponent.parseComponent(
              jsonObj,
              projectID,
              pageId,
              slug,
              jsonPath,
              updatedPageName,
              defaultSceneName,
              component
              /*projectID,
              pageId,
              slug,
              jsonPath,
              component,
              updatedComponentName*/
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

  async updateLayout(objects, projectID, jsonPath) {
    let jsonObjects = objects ?? [];
    // Choose processing method based on your needs
    const USE_BATCH_PROCESSING = true; // Set to false for sequential processing
    let processingResults;

    if (USE_BATCH_PROCESSING) {
      // Process pages in batches with enhanced error handling
      processingResults = await this.processPagesInBatches(
        jsonObjects,
        1, // Reduced batch size for better reliability
        async (jsonObj, index) => {
          let pageId = jsonObj["cms_page_Id"];
          let pageName = jsonObj["cms_page_Name"].replace(" ", "_");
          const refPageName = pageName.replace(/-/g, "_");
          const updatedPageName = commonUtils.toPascalCase(refPageName);
          let slug = jsonObj["cms_page_Slug"];
          let defaultSceneName = await this.getDefaultSceneName(jsonObj);
          try {
            // Add small delay before each page processing within batch
            if (index > 0) {
              await new Promise((resolve) => setTimeout(resolve, 100));
            }

            const result = await reactParserLayout.parseLayout(
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
            throw error; // Re-throw to be caught by Promise.allSettled
          }
        }
      );
    } else {
    }
  }

  async updatePages(objects, projectID, jsonPath, pageId) {
    let jsonObjects = objects?.data?.pages ?? [];
    if (!Array.isArray(jsonObjects) || jsonObjects.length === 0) {
      console.log("No pages found in project or invalid pages data");
      return;
    }

    // let projectPagePath = `${reactProjectPath}/${projectID}/react_project/src/pages`;
    // await readWriteFile.createFolderIfNotExists(projectPagePath);
    // Add all destinations first (synchronous operation)
    jsonObjects.forEach((jsonObj) => {
      let page_id = jsonObj["cms_page_Id"];
      let slug = jsonObj["cms_page_Slug"];
      let isCurrentPage = String(page_id) === String(pageId);
      homeController.addDestinations(`${slug}`, isCurrentPage);
    });

    // Choose processing method based on your needs
    const USE_BATCH_PROCESSING = true; // Set to false for sequential processing
    let processingResults;

    if (USE_BATCH_PROCESSING) {
      // Process pages in batches with enhanced error handling
      processingResults = await this.processPagesInBatches(
        jsonObjects,
        1, // Reduced batch size for better reliability
        async (jsonObj, index) => {
          let pageId = jsonObj["cms_page_Id"];
          let pageName = jsonObj["cms_page_Name"].replace(" ", "_");
          const refPageName = pageName.replace(/-/g, "_");
          const updatedPageName = commonUtils.toPascalCase(refPageName);
          let slug = jsonObj["cms_page_Slug"];
          let defaultSceneName = await this.getDefaultSceneName(jsonObj);
          try {
            // Add small delay before each page processing within batch
            if (index > 0) {
              await new Promise((resolve) => setTimeout(resolve, 100));
            }

            const result = await parserPageContentReact.parsePageContent(
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
      ? processingResults.filter((r) => r?.success !== false && !r?.error)
          .length
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

    // await homeController.createAndUpdateHomeController(defaultSlug);
  }

  async createAndroidProject(projectID, pageId, platform) {
    commonUtils.projectId = projectID;
    commonUtils.pageId = pageId;
    commonUtils.platform = platform;

    await readWriteFile.createFolderIfNotExists(androidProjectPath);
    let projectFolderPath = `${androidProjectPath}/${projectID}/export_files`;
    console.log(`projectFolderPath: ${projectFolderPath}`);
    await readWriteFile.createFolderIfNotExists(projectFolderPath);
    await readWriteFile.deleteFilesAndFolders(projectFolderPath);

    try {
      await parserPageContentAndroid.mobilePage(projectFolderPath);
    } catch (error) {
      console.error("Error in run:", error);
    }
  }

  async createIosProject(projectID, pageId, platform) {
    commonUtils.projectId = projectID;
    commonUtils.pageId = pageId;
    commonUtils.platform = platform;

    await readWriteFile.createFolderIfNotExists(iosProjectPath);
    let projectFolderPath = `${iosProjectPath}/${projectID}/export_files`;
    console.log(`projectFolderPath: ${projectFolderPath}`);
    await readWriteFile.createFolderIfNotExists(projectFolderPath);
    await readWriteFile.deleteFilesInFolder(projectFolderPath);

    try {
      await parserPageContentIos.mobilePage(projectFolderPath);
    } catch (error) {
      console.error("Error in run:", error);
    }
  }

  async getDefaultSceneName(data) {
    // console.log("data in getDefaultSceneName:", data);
    const defaultSceneId = data.cms_page_Default_Scene;
    const defaultScene = data.scene.find(
      (scene) => scene.cms_page_Id === defaultSceneId
    );
    const defaultSceneName = (defaultScene ? defaultScene.cms_page_Name : "")
      .replace(/-/g, "_")
      .replace(/-/g, "_");
    const pascalCaseName = commonUtils.toPascalCase(defaultSceneName);
    return pascalCaseName;
  }

  //robot.txt
  async generateRobotsTxt(projectID, jsonPath, basePath = null) {
    try {
      let projectInfoPath = jsonPath + `/project_info.json`;
      if (require.cache[require.resolve(projectInfoPath)]) {
        delete require.cache[require.resolve(projectInfoPath)];
      }

      // let objects = require(projectInfoPath);
      let subProjectPath = projectID;

      let robotsContent = "User-agent: *\nAllow: /\n";

      // Point to the generated sitemap
      // If hostname consistent with sitemap generation
      const hostname = `https://staging.cmsexport.react.redoq.host/${subProjectPath}/`;
      robotsContent += `Sitemap: ${hostname}sitemap.xml\n`;

      const projectFolderPath = `${
        basePath || reactProjectPath
      }/${projectID}/react_project`;
      const publicFolderPath = `${projectFolderPath}/public`;

      await readWriteFile.createFolderIfNotExists(publicFolderPath);
      await readWriteFile.writeToFile(
        `${publicFolderPath}/robots.txt`,
        robotsContent
      );
      console.log("robots.txt generated successfully.");
    } catch (error) {
      console.error("Error generating Robots.txt", error);
    }
  }
}

module.exports = new App();
