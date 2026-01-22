const commonPath = require("../utility/common_path");
const readWriteFile = require("../utility/read_write_file");
const StateHandler = require("../utility/state_handler");
const reactUtilits = require("../parser/React/common_utilits_react");
const routesController = require("../parser/React/react_parser_routes");
const commonUtils = require("../utility/common_utils");
const projectStatus = require("../utility/update_project_status");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const reactProjectPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectPath.get(commonPath.environmentHosting)}`
);

// Fetch App level States
async function fetchGlobalState(project_Id = 0) {
  let subProjectPath = project_Id;
  let filePath = `${reactProjectPath}/${subProjectPath}/jsons/state.json`;
  const apiUrl = `${commonPath.BaseUrl.get(
    commonPath.environment
  )}redoqcms/app/get-global-state`;
  const headers = {
    "Content-Type": "application/json",
  };
  const requestBody = {
    inputData: {
      cms_project_Id: project_Id,
    },
  };

  try {
    const startTime = performance.now();
    const response = await axios.post(apiUrl, requestBody, { headers });
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    console.log(`fetchGlobalState:`);
    console.log(`API URL: ${apiUrl}`);
    console.log(`API Response Time: ${responseTime.toFixed(2)}ms`);

    await readWriteFile.deleteFile(filePath);
    await readWriteFile.writeToFile(
      filePath,
      JSON.stringify(response.data, null, 2)
    );
    await appStates(filePath);
    await projectStatus.updateProjectStatus(
      project_Id,
      commonUtils.platform,
      "processing"
    );
    return "success";
  } catch (error) {
    console.error("API Error in fetchPageJson:", error);
    return "failure";
  }
}

async function appStates(jsonPath) {
  //   let subProjectPath = projectId;
  //   let jsonPath = `${reactProjectPath}/${subProjectPath}/jsons/state.json`;
  await delete require.cache[require.resolve(jsonPath)];
  objects = await require(jsonPath);
  let appObject = objects?.data?.appStates;
  let statesObjectValue = appObject?.value ?? "";
  if (statesObjectValue !== "") {
    const keys = Object.keys(statesObjectValue);
    // console.log("Keys of statesObjectValue:", keys);
    for (const key of keys) {
      const state = statesObjectValue[key] ?? "";
      if (state !== "") {
        const id = state?.id ?? "";
        let stateId = state?.id ?? "";
        const managementStateId = state?.managementStateId ?? "";
        const name = state?.name ?? "";
        const valueType = state?.valueType ?? "";
        const defaultValue = state?.defaultValue ?? "";
        const persist = state?.persist ?? "";
        routesController.states.push({
          id: id,
          stateId: stateId,
          managementStateId: managementStateId,
          name: name,
          valueType: valueType,
          defaultValue: defaultValue,
          persist: persist,
        });
      }
    }
    // console.log("States after processing appStates:", routesController.states);
  } else {
    // widgetObject is "", handle the empty case
  }

  let statesObjectStyle = appObject?.style ?? "";
  if (statesObjectStyle !== "") {
    const keys = Object.keys(statesObjectStyle);
    for (const key of keys) {
      const state = statesObjectStyle[key] ?? "";
      if (state !== "") {
        const id = state?.id ?? "";
        let stateId = state?.id ?? "";
        const managementStateId = state?.managementStateId ?? "";
        const name = state?.name ?? "";
        const valueType = state?.valueType ?? "";
        const defaultValue = state?.defaultValue ?? "";
        const persist = state?.persist ?? "";
        routesController.states.push({
          id: id,
          stateId: stateId,
          managementStateId: managementStateId,
          name: name,
          valueType: valueType,
          defaultValue: defaultValue,
          persist: persist,
        });
      }
    }
  } else {
    // widgetObject is "", handle the empty case
  }

  let statesObjectOutput = appObject?.output ?? "";
  if (statesObjectOutput !== "") {
    const keys = Object.keys(statesObjectOutput);
    for (const key of keys) {
      const state = statesObjectOutput[key] ?? "";
      if (state !== "") {
        const id = state?.id ?? "";
        let stateId = state?.id ?? "";
        const managementStateId = state?.managementStateId ?? "";
        const name = state?.name ?? "";
        const valueType = state?.valueType ?? "";
        const defaultValue = state?.defaultValue ?? "";
        const persist = state?.persist ?? "";
        routesController.states.push({
          id: id,
          stateId: stateId,
          managementStateId: managementStateId,
          name: name,
          valueType: valueType,
          defaultValue: defaultValue,
          persist: persist,
        });
      }
    }
  } else {
    // widgetObject is "", handle the empty case
  }
}

// Fetch Page level States
async function fetchPageState(project_Id = 0, page_id = 0, fileName = "") {
  let subProjectPath = project_Id;
  let filePath = `${reactProjectPath}/${subProjectPath}/jsons/state_${page_id}.json`;
  const apiUrl = `${commonPath.BaseUrl.get(
    commonPath.environment
  )}redoqcms/app/get-page-state`;
  const headers = {
    "Content-Type": "application/json",
  };
  const requestBody = {
    inputData: {
      cms_project_Id: project_Id,
      cms_page_Id: page_id,
    },
  };

  try {
    const startTime = performance.now();
    const response = await axios.post(apiUrl, requestBody, { headers });
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    console.log(`fetchPageState: ${fileName}`);
    console.log(`API URL: ${apiUrl}`);
    console.log(`API Response Time: ${responseTime.toFixed(2)}ms`);

    await readWriteFile.deleteFile(filePath);
    await readWriteFile.writeToFile(
      filePath,
      JSON.stringify(response.data, null, 2)
    );
    await pageStates(page_id, filePath, fileName);
    await projectStatus.updateProjectStatus(
      project_Id,
      commonUtils.platform,
      "processing"
    );
    return "success";
  } catch (error) {
    console.error("API Error in fetchPageJson:", error);
    return "failure";
  }
}

async function pageStates(pageId, jsonPath, fileName) {
  let stateObjects = [];
  await delete require.cache[require.resolve(jsonPath)];
  let objects = await require(jsonPath);
  let pageObject = objects?.data?.pageStates;
  let statesObject = pageObject?.[`${pageId}`] ?? "";
  if (statesObject !== "") {
    const statesValue = statesObject["value"] ?? "";
    if (statesValue !== "") {
      const statesKeys = Object.keys(statesValue);
      for (const statesKey of statesKeys) {
        let object = {};
        const stateValueObj = statesValue[statesKey];
        let managementStateId = stateValueObj?.managementStateId ?? "";
        let stateId = stateValueObj?.id ?? "";
        let name = stateValueObj?.name ?? "";
        let setMethodName = `set${await reactUtilits.capitalizeFirst(name)}`;
        let valueType = stateValueObj?.valueType;
        let defaultValue = stateValueObj?.defaultValue;
        let persist = stateValueObj?.persist;

        object.managementStateId = managementStateId;
        object.stateId = stateId;
        object.name = name;
        object.setMethodName = setMethodName;
        object.valueType = valueType;
        object.defaultValue = defaultValue;
        object.widgetId = "0";
        object.widgetId = "0";
        object.persist = persist;

        stateObjects.push(object);
      }
    }

    const statesStyle = statesObject["style"] ?? "";
    if (statesStyle !== "") {
      const stateStyleKeys = Object.keys(statesStyle);
      for (const stateStyleKey of stateStyleKeys) {
        let object = {};
        const stateStyleObj = statesStyle[stateStyleKey];
        let managementStateId = stateStyleObj?.managementStateId ?? "";
        let stateId = stateStyleObj?.id ?? "";
        let name = stateStyleObj?.name ?? "";
        let setMethodName = `set${await reactUtilits.capitalizeFirst(name)}`;
        let valueType = stateStyleObj?.valueType;
        let defaultValue = stateStyleObj?.defaultValue;
        let persist = stateStyleObj?.persist;

        object.managementStateId = managementStateId;
        object.stateId = stateId;
        object.name = name;
        object.setMethodName = setMethodName;
        object.valueType = valueType;
        object.defaultValue = defaultValue;
        object.widgetId = "0";
        object.persist = persist;

        stateObjects.push(object);
      }
    }

    const statesOutput = statesObject["output"] ?? "";
    if (statesOutput !== "") {
      const stateOutputKeys = Object.keys(statesOutput);
      for (const stateOutputKey of stateOutputKeys) {
        let object = {};
        const stateOutputObj = statesOutput[stateOutputKey];
        let managementStateId = stateOutputObj?.managementStateId ?? "";
        let stateId = stateOutputObj?.id ?? "";
        let name = stateOutputObj?.name ?? "";
        let setMethodName = `set${await reactUtilits.capitalizeFirst(name)}`;
        let valueType = stateOutputObj?.valueType;
        let defaultValue = stateOutputObj?.defaultValue;
        let persist = stateOutputObj?.persist;

        object.managementStateId = managementStateId;
        object.stateId = stateId;
        object.name = name;
        object.setMethodName = setMethodName;
        object.valueType = valueType;
        object.defaultValue = defaultValue;
        object.widgetId = "0";
        object.persist = persist;

        stateObjects.push(object);
      }
    }

    let widgetObjects = statesObject?.widgets ?? "";
    const keys = Object.keys(widgetObjects);
    for (const key of keys) {
      const widget = widgetObjects[key];
      const widgetValue = widget["value"] ?? "";
      if (widgetValue !== "") {
        const widgetValueKeys = Object.keys(widgetValue);
        for (const widgetValueKey of widgetValueKeys) {
          let object = {};
          const widgetValueObj = widgetValue[widgetValueKey];
          let managementStateId = widgetValueObj?.managementStateId ?? "";
          let stateId = widgetValueObj?.id ?? "";
          let name = widgetValueObj?.name ?? "";
          let setMethodName = `set${await reactUtilits.capitalizeFirst(name)}`;
          let valueType = widgetValueObj?.valueType;
          let defaultValue = widgetValueObj?.defaultValue;
          let persist = widgetValueObj?.persist;
          let widgetId = key;

          object.managementStateId = managementStateId;
          object.stateId = stateId;
          // object.name = name;
          object.name = `${name}${managementStateId}`;
          // object.setMethodName = setMethodName;
          object.setMethodName = `${setMethodName}${managementStateId}`;
          object.valueType = valueType;
          object.defaultValue = defaultValue;
          object.widgetId = widgetId;
          object.persist = persist;

          stateObjects.push(object);
        }
      }

      const widgetStyle = widget["style"] ?? "";
      if (widgetStyle !== "") {
        const widgetStyleKeys = Object.keys(widgetStyle);
        for (const widgetStyleKey of widgetStyleKeys) {
          let object = {};
          const widgetStyleObj = widgetStyle[widgetStyleKey];
          let managementStateId = widgetStyleObj?.managementStateId ?? "";
          let stateId = widgetStyleObj?.id ?? "";
          let name = widgetStyleObj?.name ?? "";
          let setMethodName = `set${await reactUtilits.capitalizeFirst(name)}`;
          let valueType = widgetStyleObj?.valueType;
          let defaultValue = widgetStyleObj?.defaultValue;
          let persist = widgetStyleObj?.persist;
          let widgetId = key;

          object.managementStateId = managementStateId;
          object.stateId = stateId;
          object.name = name;
          object.setMethodName = setMethodName;
          object.valueType = valueType;
          object.defaultValue = defaultValue;
          object.widgetId = widgetId;
          object.persist = persist;

          stateObjects.push(object);
        }
      }

      const widgetOutput = widget["output"] ?? "";
      if (widgetOutput !== "") {
        // console.log("widgetOutput:", widgetOutput);
        const widgetOutputKeys = Object.keys(widgetOutput);
        for (const widgetOutputKey of widgetOutputKeys) {
          let object = {};
          const widgetOutputObj = widgetOutput[widgetOutputKey];
          let managementStateId = widgetOutputObj?.managementStateId ?? "";
          let stateId = widgetOutputObj?.id ?? "";
          let name = widgetOutputObj?.name ?? "";
          let setMethodName = `set${await reactUtilits.capitalizeFirst(name)}`;
          let valueType = widgetOutputObj?.valueType;
          let defaultValue = widgetOutputObj?.defaultValue;
          let persist = widgetOutputObj?.persist;
          let widgetId = key;

          object.managementStateId = managementStateId;
          object.stateId = stateId;
          object.name = name;
          object.setMethodName = setMethodName;
          object.valueType = valueType;
          object.defaultValue = defaultValue;
          object.widgetId = widgetId;
          object.persist = persist;

          stateObjects.push(object);
        }
      }
    }
  } else {
    // widgetObject is "", handle the empty case
  }

  const stateHandler = StateHandler.getInstance();
  stateHandler.states = { key: String(`${pageId}`), value: stateObjects };
}

module.exports = {
  fetchGlobalState,
  fetchPageState,
};
