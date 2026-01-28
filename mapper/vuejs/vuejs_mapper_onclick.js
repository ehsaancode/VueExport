const readWriteFile = require("../../utility/read_write_file");
const actionFlowHandler = require("../../utility/action_flow_handler");
const commonUtils = require("../../utility/common_utils");
const commonPath = require("../../utility/common_path");
const FormMetadata = require("../../utility/form_metadata");
// const actionFlowHandler = require("../../utility/action_flow_handler");
const reactUtilits = require("../../parser/Vue/common_utilits_vue");
const collectionsService = require("../../API_Service/collections_service");
const uiInteraction = require("./vuejs_mapper_ui_interaction");
const {
  navigateMapperWithSingleObject,
} = require("./vuejs_mapper_navigation");
const { endNavigateMapper } = require("./vuejs_mapper_navigation");
const apiCallMapper = require("./vuejs_mapper_apicall");
const reactjsMapperFormSubmit = require("./vuejs_mapper_form_submit");
const mapperStateManagement = require("./vuejs_mapper_state_management");
const stateHandler = require("../../utility/state_handler");
const mapperTransitionManagement = require("./vuejs_mapper_transition");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const vueProjectPath = path.resolve(
  __dirname,
  `${commonPath.vueProjectPath.get(commonPath.environmentHosting)}`
);

async function onclickReactjsMapper(
  objects,
  fileName,
  widgetID,
  projectId,
  pageId
) {
  // console.log(`On click objects: ${JSON.stringify(objects)}`);
  let isHasApiCall = false;
  let dependency = "";
  let destinationType = "";
  const lastComponent = `${path.basename(fileName)}_${commonUtils.windowDevice
    }`;
  // console.log(`fileName: ${fileName}`);
  if (objects?.nodes.length > 0) {
    await readWriteFile.writeToFile(
      fileName,
      `<QActionFlow
          actions={actions}
            triggers={{
      `
    );

    let actionMethod = "";
    let updateMethod = "";
    // actionMethod = (await actionFlowHandler.actionObjects[lastComponent]) ?? "";
    const methodName = commonUtils.toPascalCase(
      `${objects?.title.length > 0 ? objects?.title : "Action"}_${objects?.serverId ?? ""
      }`
    );
    if (
      !(await actionFlowHandler.getActionsArray(lastComponent)).some(
        (action) => action.method === methodName
      )
    ) {
      actionMethod =
        actionMethod +
        `
        const ${methodName} = useCallback(async (event) => {
      `;

      for (let i = 0; i < objects?.nodes.length; i++) {
        let object = objects?.nodes[i];
        let type = object?.type ?? "";
        if (type == "action") {
          let component = object?.component ?? "";
          if (component !== "") {
            let componentType = component?.componentType ?? "";
            if (componentType == "navigate_to") {
              const destination =
                component?.componentBody?.destination?.destinationType.trim() ??
                "";
              const destinationFileName = destination.replace(/-/g, "_");
              destinationType = commonUtils.toPascalCase(destinationFileName);
              let action = await navigateMapperWithSingleObject(
                fileName,
                object
              );
              // console.log(`action: ${action}\n\n`);
              updateMethod = updateMethod + action;
            } else if (componentType == "ui_interaction") {
              let action = component?.componentBody?.action ?? "";
              if (action === "show_modal") {
                updateMethod =
                  updateMethod +
                  (await uiInteraction.showModel(fileName, object));
              }
            } else if (componentType === "api_call") {
              isHasApiCall = true;
              let apiCall = await apiCallMapper.startApiCallOnClick(
                `${vueProjectPath}/${projectId}/jsons`,
                fileName,
                object,
                widgetID,
                pageId,
                true,
                methodName
              );
              let actionmethod = apiCall.split("||")[0];
              dependency = apiCall.split("||")[1];
              updateMethod = updateMethod + actionmethod;
            } else if (componentType === "state_management") {
              updateMethod =
                updateMethod +
                (await mapperStateManagement.onClickStateUpdate(
                  fileName,
                  object,
                  pageId
                ));
            } else if (componentType === "form_submit") {
              const formId = component?.componentBody?.formId ?? "";
              const formMetada = FormMetadata.getInstance();
              const formData = formMetada.getFilesFor(`${formId}`);
              // console.log(`form_submit: ${JSON.stringify(formData)}`);
              const formObj = formData.length > 0 ? formData[0] : null;
              if (formObj) {
                const widgetId = formObj?.widgetId ?? "";
                const sumbitFormObj = formMetada.getFormSubmitFilesFor(
                  `${widgetId}`
                );
                const submitObj =
                  sumbitFormObj.length > 0 ? sumbitFormObj[0] : null;
                if (submitObj) {
                  const methodName = submitObj?.methodName ?? "";
                  if (methodName) {
                    updateMethod = updateMethod + `${methodName}();`;
                    /*(await reactjsMapperFormSubmit.formSubmitOnClick(
                        `${vueProjectPath}/${projectId}/jsons`,
                        fileName,
                        object,
                        widgetID,
                        methodName
                      ));*/
                  }
                }
              }
            }
            else if (componentType === "scene_transition") {

              updateMethod =
                updateMethod +
                (await mapperTransitionManagement.transitionManagement(
                  pageId,
                  fileName,
                  object,
                  'No',
                  'Yes'
                ));

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
                      updateMethod =
                        updateMethod +
                        (await apiCallMapper.navigationOnClick(
                          fileName,
                          childObject
                        ));
                    } else if (componentType === "state_management") {
                      updateMethod =
                        updateMethod +
                        (await apiCallMapper.stateUpdatOnClick(
                          pageId,
                          fileName,
                          childObject
                        ));
                    } else if (componentType === "scene_transition") {

                      updateMethod =
                        updateMethod +
                        (await mapperTransitionManagement.transitionManagement(
                          pageId,
                          fileName,
                          object,
                          'No',
                          'Yes'
                        ));

                    }


                    else {
                    }
                  }
                }
              }
            }
          }
        } else {
        }
      }

      actionMethod =
        actionMethod +
        `
        ${updateMethod}
            
      `;

      if (isHasApiCall) {
        actionMethod =
          actionMethod +
          (await apiCallMapper.endApiCallOnClick(fileName, dependency));
      } else {
        actionMethod =
          actionMethod +
          `
        }, [${dependency.length > 0
            ? dependency
            : destinationType.length > 0
              ? "navigate"
              : ""
          }]);
            
      `;
      }
      actionMethod = actionMethod + "\n[action_method]";
      //  console.log(`actionMethod: ${actionMethod}\n\n`);
      actionFlowHandler.actionObjects[lastComponent] = actionMethod;
      await actionFlowHandler.insertAction(lastComponent, {
        method: methodName,
        destinationType: destinationType,
      });
    }

    await readWriteFile.replaceWordInFile(
      fileName,
      "[action_method]",
      actionMethod
    );
    await readWriteFile.writeToFile(fileName, `onClick: "${methodName}",\n`);
    await readWriteFile.writeToFile(
      fileName,
      `
                      }}
                    >
                    `
    );

    // await readWriteFile.writeToFile(fileName, "</QActionFlow>\n\n");
  }
}

module.exports = {
  onclickReactjsMapper,
};
