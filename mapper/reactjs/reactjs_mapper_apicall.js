const readWriteFile = require("../../utility/read_write_file");
const commonUtils = require("../../utility/common_utils");
const actionFlowHandler = require("../../utility/action_flow_handler");
const collectionsService = require("../../API_Service/collections_service");
const datasetService = require("../../API_Service/dataset_service");
const reactUtilits = require("../../parser/React/common_utilits_react");
const stateHandler = require("../../utility/state_handler");
const FormMetadata = require("../../utility/form_metadata");
const mapperStateManagement = require("./reactjs_mapper_state_management");
const { navigateMapper } = require("./reactjs_mapper_navigation");
const path = require("path");

// Remove the import of actionsManager - receive it as parameter instead
async function apiCallMapperOnClick(
  jsonPath,
  fileName,
  onClickObjects,
  widgetID
) {
  if (!onClickObjects || onClickObjects.length === 0) {
    console.log("⚠️ No onClickObjects provided, exiting");
    // return;
  }
  const lastComponent = `${path.basename(fileName)}_${
    commonUtils.windowDevice
  }`;
  let collectionJsonPath = `${jsonPath}/collections.json`;

  let actionMethod = "";

  for (let i = 0; i < onClickObjects.length; i++) {
    let onClickObject = onClickObjects[i];
    let component = onClickObject?.component ?? "";

    if (component !== "") {
      let componentType = component?.componentType ?? "";

      if (componentType === "api_call") {
        const widgetId = widgetID;
        const methodName = commonUtils.toPascalCase(
          `${onClickObject?.label ?? ""}_${onClickObject?.id ?? ""}`
        );
        const apiReqId = component?.componentBody?.apiReqId ?? "";
        const dataSetId = component?.componentBody?.dataSetId ?? "";
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
        const apiDetails = await collectionsService.getItemByServerId(
          collectionJsonPath,
          apiReqId
        );
        let datasetObj = await datasetMapper(apiReqId, dataSetId);
        let datasetPath = datasetObj?.api_data_Set_Path ?? "";
        const simplifiedPath = simplifyTargetKey(datasetPath);

        actionMethod =
          actionMethod +
          `
              const ${methodName} = useCallback(async (event) => {
                try {
                  const userData = await ApiUtils.request(
                  {
                    url: \"${apiDetails?.request?.url?.raw}\",
                    method: \"${apiDetails?.request?.method}\",
                    body: ${JSON.stringify(apiDetails?.request?.body?.content)},
                    headers: ${JSON.stringify(apiDetails?.request?.headers)},
                  }
                  );
                  setLoading(true);
                  set(${widgetId}, userData);
                  set(\"${widgetId}_dataset_path\", \"${simplifiedPath}\");
                  
                } catch (error) {
                   setLoading(false);
                } finally {
                 
                }
              }, []);

              [action_method]
            `;

        await readWriteFile.replaceWordInFile(
          fileName,
          "[action_method]",
          actionMethod
        );

        await readWriteFile.writeToFile(fileName, `onClick: "${methodName}",`);
      } else if (componentType === "form_submit") {
        const methodName = commonUtils.toPascalCase(
          `${onClickObject?.label ?? ""}_${onClickObject?.id ?? ""}`
        );
        await readWriteFile.writeToFile(fileName, `onClick: "${methodName}",`);
      } else {
      }
    }
  }
}

async function apiCallMapperOnClickSingleObject(
  jsonPath,
  fileName,
  onClickObject,
  widgetID
) {
  const lastComponent = `${path.basename(fileName)}_${
    commonUtils.windowDevice
  }`;
  let collectionJsonPath = `${jsonPath}/collections.json`;
  console.log(`onClickObject: ${JSON.stringify(onClickObject)}`);

  // onClickObject = onClickObject.length > 0 ? onClickObject[0] : onClickObject;
  // onClickObject = onClickObject.length > 0 ? onClickObject[0] : onClickObject;
  let actionMethod = "";
  let component = onClickObject?.component ?? "";

  if (component !== "") {
    let componentType = component?.componentType ?? "";

    if (componentType === "api_call") {
      const widgetId = widgetID;
      const methodName = commonUtils.toPascalCase(
        `${onClickObject?.label ?? ""}_${onClickObject?.id ?? ""}`
      );
      const apiReqId = component?.componentBody?.apiReqId ?? "";
      const dataSetId = component?.componentBody?.dataSetId ?? "";
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
      const apiDetails = await collectionsService.getItemByServerId(
        collectionJsonPath,
        apiReqId
      );
      let datasetObj = await datasetMapper(apiReqId, dataSetId);
      let datasetPath = datasetObj?.api_data_Set_Path ?? "";
      const simplifiedPath = simplifyTargetKey(datasetPath);

      actionMethod =
        actionMethod +
        `
              const ${methodName} = useCallback(async (event) => {
                try {
                  const userData = await ApiUtils.request(
                  {
                    url: \"${apiDetails?.request?.url?.raw}\",
                    method: \"${apiDetails?.request?.method}\",
                    body: ${JSON.stringify(apiDetails?.request?.body?.content)},
                    headers: ${JSON.stringify(apiDetails?.request?.headers)},
                  }
                  );
                   setLoading(true);
                  set(${widgetId}, userData);
                  set(\"${widgetId}_dataset_path\", \"${simplifiedPath}\");
                  
                } catch (error) {
                   setLoading(false);
                } finally {
                 
                }
              }, []);

              [action_method]
            `;

      await readWriteFile.replaceWordInFile(
        fileName,
        "[action_method]",
        actionMethod
      );

      await readWriteFile.writeToFile(fileName, `onClick: "${methodName}",`);
    } else if (componentType === "form_submit") {
      const methodName = commonUtils.toPascalCase(
        `${onClickObject?.label ?? ""}_${onClickObject?.id ?? ""}`
      );
      await readWriteFile.writeToFile(fileName, `onClick: "${methodName}",`);
    } else {
    }
  }
}

async function apiCallMapperOnLoad(
  jsonPath,
  fileName,
  onLoadObjects,
  widgetID,
  pageId
) {
  if (!onLoadObjects || onLoadObjects.length === 0) {
    console.log("⚠️ No onLoadObjects provided, exiting");
    // return;
  }
  const lastComponent = `${path.basename(fileName)}_${
    commonUtils.windowDevice
  }`;
  let collectionJsonPath = `${jsonPath}/collections.json`;

  let actionMethod = "";
  let destination = "";
  for (let i = 0; i < onLoadObjects.length; i++) {
    let onLoadObject = onLoadObjects[i];
    let type = onLoadObject?.type ?? "";
    if (type == "action") {
      let component = onLoadObject?.component ?? "";
      if (component !== "") {
        let componentType = component?.componentType ?? "";

        if (componentType === "api_call") {
          const widgetId = widgetID;
          const methodName = commonUtils.toPascalCase(
            `${onLoadObject?.label ?? ""}_${onLoadObject?.id ?? ""}`
          );
          const apiReqId = component?.componentBody?.apiReqId ?? "";
          const dataSetId = component?.componentBody?.dataSetId ?? "";
          destination = component?.componentBody?.jsonPath ?? "";
          destination = destination.replace("$.", "");
          if (
            !(
              await actionFlowHandler.getOnLoadActionsArray(lastComponent)
            ).some((action) => action.method === methodName)
          ) {
            await actionFlowHandler.insertOnLoadAction(lastComponent, {
              method: methodName,
              destinationType: "",
            });
          }
          const apiDetails = await collectionsService.getItemByServerId(
            collectionJsonPath,
            apiReqId
          );
          let datasetObj = await datasetMapper(apiReqId, dataSetId);
          // console.log("datasetObj", datasetObj);
          let datasetPath = datasetObj?.api_data_Set_Path ?? "";
          const simplifiedPath = simplifyTargetKey(datasetPath);

          actionMethod =
            actionMethod +
            `
              useEffect(() => {
                ${methodName}();
              }, []);

              const ${methodName} = useCallback(async (event) => {
                try {
                
                  const userData = await ApiUtils.request(
                  {
                    url: \"${apiDetails?.request?.url?.raw}\",
                    method: \"${apiDetails?.request?.method}\",
                    body: ${JSON.stringify(apiDetails?.request?.body?.content)},
                    headers: ${JSON.stringify(apiDetails?.request?.headers)},
                  }
                  );
            `;
        } else {
        }
      }
    } else if (type == "conditional") {
      let children = onLoadObject?.children ?? [];
      if (children.length > 0) {
        for (let j = 0; j < children.length; j++) {
          let childObject = children[j];
          let label = childObject?.label ?? "";
          if (label == "true") {
            let children2 = childObject?.children ?? [];
            for (let j = 0; j < children2.length; j++) {
              let childObject2 = children2[j];
              let type2 = childObject2?.type ?? "";
              if (type2 == "action") {
                let component2 = childObject2?.component ?? "";
                if (component2 !== "") {
                  let componentType2 = component2?.componentType ?? "";
                  if (componentType2 == "state_management") {
                    let componentBody2 = component2?.componentBody ?? "";
                    if (componentBody2 !== "") {
                      let fields = componentBody2?.fields ?? [];
                      if (fields.length > 0) {
                        let field = fields[0];
                        let assignJsonPath = (
                          field?.assignJsonPath ?? ""
                        ).replace("$.", "");
                        assignJsonPath = assignJsonPath.replace(".", "?.");
                        let selectedStateId = field?.selectedStateId ?? "";
                        let firstValue = selectedStateId.split("-")[0];
                        const handler = stateHandler.getInstance();
                        if (firstValue == "a") {
                          let state = handler.getAppStateByField(
                            "id",
                            String(selectedStateId)
                          );
                          actionMethod =
                            actionMethod +
                            `
                            if(userData){
                                set(${state?.name},userData${
                              assignJsonPath.length > 0
                                ? `.${assignJsonPath}`
                                : ""
                            });  
                            }
                                [action_method] 
                            `;
                        } else {
                          let state = handler.getStateByField(
                            String(pageId),
                            "stateId",
                            String(selectedStateId)
                          );

                          let setState =
                            state?.setMethodName?.length > 0
                              ? `${state?.setMethodName}(userData${
                                  assignJsonPath.length > 0
                                    ? `.${assignJsonPath}`
                                    : ""
                                })`
                              : ""; // `${state?.setMethodName}(userData.data.products)`;
                          actionMethod =
                            actionMethod +
                            `
                                if(userData){
                                  ${setState};
                                }
                                [action_method]
                            `;
                        }
                      }
                    }
                  }
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
      } catch (error) {
         setLoading(false);
      } finally {
       
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

async function apiCallMapperOnLoadSingleObject(
  jsonPath,
  fileName,
  onLoadObject,
  widgetID,
  pageId
) {
  const lastComponent = `${path.basename(fileName)}_${
    commonUtils.windowDevice
  }`;
  let collectionJsonPath = `${jsonPath}/collections.json`;
  // console.log(`onLoadObject: ${JSON.stringify(onLoadObject)}`);
  // onLoadObject = onLoadObject.length > 0 ? onLoadObject[0] : onLoadObject;
  // onLoadObject = onLoadObject.length > 0 ? onLoadObject[0] : onLoadObject;

  let actionMethod = "";
  let destination = "";
  let type = onLoadObject?.type ?? "";
  if (type == "action") {
    let component = onLoadObject?.component ?? "";
    if (component !== "") {
      let componentType = component?.componentType ?? "";

      if (componentType === "api_call") {
        const widgetId = widgetID;
        const methodName = commonUtils.toPascalCase(
          `${onLoadObject?.label ?? ""}_${onLoadObject?.id ?? ""}`
        );
        const apiReqId = component?.componentBody?.apiReqId ?? "";
        const dataSetId = component?.componentBody?.dataSetId ?? "";
        destination = component?.componentBody?.jsonPath ?? "";
        destination = destination.replace("$.", "");
        if (
          !(await actionFlowHandler.getOnLoadActionsArray(lastComponent)).some(
            (action) => action.method === methodName
          )
        ) {
          await actionFlowHandler.insertOnLoadAction(lastComponent, {
            method: methodName,
            destinationType: "",
          });
        }
        const apiDetails = await collectionsService.getItemByServerId(
          collectionJsonPath,
          apiReqId
        );
        let datasetObj = await datasetMapper(apiReqId, dataSetId);
        // console.log("datasetObj", datasetObj);
        let datasetPath = datasetObj?.api_data_Set_Path ?? "";
        const simplifiedPath = simplifyTargetKey(datasetPath);

        actionMethod =
          actionMethod +
          `
              useEffect(() => {
                ${methodName}();
              }, []);

              const ${methodName} = useCallback(async (event) => {
                try {
                  const userData = await ApiUtils.request(
                  {
                    url: \"${apiDetails?.request?.url?.raw}\",
                    method: \"${apiDetails?.request?.method}\",
                    body: ${JSON.stringify(apiDetails?.request?.body?.content)},
                    headers: ${JSON.stringify(apiDetails?.request?.headers)},
                  }
                  );
                  setLoading(true);
            `;
      } else {
      }
    }
  } else if (type == "conditional") {
    console.log(`type is conditional`);
    let children = onLoadObject?.children ?? [];
    if (children.length > 0) {
      for (let j = 0; j < children.length; j++) {
        let childObject = children[j];
        let label = childObject?.label ?? "";
        if (label == "true") {
          let children2 = childObject?.children ?? [];
          for (let j = 0; j < children2.length; j++) {
            let childObject2 = children2[j];
            let type2 = childObject2?.type ?? "";
            if (type2 == "action") {
              let component2 = childObject2?.component ?? "";
              if (component2 !== "") {
                let componentType2 = component2?.componentType ?? "";
                if (componentType2 == "state_management") {
                  console.log(`component2: ${JSON.stringify(component2)}`);
                  let componentBody2 = component2?.componentBody ?? "";
                  if (componentBody2 !== "") {
                    let fields = componentBody2?.fields ?? [];
                    if (fields.length > 0) {
                      let field = fields[0];
                      let assignJsonPath = (
                        field?.assignJsonPath ?? ""
                      ).replace("$.", "");
                      assignJsonPath = assignJsonPath.replace(".", "?.");
                      console.log(`assignJsonPath: ${assignJsonPath}`);
                      let selectedStateId = field?.selectedStateId ?? "";
                      let firstValue = selectedStateId.split("-")[0];
                      const handler = stateHandler.getInstance();
                      if (firstValue == "a") {
                        let state = handler.getAppStateByField(
                          "id",
                          String(selectedStateId)
                        );
                        actionMethod =
                          actionMethod +
                          `
                          if(userData){
                              set('${state?.name}',userData${
                            assignJsonPath.length > 0
                              ? `.${assignJsonPath}`
                              : ""
                          });  
                          }
                              [action_method] 
                          `;
                      } else {
                        let state = handler.getStateByField(
                          String(pageId),
                          "stateId",
                          String(selectedStateId)
                        );

                        let setState =
                          state?.setMethodName?.length > 0
                            ? `${state?.setMethodName}(userData${
                                assignJsonPath.length > 0
                                  ? `.${assignJsonPath}`
                                  : ""
                              })`
                            : ""; // `${state?.setMethodName}(userData.data.products)`;
                        actionMethod =
                          actionMethod +
                          `
                              if(userData){
                                ${setState};
                              }
                              [action_method]
                          `;
                      }

                      // ++++++++++++++
                      /*let selectedStateId = field?.selectedStateId ?? "";
                      const handler = stateHandler.getInstance();
                      let state = handler.getStateByField(
                        String(pageId),
                        "stateId",
                        String(selectedStateId)
                      );
                      console.log("destination", destination);
                      let setState =
                        state?.setMethodName?.length > 0
                          ? `${state?.setMethodName}(userData.${destination})`
                          : ""; // `${state?.setMethodName}(userData.data.products)`;
                      actionMethod =
                        actionMethod +
                        `
                              if(userData){
                                ${setState};
                              }   
                          `;*/
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  } else {
  }

  actionMethod =
    actionMethod +
    ` 
      } catch (error) {
        setLoading(false);
      } finally {
        
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

async function apiCallMapperFormSubmit(
  jsonPath,
  fileName,
  formSubmitObjects,
  widgetID
) {
  if (!formSubmitObjects || formSubmitObjects.length === 0) {
    console.log("⚠️ No formSubmitObjects provided, exiting");
    // return;
  }
  const lastComponent = `${path.basename(fileName)}_${
    commonUtils.windowDevice
  }`;
  let collectionJsonPath = `${jsonPath}/collections.json`;

  let actionMethod = "";

  // console.log("formSubmitObjects:", JSON.stringify(formSubmitObjects));
  for (let i = 0; i < formSubmitObjects.length; i++) {
    let onClickObject = formSubmitObjects[i];
    let component = onClickObject?.component ?? "";
    console.log("component:", JSON.stringify(component));
    if (component !== "") {
      let componentType = component?.componentType ?? "";

      // console.log("componentType:", componentType);
      if (componentType === "api_call") {
        const methodName = commonUtils.toPascalCase(
          `${onClickObject?.label ?? ""}_${onClickObject?.id ?? ""}`
        );
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
        // let datasetObj = await datasetMapper(apiReqId, dataSetId);
        // let datasetPath = datasetObj?.api_data_Set_Path ?? "";
        // const simplifiedPath = simplifyTargetKey(datasetPath);

        actionMethod =
          actionMethod +
          `
              const ${methodName} = useCallback(async (event) => {
                const { formsubmitValidation, formValue, apiResponse } = await 
                QFormSubmit({
                  cms_form_Id: "${widgetID}",
                  apiInfo: {
                    url: \"${apiDetails?.request?.url?.raw}\",
                    method: \"${apiDetails?.request?.method}\",
                    body: ${JSON.stringify(apiDetails?.request?.body?.content)},
                    headers: ${JSON.stringify(apiDetails?.request?.headers)},
                  }
                });
                  console.log('formValue', formValue)
                  if (formsubmitValidation) {
                    if (apiResponse && Array.isArray(apiResponse) ? apiResponse.length > 0 : Object.keys(apiResponse).length > 0) {
                      console.log("✅ Form is valid and API success:", apiResponse);
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

        // console.log("actionMethod:", actionMethod);
        // console.log("fileName:", fileName);
        await readWriteFile.replaceWordInFile(
          fileName,
          "[action_method]",
          actionMethod
        );
        // await readWriteFile.writeToFile(fileName, `onClick: "${methodName}",`);
      } else {
      }
    }
  }
}

async function startApiCallOnClick(
  jsonPath,
  fileName,
  object,
  widgetID,
  pageId,
  isOnClick = false,
  methodName
) {
  let dependency = "";
  const lastComponent = `${path.basename(fileName)}_${
    commonUtils.windowDevice
  }`;
  let collectionJsonPath = `${jsonPath}/collections.json`;

  let actionMethod = "";
  let type = object?.type ?? "";
  if (type == "action") {
    let component = object?.component ?? "";
    if (component !== "") {
      let componentType = component?.componentType ?? "";

      if (componentType === "api_call") {
        const widgetId = widgetID;
        const apiReqId = component?.componentBody?.apiReqId ?? "";
        const apiDetails = await collectionsService.getItemByServerId(
          collectionJsonPath,
          apiReqId
        );

        let requestData = component?.componentBody?.requestData ?? {};
        let payload = requestData?.payload ?? {};
        let mappings = payload?.mappings ?? [];
        const payloadObject = {};
        let dependancyArray = [];
        for (let m = 0; m < mappings.length; m++) {
          let mapObj = mappings[m];
          let source = (mapObj?.source ?? "").replace("$.", "");
          let target = (mapObj?.target ?? "").replace("$.", "");
          target = target.replace(".", "?.");
          let selectedStateId = mapObj?.id ?? "";

          if (selectedStateId.length > 0) {
            let firstValue = selectedStateId.split("-")[0];
            const handler = stateHandler.getInstance();

            if (firstValue == "a") {
              let state = handler.getAppStateByField(
                "id",
                String(selectedStateId)
              );
              payloadObject[source] =
                `get("${state?.name}")?.${target}`.replace(
                  "?.[:]",
                  "[event.index]"
                );
            } else {
              let state = handler.getStateByField(
                String(pageId),
                "stateId",
                String(selectedStateId)
              );
              dependancyArray.push(state?.name);
              payloadObject[source] = `${state?.name}?.${target}`.replace(
                "?.[:]",
                "[event.index]"
              );
            }
          } else {
            payloadObject[source] = target;
          }
        }

        dependency = dependancyArray.join(",");
        let payloadBody = await generatePayloadObjectCode(payloadObject);
        // payloadBody = payloadBody.replace("?.[:]", "[event.index]");
        // console.log("payloadBody:", payloadBody);

           let receivedApiData = "";

            let assignJsonPath = (component?.componentBody?.jsonPath ?? "")
              .replace("$.", "")
              .replace(".", "?.");

            if (
              component?.componentBody?.actionOutputVariable &&
              component?.componentBody?.actionOutputVariableId
            ) {
              receivedApiData =
                assignJsonPath.length > 0 ? `userData?.${assignJsonPath}` : "userData";
            }
        


        actionMethod =
          actionMethod +
          `
                try {
                    const userData = await ApiUtils.request(
                    {
                      url: \"${apiDetails?.request?.url?.raw}\",
                      method: \"${apiDetails?.request?.method}\",
                      body: ${payloadBody},
                      headers: ${JSON.stringify(apiDetails?.request?.headers)},
                    }
                    );

                    setLoading(true);
                     ${
                    receivedApiData
                      ? `sceneValuePassToPage(${receivedApiData}, "${methodName}" );`
                      : ``
                     }
            `;
      } else {
      }
    }
  } else {
  }
  return `${actionMethod}||${dependency}`;
}

async function startApiCall(
  jsonPath,
  fileName,
  object,
  widgetID,
  pageId,
  isOnClick = false
) {
  let dependency = "";
  const lastComponent = `${path.basename(fileName)}_${
    commonUtils.windowDevice
  }`;
  let collectionJsonPath = `${jsonPath}/collections.json`;

  let actionMethod = "";
  let type = object?.type ?? "";
  if (type == "action") {
    let component = object?.component ?? "";
    if (component !== "") {
      let componentType = component?.componentType ?? "";

      if (componentType === "api_call") {
        const widgetId = widgetID;
        const methodName = commonUtils.toPascalCase(
          `${object?.label ?? ""}_${object?.id ?? ""}`
        );

        if (
          isOnClick == true &&
          !(await actionFlowHandler.getOnLoadActionsArray(lastComponent)).some(
            (action) => action.method === methodName
          )
        ) {
          await actionFlowHandler.insertOnLoadAction(lastComponent, {
            method: methodName,
            destinationType: "",
          });
        }

        if (isOnClick == true) {
          await readWriteFile.writeToFile(
            fileName,
            `onClick: "${methodName}",`
          );
        }
        const apiReqId = component?.componentBody?.apiReqId ?? "";
        const apiDetails = await collectionsService.getItemByServerId(
          collectionJsonPath,
          apiReqId
        );

        let requestData = component?.componentBody?.requestData ?? {};
        let payload = requestData?.payload ?? {};
        let mappings = payload?.mappings ?? [];
        const payloadObject = {};
        let dependancyArray = [];
        for (let m = 0; m < mappings.length; m++) {
          let mapObj = mappings[m];
          let source = (mapObj?.source ?? "").replace("$.", "");
          let target = (mapObj?.target ?? "").replace("$.", "");
          target = target.replace(".", "?.");
          let selectedStateId = mapObj?.id ?? "";

          if (selectedStateId.length > 0) {
            let firstValue = selectedStateId.split("-")[0];
            const handler = stateHandler.getInstance();

            if (firstValue == "a") {
              let state = handler.getAppStateByField(
                "id",
                String(selectedStateId)
              );
              payloadObject[source] =
                `get("${state?.name}")?.${target}`.replace(
                  "?.[:]",
                  "[event.index]"
                );
            } else {
              let state = handler.getStateByField(
                String(pageId),
                "stateId",
                String(selectedStateId)
              );
              dependancyArray.push(state?.name);
              payloadObject[source] = `${state?.name}?.${target}`.replace(
                "?.[:]",
                "[event.index]"
              );
            }
          } else {
            payloadObject[source] = target;
          }
        }

            let receivedApiData = "";

            let assignJsonPath = (component?.componentBody?.jsonPath ?? "")
              .replace("$.", "")
              .replace(".", "?.");

            if (
              component?.componentBody?.actionOutputVariable &&
              component?.componentBody?.actionOutputVariableId
            ) {
              receivedApiData =
                assignJsonPath.length > 0 ? `userData?.${assignJsonPath}` : "userData";
            }
        
        dependency = dependancyArray.join(",");
        let payloadBody = await generatePayloadObjectCode(payloadObject);
    

        actionMethod =
          actionMethod +
          `
              ${
                isOnClick == false
                  ? `useEffect(() => {
                       ${methodName}();
                    }, []);`
                  : ``
              }

              const ${methodName} = useCallback(async (event) => {
                try {
                  const userData = await ApiUtils.request(
                  {
                    url: \"${apiDetails?.request?.url?.raw}\",
                    method: \"${apiDetails?.request?.method}\",
                    body: ${payloadBody},
                    headers: ${JSON.stringify(apiDetails?.request?.headers)},
                  }
                  );

                  setLoading(true);
                 ${
                    receivedApiData
                      ? `sceneValuePassToPage(${receivedApiData}, "${methodName}" );`
                      : ``
                  }

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
  } else {
  }

  return dependency;
}

async function navigationOnClick(fileName, object) {
  let actionMethod = "";
  let component = object?.component ?? "";
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
            `;
    } else {
    }
  }
  return actionMethod;
}

async function navigation(fileName, object) {
  let actionMethod = "";
  let component = object?.component ?? "";
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

async function stateUpdatOnClick(pageId, fileName, object) {
  let actionMethod = "";
  let component = object?.component ?? "";
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
                let assignedStateId = field?.assignedStateId ?? "";
                let selectedStateId = field?.selectedStateId ?? "";
                let displayassignState = field?.displayassignState ?? "";
                let displayassignStateFirstValue = displayassignState.split("-")[0];
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
                  // console.log("selectedStateId:", selectedStateId);
                  let firstValue = selectedStateId.split("-")[0];
                  const handler = stateHandler.getInstance();
                  if (firstValue == "a") {
                    let state = handler.getAppStateByField(
                      "id",
                      String(selectedStateId)
                    );
                    actionMethod =
                      actionMethod +
                      `
                      set('${state?.name}',userData${
                        assignJsonPath.length > 0 ? `?.${assignJsonPath}` : ""
                      });  
                  `;
                  } else {
                    let state = handler.getStateByField(
                      String(pageId),
                      "stateId",
                      String(selectedStateId)
                    );
                    // console.log("state:", state);
                    let setState =
                      state?.setMethodName?.length > 0
                        ? `${state?.setMethodName}(userData${
                            assignJsonPath.length > 0 ? `?.${assignJsonPath}` : ""
                          })`
                        : ""; // `${state?.setMethodName}(userData.data.products)`;
                    actionMethod =
                      actionMethod +
                      `
                        ${setState};
                    `;
                  }
                }
            }
         
        }
      }
    } else {
    }
  }
  return actionMethod;
}

async function stateUpdat(pageId, fileName, object) {
  let actionMethod = "";
  let component = object?.component ?? "";
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
                let assignedStateId = field?.assignedStateId ?? "";
                let selectedStateId = field?.selectedStateId ?? "";
                let displayassignState = field?.displayassignState ?? "";
                let displayassignStateFirstValue = displayassignState.split("-")[0];
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
                  // console.log("selectedStateId:", selectedStateId);
                  let firstValue = selectedStateId.split("-")[0];
                  const handler = stateHandler.getInstance();
                  if (firstValue == "a") {
                    let state = handler.getAppStateByField(
                      "id",
                      String(selectedStateId)
                    );
                    actionMethod =
                      actionMethod +
                      `
                      set('${state?.name}',userData${
                        assignJsonPath.length > 0 ? `?.${assignJsonPath}` : ""
                      });  
                  `;
                  } else {
                    let state = handler.getStateByField(
                      String(pageId),
                      "stateId",
                      String(selectedStateId)
                    );
                    // console.log("state:", state);
                    let setState =
                      state?.setMethodName?.length > 0
                        ? `${state?.setMethodName}(userData${
                            assignJsonPath.length > 0 ? `?.${assignJsonPath}` : ""
                          })`
                        : ""; // `${state?.setMethodName}(userData.data.products)`;
                    actionMethod =
                      actionMethod +
                      `
                        ${setState};
                    `;
                  }
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

async function endApiCall(fileName, dependency) {
  // console.log(`endApiCall called for fileName: ${fileName}`);
  let actionMethod = "";
  actionMethod =
    actionMethod +
    ` 
      } catch (error) {
         setLoading(false);
      } finally {
       
      }
    }, [${dependency}]);

    [action_method]
  `;
  await readWriteFile.replaceWordInFile(
    fileName,
    "[action_method]",
    actionMethod
  );
}

async function endApiCallOnClick(fileName, dependency) {
  // console.log(`endApiCall called for fileName: ${fileName}`);
  let actionMethod = "";
  actionMethod =
    actionMethod +
    ` 
      } catch (error) {
         setLoading(false);
      } finally {
       
      }
    }, [${dependency}]);

  `;
  return actionMethod;
}

async function generatePayloadObjectCode(payloadObject) {
  const entries = Object.entries(payloadObject);
  if (entries.length === 0) return "{}";

  const properties = entries.map(([key, value]) => {
    // If the value is a string that looks like a variable reference, keep it as is
    if (
      typeof value === "string" &&
      (value.includes("?.") || value.includes("get("))
    ) {
      return `  ${JSON.stringify(key)}: ${value}`;
    }
    // Otherwise, stringify the value
    return `  ${JSON.stringify(key)}: ${JSON.stringify(value)}`;
  });

  return `{\n${properties.join(",\n")}\n}`;
}

async function datasetMapper(apiReqId, dataSetId) {
  let datasetObj = await datasetService.fetchDataset(apiReqId, dataSetId);
  return datasetObj ?? {};
}

function simplifyTargetKey(targetKey) {
  return targetKey.replace(/\[:\]/g, "");
}

module.exports = {
  apiCallMapperOnClick,
  apiCallMapperOnClickSingleObject,
  apiCallMapperOnLoad,
  apiCallMapperOnLoadSingleObject,
  apiCallMapperFormSubmit,
  // apiCallForFormSubmit,
  startApiCallOnClick,
  startApiCall,
  navigationOnClick,
  navigation,
  stateUpdatOnClick,
  stateUpdat,
  endApiCall,
  endApiCallOnClick,
};
