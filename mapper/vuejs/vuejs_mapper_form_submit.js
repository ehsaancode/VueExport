const readWriteFile = require("../../utility/read_write_file");
const actionFlowHandler = require("../../utility/action_flow_handler");
const commonPath = require("../../utility/common_path");
const stateHandler = require("../../utility/state_handler");
const commonUtils = require("../../utility/common_utils");
// const actionFlowHandler = require("../../utility/action_flow_handler");
const reactUtilits = require("../../parser/Vue/common_utilits_vue");
const collectionsService = require("../../API_Service/collections_service");
const { navigateMapper } = require("./vuejs_mapper_navigation");
const { endNavigateMapper } = require("./vuejs_mapper_navigation");
const apiCallMapper = require("./vuejs_mapper_apicall");
const FormMetadata = require("../../utility/form_metadata");
const mapperStateManagement = require("./vuejs_mapper_state_management");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const vueProjectPath = path.resolve(
  __dirname,
  `${commonPath.vueProjectPath.get(commonPath.environmentHosting)}`
);

async function formSubmitReactjsMapper(
  objects,
  fileName,
  widgetID,
  projectId,
  pageId
) {
  let isHasApiCall = false;
  if (objects?.nodes.length > 0) {
    // await readWriteFile.writeToFile(
    //   fileName,
    //   `<QActionFlow
    //         actions={actions}
    //           triggers={{
    //     `
    // );

    // console.log(`onload objects: ${JSON.stringify(objects)}`);
    for (let i = 0; i < objects?.nodes.length; i++) {
      let object = objects?.nodes[i];
      let type = object?.type ?? "";
      if (type == "action") {
        let component = object?.component ?? "";
        if (component !== "") {
          let componentType = component?.componentType ?? "";
          if (componentType === "navigate_to") {
            await navigateMapper(fileName, object);
          } else if (componentType === "api_call") {
            isHasApiCall = true;
            await apiCallForFormSubmit(
              `${vueProjectPath}/${projectId}/jsons`,
              fileName,
              object,
              widgetID,
              pageId
            );
          }
        }
      } else if (type == "conditional") {
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
                    // await navigateMapperWithSingleObject(fileName, childObject);
                    await navigationForFormSubmit(fileName, childObject);
                  } else if (componentType === "state_management") {
                    await stateForFormSubmit(pageId, fileName, childObject);
                  } else if (componentType === "api_call") {
                    await apiCallMapper.apiCallForFormSubmit(
                      `${vueProjectPath}/${projectId}/jsons`,
                      fileName,
                      childObject,
                      widgetID,
                      pageId
                    );
                  } else {
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
      await endFormSubmit(fileName);
    }

    // await readWriteFile.writeToFile(
    //   fileName,
    //   `
    //            }}
    //        >
    //       `
    // );
  }
}

async function  formSubmitOnClick_copy (
  jsonPath,
  fileName,
  onClickObject,
  widgetID,
  actionName
) {
  let actionMethod = "";
  let component = onClickObject?.component ?? "";

  if (component !== "") {
    let componentType = component?.componentType ?? "";

    if (componentType === "form_submit") {
      actionMethod =
        actionMethod +
        `
              ${actionName}();
            `;
    } else {
    }
  }

  return actionMethod;
}

async function formSubmitOnClick(
  jsonPath,
  fileName,
  onClickObject,
  widgetID,
  actionName
) {
  const lastComponent = `${path.basename(fileName)}_${
    commonUtils.windowDevice
  }`;
  let actionMethod = "";
  let component = onClickObject?.component ?? "";

  if (component !== "") {
    let componentType = component?.componentType ?? "";

    if (componentType === "form_submit") {
      const widgetId = widgetID;
      const methodName = commonUtils.toPascalCase(
        `${onClickObject?.label ?? ""}_${onClickObject?.id ?? ""}`
      );
      if (
        !(await actionFlowHandler.getActionsArray(lastComponent)).some(
          (action) => action.method === methodName
        )
      ) {
        await actionFlowHandler.insertAction(lastComponent, {
          method: methodName,
          destinationType: "",
        });
      }

      actionMethod =
        actionMethod +
        `
              const ${methodName} = useCallback(async (event) => {
                ${actionName}();
              }, []);

              [action_method]
            `;

      if (actionMethod.length > 0) {
        await readWriteFile.replaceWordInFile(
          fileName,
          "[action_method]",
          actionMethod
        );
      }

      await readWriteFile.writeToFile(fileName, `onClick: "${methodName}",`);
    } else {
    }
  }
}

async function apiCallForFormSubmit(
  jsonPath,
  fileName,
  formSubmitObject,
  widgetID,
  pageId = 0
) {
  const lastComponent = `${path.basename(fileName)}_${
    commonUtils.windowDevice
  }`;
  let collectionJsonPath = `${jsonPath}/collections.json`;

  let actionMethod = "";
  let component = formSubmitObject?.component ?? "";
  // console.log("component:", JSON.stringify(component));
  if (component !== "") {
    let componentType = component?.componentType ?? "";

    // console.log("componentType:", componentType);
    if (componentType === "api_call") {
      const methodName = commonUtils.toPascalCase(
        `${formSubmitObject?.label ?? ""}_${formSubmitObject?.id ?? ""}`
      );
      let formMetadaObj = {
        widgetId: String(`${widgetID}`),
        methodName: methodName,
      };
      const refFormMetada = FormMetadata.getInstance();
      refFormMetada.formSubmitObjects = {
        key: String(`${widgetID}`),
        value: formMetadaObj,
      };
      const apiReqId = component?.componentBody?.apiReqId ?? "";
      if (
        !(
          await actionFlowHandler.getFormSubmitActionsArray(lastComponent)
        ).some((action) => action.method === methodName)
      ) {
        await actionFlowHandler.insertFormSubmitAction(lastComponent, {
          method: methodName,
          destinationType: "",
        });
      }
      const apiDetails = await collectionsService.getItemByServerId(
        collectionJsonPath,
        apiReqId
      );
   
       

       
      actionMethod =
        actionMethod +
        `
              const ${methodName} = useCallback(async (event) => {
                const storageInstance =  getStorage();

              const { formsubmitValidation, formValue, updatedFields } =
                await QFormSubmit({
                  cms_form_Id: "${widgetID}",
                });

              if (!formsubmitValidation) return;

               const updatedFormInputData = formValue;

               // 🔑 CREATE UPDATED OBJECT FIRST
              // const updatedFormInputData = (() => {
              //   const updated = { ...stateData };

              //   Object.keys(updated).forEach((key) => {
              //     if (formValue.hasOwnProperty(key)) {
              //       updated[key] = formValue[key];
              //     }
              //   });

              //   return updated;
              // })();

               // ✅ UPDATE STATE
             // setstateData(updatedFormInputData);

               // ✅ USE UPDATED VALUE IN API CALL
              const { apiResponse } = await QFormSubmitApiCall({
                cms_form_Id: "${widgetID}",
                apiInfo: {
                  url: \"${apiDetails?.request?.url?.raw}\",
                  method: \"${apiDetails?.request?.method}\",
                  body:resolveUpdatedFormValues(
                  ${JSON.stringify(
                      await getFormSubmitPayloadObject(
                        component?.componentBody?.requestData?.payload ?? {},
                        pageId
                      )
                    )}, updatedFormInputData ) ,
                  headers: ${JSON.stringify(apiDetails?.request?.headers)},
                },
                updatedFields,
              });


                  if (formsubmitValidation) {
                    if (apiResponse && Array.isArray(apiResponse) ? apiResponse.length > 0 : Object.keys(apiResponse).length > 0) {
                      console.log("✅ Form is valid and API success:", apiResponse);
                       forceUpdate(v => v + 1);
              [action_method]
            `;

      if (actionMethod.length > 0) {
        await readWriteFile.replaceWordInFile(
          fileName,
          "[action_method]",
          actionMethod
        );
      }
      // await readWriteFile.writeToFile(fileName, `onClick: "${methodName}",`);
    } else {
    }
  }
}

async function getFormSubmitPayloadObject(formObject, pageId) {
  const payloadObj = {};

  if (!formObject?.mappings || !Array.isArray(formObject.mappings)) {
    return payloadObj;
  }

  // Helper function to set nested properties
  const setNestedValue = (obj, path, value) => {
    const parts = path.split(".");
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      } else if (typeof current[part] !== "object") {
        // Convert to object if it's a primitive value
        current[part] = { _value: current[part] };
      }
      current = current[part];
    }

    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
  };

  // Helper function to get state value
  const getStateValue = async (stateId, targetPath, pageId) => {
    if (!stateId) return targetPath;

    try {
      const handler = stateHandler.getInstance();
      let stateData = null;
      const firstChar = stateId.charAt(0);

      if (firstChar == "a") {
        // App state
        stateData = handler.getAppStateByField("id", stateId);
      } else {
        // Page state
        stateData = handler.getStateByField(String(pageId), "stateId", stateId);
      }

      // Return state access expression
      return stateData
        ? `${
            firstChar == "a"
              ? `get("${stateData.name}")`
              : firstChar == "w"
              ? `updatedFormInputData`
              : stateData.name
          }?.${targetPath}`
        : targetPath;
    } catch (error) {
      console.error("Error getting state value:", error);
      return targetPath;
    }
  };

  // Process each mapping
  for (const mapping of formObject.mappings) {
    if (!mapping.source || !mapping.target) continue;

    const sourcePath = mapping.source;
    const targetValue = mapping.target;
    const stateId = mapping.id;

    // Remove "$." prefix from source path
    let cleanSourcePath = sourcePath.replace("$.", "");

    // Determine the actual value to set
    let valueToSet;

    if (targetValue.startsWith("$.")) {
      // Target is a reference path
      const cleanTargetPath = targetValue.replace("$.", "");

      if (stateId) {
        // Get value from state
        valueToSet = await getStateValue(stateId, cleanTargetPath, pageId);
      } else {
        // Direct path reference
        valueToSet = cleanTargetPath;
      }
    } else {
      // Target is a literal value
      if (stateId) {
        // Even for literal values, if there's a stateId, we might need to process it
        const cleanTargetPath = targetValue;
        valueToSet = await getStateValue(stateId, cleanTargetPath, pageId);
      } else {
        // Pure literal value
        valueToSet = targetValue;

        // Try to convert to number if it looks like one
        if (!isNaN(valueToSet) && valueToSet.trim() !== "") {
          const num = Number(valueToSet);
          if (!isNaN(num)) valueToSet = num;
        }
      }
    }

    // Set the value in the payload object
    setNestedValue(payloadObj, cleanSourcePath, valueToSet);
  }

  /*console.log(
    "Form Submit Payload Object:",
    JSON.stringify(payloadObj, null, 2)
  );*/
  return payloadObj;
}
/*
async function getFormSubmitPayloadObject(formObject, pageId) {
  let payloadObj = {};
  if (formObject?.mappings.length > 0) {
    for (let i = 0; i < formObject?.mappings.length; i++) {
      let mapping = formObject?.mappings[i];
      let sourceKey = (mapping?.source ?? "").replace("$.", "");
      let selectedStateId = mapping?.id ?? "";
      let selectedState = {};
      let target = (mapping?.target ?? "").replace("$.", "");
      if (selectedStateId.length > 0) {
        let firstValue = selectedStateId.split("-")[0];
        const handler = stateHandler.getInstance();
        if (firstValue == "a") {
          selectedState = handler.getAppStateByField(
            "id",
            String(selectedStateId)
          );
        } else {
          selectedState = handler.getStateByField(
            String(pageId),
            "stateId",
            String(selectedStateId)
          );
        }
      }
      payloadObj.sourceKey =
        selectedStateId.length > 0
          ? `${selectedState}?.${target}`
          : `${target}`;
    }
  }

  return payloadObj;
}*/

async function navigationForFormSubmit(fileName, formSubmitObject) {
  let actionMethod = "";
  let component = formSubmitObject?.component ?? "";
  // console.log("component:", JSON.stringify(component));
  if (component !== "") {
    let componentType = component?.componentType ?? "";

    if (componentType === "navigate_to") {
      // await navigateMapperWithSingleObject(fileName, childObject);
      const destination =
        component?.componentBody?.destination?.destinationType.trim() ?? "";
      const destinationFileName = destination.replace(/-/g, "_");
      let destinationType = commonUtils.toPascalCase(destinationFileName);
      actionMethod =
        actionMethod +
        `
                  NavigationUtils.navigateTo(navigate, "/${destinationType}");

              [action_method]
            `;

      if (actionMethod.length > 0) {
        await readWriteFile.replaceWordInFile(
          fileName,
          "[action_method]",
          actionMethod
        );
      }
    } else {
    }
  }
}

async function stateForFormSubmit(pageId, fileName, formSubmitObject) {
  let actionMethod = "";
  let component = formSubmitObject?.component ?? "";
  // console.log("component:", JSON.stringify(component));
  if (component !== "") {
    let componentType = component?.componentType ?? "";

    if (componentType === "state_management") {
      let componentBody = component?.componentBody ?? "";
      if (componentBody !== "") {
        let fields = componentBody?.fields ?? [];
        if (fields.length > 0) {
           for (let j = 0; j < fields.length; j++) {
               let field = fields[j];
              let assignJsonPath = (field?.assignJsonPath ?? "").replace("$.", "");
              assignJsonPath = assignJsonPath.replace(".", "?.");
              let selectedStateId = field?.selectedStateId ?? "";
              let assignedStateId = field?.assignedStateId ?? "";
              let firstValue = selectedStateId.split("-")[0];
              let displayassignState = field?.displayassignState ?? "";
              let displayassignStateFirstValue = displayassignState.split("-")[0];
              const handler = stateHandler.getInstance();
              if (
                assignedStateId.length > 0 &&
                displayassignStateFirstValue != "ao"
              ) {
                let stateValue = await mapperStateManagement.asignedState(
                  assignedStateId,
                  selectedStateId,
                  assignJsonPath.length > 0 ? `?.${assignJsonPath}` : "",
                  pageId
                );
                actionMethod =
                  actionMethod +
                  `
                    ${stateValue} 
                   
                `;
              } else {
                if (firstValue == "a") {
                  let state = handler.getAppStateByField(
                    "id",
                    String(selectedStateId)
                  );
                  // console.log(`selectedAppStateId: ${selectedStateId}`);
                  // console.log(`state: ${JSON.stringify(state)}`);
                  actionMethod =
                    actionMethod +
                    `
                    set('${state?.name}',apiResponse${
                      assignJsonPath.length > 0 ? `.${assignJsonPath}` : ""
                    });  
                  

                    if (storageInstance) {
                  await storageInstance.localStorageSet("${
                    state?.name
                  }", apiResponse${
                      assignJsonPath.length > 0 ? `.${assignJsonPath}` : ""
                    });
                      } 
                    
                `;
                } else {
                  let state = handler.getStateByField(
                    String(pageId),
                    "stateId",
                    String(selectedStateId)
                  );

                  let setState =
                    state?.setMethodName?.length > 0
                      ? `${state?.setMethodName}(apiResponse${
                          assignJsonPath.length > 0 ? `.${assignJsonPath}` : ""
                        })`
                      : ""; // `${state?.setMethodName}(userData.data.products)`;
                  actionMethod =
                    actionMethod +
                    `
                      ${setState}
                  `;
                }

                // console.log("destination", destination);
              }
               actionMethod = actionMethod + "\n"
           }
         
        }
      }

      actionMethod = actionMethod + "\n[action_method]"
      if (actionMethod.length > 0) {
        await readWriteFile.replaceWordInFile(
          fileName,
          "[action_method]",
          actionMethod
        );
      }


    } else {
    }
  }
}

async function endFormSubmit(fileName) {
  let actionMethod = "";
  actionMethod =
    actionMethod +
    `
               
                    } 
                    else {
                      console.log("✅ Form is valid but API not called or returned empty:", apiResponse);
                    }
                  } else {
                    console.log("❌ Form invalid or API failed:", apiResponse);
                  }
              }, []);

              [action_method]
            `;
  await readWriteFile.replaceWordInFile(
    fileName,
    "[action_method]",
    actionMethod
  );
}

module.exports = {
  formSubmitReactjsMapper,
  formSubmitOnClick,
};
