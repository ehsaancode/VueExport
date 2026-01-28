const commonPath = require("../../utility/common_path");
const readWriteFile = require("../../utility/read_write_file");
const collectionsService = require("../../API_Service/collections_service");
const datasetService = require("../../API_Service/dataset_service");
const path = require("path");

const vueProjectPath = path.resolve(
  __dirname,
  `${commonPath.vueProjectPath.get(commonPath.environmentHosting)}`
);

async function getFormConfigForItem(projectId, pageId, formItemId) {
  let subProjectPath = projectId;
  let jsonPath = `${vueProjectPath}/${subProjectPath}/jsons/mapper_${pageId}.json`;
  if (await readWriteFile.fileExists(jsonPath)) {
    await delete require.cache[require.resolve(jsonPath)];
    let objects = await require(jsonPath);
    const [formId, itemId] = formItemId.split("-");

    let widgetsObject = objects?.data?.action_mapper_Json?.widgets;
    let widgetObject = widgetsObject?.[`${formId}`] ?? "";
    if (widgetObject !== "") {
      let widgetStates = widgetObject?.state ?? "";
      if (widgetStates !== "") {
        let widgetStyle = widgetStates?.props ?? "";
        let states = widgetStates?.state_data;

        if (widgetStyle !== "") {
          const keys = Object.keys(widgetStyle);
          const widgetStateId = widgetStyle["formModel"]?.key_id;
          //  console.log('keys',states[widgetStateId])
          let styleDefaultValue = states[widgetStateId]?.default_value ?? "";
          if (styleDefaultValue !== "") {
            const defaultObject = JSON.parse(styleDefaultValue);
            const model = defaultObject?.model ?? "";
            const fields = model?.fields ?? "";
            const fieldConfig = fields?.[`${itemId}`] ?? "";
            return fieldConfig;
          }
        }
      }
    }
  }
}

async function getFormItemConfig(projectId, pageId, formItemId) {
  let subProjectPath = projectId;
  let jsonPath = `${vueProjectPath}/${subProjectPath}/jsons/mapper_${pageId}.json`;
  await delete require.cache[require.resolve(jsonPath)];
  let objects = await require(jsonPath);

  let widgetsObject = objects?.data?.action_mapper_Json?.widgets;
  let widgetObject = widgetsObject?.[`${formItemId}`] ?? "";
  // console.log("widgetObject", JSON.stringify(widgetObject));
  if (widgetObject !== "") {
    let widgetStates = widgetObject?.state ?? "";
    if (widgetStates !== "") {
      let defaultState = widgetStates?.props?.defaultDropdownState?.key_id;

      let styleDefaultValue =
        widgetStates?.state_data?.[defaultState]?.default_value ?? "";
      console.log("styleDefaultValue", styleDefaultValue);

      if (styleDefaultValue != "") {
        const defaultObject = JSON.parse(styleDefaultValue);
        return defaultObject;
      }
    }
  }
}

async function getFormSubmitApiDetails(projectId, pageId, formItemId) {
  let subProjectPath = projectId;
  let jsonPath = `${vueProjectPath}/${subProjectPath}/jsons/mapper_${pageId}.json`;
  await delete require.cache[require.resolve(jsonPath)];
  let objects = await require(jsonPath);
  const [formId, itemId] = formItemId.split("-");

  let widgetsObject = objects?.data?.cms_state_action_mapper_Json?.widgets;
  let widgetObject = widgetsObject?.[`${formId}`] ?? "";
  if (widgetObject !== "") {
    let widgetActionFlow = widgetObject?.actionFlow ?? "";
    if (widgetActionFlow !== "") {
      let formSubmitObjects = widgetActionFlow?.formSubmit ?? [];
      if (formSubmitObjects.length > 0) {
        for (let i = 0; i < formSubmitObjects.length; i++) {
          let formSubmitObject = formSubmitObjects[i];
          let component = formSubmitObject?.component ?? "";
          if (component !== "") {
            let componentType = component?.componentType ?? "";
            if (componentType === "api_call") {
              const apiReqId = component?.componentBody?.apiReqId ?? "";
              const dataSetId = component?.componentBody?.dataSetId ?? "";
              const apiDetails = await collectionsService.getItemByServerId(
                collectionJsonPath,
                apiReqId
              );
              let datasetPath = datasetObj?.api_data_Set_Path ?? "";
              const simplifiedPath = simplifyTargetKey(datasetPath);
              let datasetObj =
                (await datasetService.fetchDataset(apiReqId, dataSetId)) ?? {};
            }
          }
        }
      }
    }
  }
}

async function getFormSubmitPayloadObject(projectId, pageId, formItemId) {
  let subProjectPath = projectId;
  let jsonPath = `${vueProjectPath}/${subProjectPath}/jsons/mapper_${pageId}.json`;
  await delete require.cache[require.resolve(jsonPath)];
  let objects = await require(jsonPath);
  const [formId, itemId] = formItemId.split("-");

  let widgetsObject = objects?.data?.cms_state_action_mapper_Json?.widgets;
  let widgetObject = widgetsObject?.[`${formId}`] ?? "";
  if (widgetObject !== "") {
    let widgetActionFlow = widgetObject?.actionFlow ?? "";
    if (widgetActionFlow !== "") {
      let formSubmitObjects = widgetActionFlow?.formSubmit ?? [];
      if (formSubmitObjects.length > 0) {
        for (let i = 0; i < formSubmitObjects.length; i++) {
          let formSubmitObject = formSubmitObjects[i];
          let component = formSubmitObject?.component ?? "";
          if (component !== "") {
            let componentType = component?.componentType ?? "";
            if (componentType === "api_call") {
              const apiReqId = component?.componentBody?.apiReqId ?? "";
              const dataSetId = component?.componentBody?.dataSetId ?? "";
              const apiDetails = await collectionsService.getItemByServerId(
                collectionJsonPath,
                apiReqId
              );
              let datasetPath = datasetObj?.api_data_Set_Path ?? "";
              const simplifiedPath = simplifyTargetKey(datasetPath);
              let datasetObj =
                (await datasetService.fetchDataset(apiReqId, dataSetId)) ?? {};
            }
          }
        }
      }
    }
  }
}

module.exports = {
  getFormConfigForItem,
  getFormItemConfig,
  getFormSubmitApiDetails,
  getFormSubmitPayloadObject,
};
