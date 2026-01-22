const readWriteFile = require("../../utility/read_write_file");
const actionFlowHandler = require("../../utility/action_flow_handler");
const commonPath = require("../../utility/common_path");
const stateHandler = require("../../utility/state_handler");
// const actionFlowHandler = require("../../utility/action_flow_handler");
const reactUtilits = require("../../parser/React/common_utilits_react");
const collectionsService = require("../../API_Service/collections_service");
const { navigateMapper } = require("./reactjs_mapper_navigation");
const { endNavigateMapper } = require("./reactjs_mapper_navigation");
const apiCallMapper = require("./reactjs_mapper_apicall");
const reactjsMapperOnclick = require("./reactjs_mapper_onclick");
const reactjsMapperOnload = require("./reactjs_mapper_onload");
const reactjsMapperFormSubmit = require("./reactjs_mapper_form_submit");
const mapperStateManagement = require("./reactjs_mapper_state_management");
const commonUtils = require("../../utility/common_utils");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

let objects = {};

const reactProjectPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectPath.get(commonPath.environmentHosting)}`
);

async function startMapper(projectId, pageId, filePath) {
  /*console.log(`✅ Mapper started`);
  const lastComponent = path.basename(filePath);
  await reactUtilits.clearActionsForTag(lastComponent);
  reactUtilits.actionObjects[lastComponent] = "";
  // actions.length = 0; // Clear previous actions
  // actions = [];
  let subProjectPath = projectId;
  let jsonPath = `${reactProjectPath}/${subProjectPath}/jsons/mapper_${pageId}.json`;
  await delete require.cache[require.resolve(jsonPath)];
  objects = await require(jsonPath);*/
}

async function getPropsAndStateVariablesFromWidget(
  projectId,
  pageId,
  widgetID
) {
  let stateObjects = [];
  let subProjectPath = projectId;
  let jsonPath = `${reactProjectPath}/${subProjectPath}/jsons/mapper_${pageId}.json`;
  // console.log('jsonPath',jsonPath)
  if ((await readWriteFile.fileExists(jsonPath)) == true) {
    await delete require.cache[require.resolve(jsonPath)];
    let mapperObjects = await require(jsonPath);
    let widgetsObject = mapperObjects?.data?.action_mapper_Json?.widgets;
    let widgetObject = widgetsObject?.[`${widgetID}`] ?? "";
    // console.log(`widgetsObject: ${JSON.stringify(widgetsObject)}  widgetID: ${widgetID}`);
    if (widgetObject !== "") {
      let stateObject = widgetObject?.state ?? "";
      if (stateObject !== "") {
        let propsObjects = stateObject?.props ?? "";
        if (propsObjects !== "") {
          const propsKeys = Object.keys(propsObjects);
          for (const propsKey of propsKeys) {
            let propObject = {};
            const props = propsObjects[propsKey];
            const stateId = props?.state_id ?? "";
            const handler = stateHandler.getInstance();
            let stateInfo = handler.getStateByManagementId(
              String(pageId),
              String(stateId)
            );
            let appStateInfo = handler.getAppStateByField(
              "managementStateId",
              String(stateId)
            );

            propObject.prop = propsKey;
            propObject.stateVariableName = stateInfo?.name ?? "";
            propObject.appStateVariableName = appStateInfo?.name ?? "";

            stateObjects.push(propObject);
          }
        }
      }
    }
  }
  return stateObjects;
}

async function startReactjsMapper(projectId, pageId, fileName, widgetID) {
  // console.log(`✅ ReactJS Mapper started for widgetID: ${widgetID}`);
  // console.log(`fileName: ${fileName}`);
  // console.log(`projectId: ${projectId}, pageId: ${pageId}`);
  let subProjectPath = projectId;
  let jsonPath = `${reactProjectPath}/${subProjectPath}/jsons/action_${pageId}.json`;
  await delete require.cache[require.resolve(jsonPath)];
  let actionObjects = await require(jsonPath);
  let onClickObjects = await actionFlowHandler.getNodesByTriggerAndWidget(
    actionObjects,
    "On Click",
    widgetID ?? 0,
    pageId
  );
  let onLoadObjects = await actionFlowHandler.getNodesByTriggerAndWidget(
    actionObjects,
    "On Load",
    widgetID ?? 0,
    pageId
  );

    // console.log(`onLoadObjects: ${JSON.stringify(onLoadObjects)}`);


  let formSubmitObjects = await actionFlowHandler.getNodesByTriggerAndWidget(
    actionObjects,
    "formSubmit",
    widgetID ?? 0,
    pageId
  );
  // console.log(`onClickObjects length: ${onClickObjects.length}`);
  // console.log(`onLoadObjects length: ${onLoadObjects.length}`);
  // console.log(`formSubmitObjects length: ${formSubmitObjects.length}`);

  if (onLoadObjects?.length > 0) {
    await reactjsMapperOnload.onloadReactjsMapper(
      onLoadObjects[0],
      fileName,
      widgetID,
      projectId,
      pageId
    );
    /*await readWriteFile.writeToFile(
      fileName,
      `<QActionFlow
        `
    );
    await apiCallMapper.apiCallMapperOnLoad(
      `${reactProjectPath}/${subProjectPath}/jsons`,
      fileName,
      onLoadObjects[0],
      widgetID,
      pageId
    );
    await readWriteFile.writeToFile(fileName, `>`);*/
  }

  if (onClickObjects?.length > 0) {
   //  console.log(`onClickObjects: ${JSON.stringify(onClickObjects)}`);
    await reactjsMapperOnclick.onclickReactjsMapper(
      onClickObjects[0],
      fileName,
      widgetID,
      projectId,
      pageId
    );
    /*await readWriteFile.writeToFile(
      fileName,
      `<QActionFlow
            actions={actions}
              triggers={{
        `
    );

    await apiCallMapper.apiCallMapperOnClick(
      `${reactProjectPath}/${subProjectPath}/jsons`,
      fileName,
      onClickObjects[0],
      widgetID
    );

    await navigateMapper(fileName, onClickObjects[0]);

    await readWriteFile.writeToFile(
      fileName,
      `
                  }}
                >
                `
    );*/
  }

  if (formSubmitObjects?.length > 0) {
    await reactjsMapperFormSubmit.formSubmitReactjsMapper(
      formSubmitObjects[0],
      fileName,
      widgetID,
      projectId,
      pageId
    );
    /*await readWriteFile.writeToFile(
      fileName,
      `<QActionFlow
            actions={actions}
              triggers={{
        `
    );

    await apiCallMapper.apiCallMapperFormSubmit(
      `${reactProjectPath}/${subProjectPath}/jsons`,
      fileName,
      formSubmitObjects[0],
      widgetID
    );

    await readWriteFile.writeToFile(
      fileName,
      `
                  }}
                >
                `
    );*/
  }
  /*let subProjectPath = projectId;
  // let jsonPath = `${reactProjectPath}/${subProjectPath}/jsons/mapper_${pageId}.json`;
  // await delete require.cache[require.resolve(jsonPath)];
  let jsonPath = `${reactProjectPath}/${subProjectPath}/jsons`;
  // let objects = await require(jsonPath);
  let widgetsObject = objects?.data?.cms_state_action_mapper_Json?.widgets;
  let widgetObject = widgetsObject?.[`${widgetID}`] ?? "";
  if (widgetObject !== "") {
    // widgetObject is an object, proceed with logic
    let widgetAction = widgetObject?.actionFlow ?? "";
    if (widgetAction !== "") {
      let onClickObjects = widgetAction?.onClick ?? [];
      let onLoadObjects = widgetAction?.onLoad ?? [];

      if (onLoadObjects.length > 0) {
        await readWriteFile.writeToFile(
          fileName,
          `<QActionFlow
        `
        );
        await apiCallMapper.apiCallMapperOnLoad(
          jsonPath,
          fileName,
          onLoadObjects
        );
        await readWriteFile.writeToFile(fileName, `>`);
      }

      if (onClickObjects.length > 0) {
        await readWriteFile.writeToFile(
          fileName,
          `<QActionFlow
            actions={actions}
              triggers={{
        `
        );

        await apiCallMapper.apiCallMapperOnClick(
          jsonPath,
          fileName,
          onClickObjects
        );

        await navigateMapper(fileName, onClickObjects);

        await readWriteFile.writeToFile(
          fileName,
          `
                  }}
                >
                `
        );
      }
    }
  } else {
    // widgetObject is "", handle the empty case
  }*/
}

async function endReactjsMapper(projectId, pageId, fileName, widgetID) {
  let subProjectPath = projectId;
  let jsonPath = `${reactProjectPath}/${subProjectPath}/jsons/action_${pageId}.json`;
  await delete require.cache[require.resolve(jsonPath)];
  let actionObjects = await require(jsonPath);
  let onClickObjects = await actionFlowHandler.getNodesByTriggerAndWidget(
    actionObjects,
    "On Click",
    widgetID,
    pageId
  );
  let onLoadObjects = await actionFlowHandler.getNodesByTriggerAndWidget(
    actionObjects,
    "On Load",
    widgetID,
    pageId
  );
  let formSubmitObjects = await actionFlowHandler.getNodesByTriggerAndWidget(
    actionObjects,
    "formSubmit",
    widgetID,
    pageId
  );
  if (
    onClickObjects?.length > 0
    // onLoadObjects.length > 0 ||
    //  formSubmitObjects.length > 0
  ) {
    await readWriteFile.writeToFile(fileName, "</QActionFlow>\n\n");
  }

  /*let subProjectPath = projectId;
  let jsonPath = `${reactProjectPath}/${subProjectPath}/jsons/mapper_${pageId}.json`;
  let objects = require(jsonPath);
  let widgetsObject = objects?.data?.cms_state_action_mapper_Json?.widgets;
  let widgetObject = widgetsObject?.[`${widgetID}`] ?? "";
  if (widgetObject !== "") {
    let widgetAction = widgetObject?.actionFlow ?? "";
    if (widgetAction !== "") {
      await readWriteFile.writeToFile(fileName, "</QActionFlow>\n\n");
    } else {
    }
  } else {
    // widgetObject is "", handle the empty case
  }*/
}

async function endFileActions(fileName) {
  const lastComponent = `${path.basename(fileName)}_${
    commonUtils.windowDevice
  }`;
  let objOnClickActions = await actionFlowHandler.getActionsArray(
    lastComponent
  );
  let objOnLoadActions = await actionFlowHandler.getOnLoadActionsArray(
    lastComponent
  );
  let objFormSubmitActions = await actionFlowHandler.getFormSubmitActionsArray(
    lastComponent
  );
  let actionsString = "const actions = {\n";
  if (objOnClickActions.length > 0) {
    for (let i = 0; i < objOnClickActions.length; i++) {
      let action = objOnClickActions[i];
      if (action.method !== undefined) {
        actionsString += `      ${action.method},\n`;
      }
    }
  }
  if (objOnLoadActions.length > 0) {
    for (let i = 0; i < objOnLoadActions.length; i++) {
      let action = objOnLoadActions[i];
      if (action.method !== undefined) {
        actionsString += `      ${action.method},\n`;
      }
    }
  }
  if (objFormSubmitActions.length > 0) {
    for (let i = 0; i < objFormSubmitActions.length; i++) {
      let action = objFormSubmitActions[i];
      if (action.method !== undefined) {
        actionsString += `      ${action.method},\n`;
      }
    }
  }
  actionsString += "  };\n";
  await readWriteFile.replaceWordInFile(
    fileName,
    "[action_actions]",
    actionsString
  );

  if (objOnLoadActions.length > 0) {
    let useEffectString = "useEffect(() => {\n";

    for (let i = 0; i < objOnLoadActions.length; i++) {
      let action = objOnLoadActions[i];
      if (action.method !== undefined) {
        useEffectString += `      ${action.method}();\n`;
      }
    }

    useEffectString += "   }, []);\n";
    await readWriteFile.replaceWordInFile(
      fileName,
      "[onload_useEffect]",
      useEffectString
    );
  }

  await actionFlowHandler.insertAction(lastComponent, []);
  await actionFlowHandler.insertOnLoadAction(lastComponent, []);
  /*const lastComponent = `${path.basename(fileName)}_${
    commonUtils.windowDevice
  }`;
  let objOnClickActions = await reactUtilits.getActionsArray(lastComponent);
  let objOnLoadActions = await reactUtilits.getOnLoadActionsArray(
    lastComponent
  );
  let actionsString = "const actions = {\n";
  if (objOnClickActions.length > 0) {
    for (let i = 0; i < objOnClickActions.length; i++) {
      let action = objOnClickActions[i];
      if (action.method !== undefined) {
        actionsString += `      ${action.method},\n`;
      }
    }
  }
  if (objOnLoadActions.length > 0) {
    for (let i = 0; i < objOnLoadActions.length; i++) {
      let action = objOnLoadActions[i];
      if (action.method !== undefined) {
        actionsString += `      ${action.method},\n`;
      }
    }
  }
  actionsString += "  };\n";
  await readWriteFile.replaceWordInFile(
    fileName,
    "[action_actions]",
    actionsString
  );

  if (objOnLoadActions.length > 0) {
    let useEffectString = "useEffect(() => {\n";

    for (let i = 0; i < objOnLoadActions.length; i++) {
      let action = objOnLoadActions[i];
      if (action.method !== undefined) {
        useEffectString += `      ${action.method}();\n`;
      }
    }

    useEffectString += "   }, []);\n";
    await readWriteFile.replaceWordInFile(
      fileName,
      "[onload_useEffect]",
      useEffectString
    );
  }

  await reactUtilits.insertAction(lastComponent, []);
  await reactUtilits.insertOnLoadAction(lastComponent, []);*/
}

async function endMapper(fileName, pageId = 0) {
  await mapperStateManagement.updateAsignedState(fileName, pageId);
  await endNavigateMapper(fileName);
  // console.log("✅ Mapper completed");
}

module.exports = {
  startMapper,
  getPropsAndStateVariablesFromWidget,
  startReactjsMapper,
  endReactjsMapper,
  endFileActions,
  endMapper,
};
