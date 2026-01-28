const readWriteFile = require("../../utility/read_write_file");
const actionFlowHandler = require("../../utility/action_flow_handler");
const commonPath = require("../../utility/common_path");
const stateHandler = require("../../utility/state_handler");
// const actionFlowHandler = require("../../utility/action_flow_handler");
const reactUtilits = require("../../parser/Vue/common_utilits_vue");
const collectionsService = require("../../API_Service/collections_service");
const { navigateMapper } = require("./vuejs_mapper_navigation");
const { endNavigateMapper } = require("./vuejs_mapper_navigation");
const apiCallMapper = require("./vuejs_mapper_apicall");
const mapperStateManagement = require("./vuejs_mapper_state_management");
const mapperTransitionManagement = require("./vuejs_mapper_transition");

const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const vueProjectPath = path.resolve(
  __dirname,
  `${commonPath.vueProjectPath.get(commonPath.environmentHosting)}`
);

async function onloadReactjsMapper(
  objects,
  fileName,
  widgetID,
  projectId,
  pageId
) {
  // console.log(`onloadReactjsMapper called for pageId: ${pageId}`);
  // console.log(`onloadReactjsMapper called for fileName: ${fileName}`);
  // console.log(`onloadReactjsMapper called for objects: ${JSON.stringify(objects)}`);
  let isHasApiCall = false;
  let dependency = "";
  if (objects?.nodes.length > 0) {
    // await readWriteFile.writeToFile(
    //   fileName,
    //   `<QActionFlow
    //          `
    // );
    // console.log(`onload objects: ${JSON.stringify(objects)}`);
    for (let i = 0; i < objects?.nodes.length; i++) {
      let object = objects?.nodes[i];
      let type = object?.type ?? "";
      if (type == "action") {
        let component = object?.component ?? "";
        if (component !== "") {
          let componentType = component?.componentType ?? "";
          if (componentType === "api_call") {
            isHasApiCall = true;
            dependency = await apiCallMapper.startApiCall(
              `${vueProjectPath}/${projectId}/jsons`,
              fileName,
              object,
              widgetID,
              pageId
            );
          } else if (componentType === "state_management") {
            await mapperStateManagement.stateManagement(
              pageId,
              fileName,
              object
            );
          }else if (componentType === "scene_transition") {

              await mapperTransitionManagement.transitionManagement(
              pageId,
              fileName,
              object,
              'Yes'
            );

          }
        }
      } else if (type == "conditional") {
        // console.log(`conditional action found: ${JSON.stringify(object)}`);
        const conChildren = object?.children ?? [];
        for (let j = 0; j < conChildren.length; j++) {
          const conChildObject = conChildren[j];
          const label = conChildObject?.label ?? "";
          if (label == "true") {
            // console.log(`conditional true branch found`);
            const children = conChildObject?.children ?? [];
            for (let j = 0; j < children.length; j++) {
              let childObject = children[j];
              let childType = childObject?.type ?? "";
              if (childType == "action") {
                let component = childObject?.component ?? "";
                if (component !== "") {
                  let componentType = component?.componentType ?? "";
                  if (componentType === "navigate_to") {
                    await apiCallMapper.navigation(fileName, childObject);
                  } else if (componentType === "state_management") {
                    await apiCallMapper.stateUpdat(
                      pageId,
                      fileName,
                      childObject
                    );
                  } else  if (componentType === "scene_transition") {
                        await mapperTransitionManagement.transitionManagement(
                          pageId,
                          fileName,
                          childObject,
                          'No'
                        );
                  }
                }
              }
            }
          }
        }
      } else {
      }
    }

    if (isHasApiCall) {
      await apiCallMapper.endApiCall(fileName, dependency);
    }
    // await readWriteFile.writeToFile(fileName, `>`);
    // await readWriteFile.writeToFile(fileName, "</QActionFlow>\n\n");
  }
}
module.exports = {
  onloadReactjsMapper,
};
