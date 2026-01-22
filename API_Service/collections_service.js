const commonUtils = require("../utility/common_utils");
const projectStatus = require("../utility/update_project_status");
const readWriteFile = require("../utility/read_write_file");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

async function fetchCollections(workspaceId = 0, filePath = "") {
  filePath = filePath + `/collections.json`;
  const apiUrl = `https://sankar.kuickapi.nodejs.redoq.host/api/collection/v2/full/collections`;
  const headers = {
    "Content-Type": "application/json",
  };
  const requestBody = {
    inputData: {
      workspaceId: `${workspaceId}`,
    },
  };

  try {
    const startTime = performance.now();
    const response = await axios.post(apiUrl, requestBody, { headers });
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // console.log(`fetchCollections:`, response);
    // console.log(`API URL: ${apiUrl}`);
    // console.log(`API Response Time: ${responseTime.toFixed(2)}ms`);

    await readWriteFile.writeToFile(
      filePath,
      JSON.stringify(response.data, null, 2)
    );

    await projectStatus.updateProjectStatus(
      commonUtils.projectId,
      commonUtils.platform,
      "processing"
    );
    return "success";
  } catch (error) {
    console.error("API Error in fetchPageJson:", error);
    return "failure";
  }
}

// Function to filter and get item objects by server_id
async function getItemByServerId(jsonFilePath, targetServerId) {
  // Clear the require cache to ensure fresh read
  await delete require.cache[require.resolve(jsonFilePath)];
  const data = await require(jsonFilePath);
  // Convert targetServerId to string for comparison
  const targetId = targetServerId.toString();

  // Recursive function to search through nested items
  function searchItems(items) {
    for (const item of items) {
      // Check if current item matches the target server_id
      if (
        item.server_id &&
        item.server_id.toString() === targetId &&
        item.collection_type === "item"
      ) {
        return item;
      }

      // If item has nested items, search recursively
      if (item.item && Array.isArray(item.item) && item.item.length > 0) {
        const found = searchItems(item.item);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  // Search through all collections
  if (data && data.data && Array.isArray(data.data)) {
    for (const collection of data.data) {
      if (collection.item && Array.isArray(collection.item)) {
        const result = searchItems(collection.item);
        if (result) {
          return result;
        }
      }
    }
  }

  return null; // Return null if not found
}

module.exports = {
  fetchCollections,
  getItemByServerId,
};
