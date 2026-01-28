const readWriteFile = require("../../utility/read_write_file");
const stateHandler = require("../../utility/state_handler");
const commonUtils = require("../../utility/common_utils");
const actionFlowHandler = require("../../utility/action_flow_handler");
const path = require("path");

async function stateManagement_(pageId, fileName, object) {
  // let actionMethod = "useEffect(() => {";
  let component = object?.component ?? "";
  if (component !== "") {
    let componentType = component?.componentType ?? "";

    if (componentType === "state_management") {
      let componentBody = component?.componentBody ?? "";
      if (componentBody !== "") {
        let fields = componentBody?.fields ?? [];
        if (fields.length > 0) {
          let field = fields[0];
          const handler = stateHandler.getInstance();
          let assignJsonPath = (field?.assignJsonPath ?? "").replace("$.", "");
          assignJsonPath = assignJsonPath.replace(".", "?.");
          assignJsonPath =
            assignJsonPath.length > 0 ? `?.${assignJsonPath}` : "";

          let assignedStateId = field?.assignedStateId ?? "";
          let assignedState = null;
          let selectedStateId = field?.selectedStateId ?? "";
          let selectedState = null;
          let firstValueAssignedStateId = assignedStateId.split("-")[0];
          if (firstValueAssignedStateId == "a") {
            assignedState = handler.getAppStateByField(
              "id",
              String(assignedStateId)
            );
          } else {
            assignedState = handler.getStateByField(
              String(pageId),
              "stateId",
              String(assignedStateId)
            );
          }

          let firstValueSelectedStateId = selectedStateId.split("-")[0];
          if (firstValueSelectedStateId == "a") {
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
          let stateObjects = {};
          stateObjects.pageId = pageId;
          stateObjects.selectedStateId = selectedStateId;
          stateObjects.assignedStateId = assignedStateId;
          stateObjects.selectedStateMethodName = selectedState?.setMethodName;
          stateObjects.selectedStateName = selectedState?.name;
          stateObjects.assignedStateName = assignedState?.name;
          stateObjects.assignedStateMethodName = assignedState?.setMethodName;
          stateObjects.assignJsonPath = assignJsonPath;
          handler.addAssignedState(stateObjects);

          /*let firstValueAssignedStateId = assignedStateId.split("-")[0];
          
          if (firstValueAssignedStateId == "a") {
            assignedState = handler.getAppStateByField(
              "id",
              String(assignedStateId)
            );
          } else {
          }

          let selectedStateId = field?.selectedStateId ?? "";
          let firstValue = selectedStateId.split("-")[0];
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
                [action_method] 
            `;
          } else {
            

            const handler = stateHandler.getInstance();
            handler.states = {
              key: String(`${pageId}`),
              value: stateObjects,
            };
            let state = handler.getStateByField(
              String(pageId),
              "stateId",
              String(selectedStateId)
            );
            console.log("state:", state);
            let setState = "";
            if (assignedState != null || assignedState?.name.length > 0) {
              setState =
                state?.setMethodName?.length > 0
                  ? `${state?.setMethodName}(get("${assignedState.name}")${
                      assignJsonPath.length > 0 ? `?.${assignJsonPath}` : ""
                    })`
                  : "";

              setState =
                setState +
                `
                   const unsubscribe = subscribe(() => {
                  `;
            } else {
              setState =
                state?.setMethodName?.length > 0
                  ? `${state?.setMethodName}(userData${
                      assignJsonPath.length > 0 ? `?.${assignJsonPath}` : ""
                    })`
                  : "";
            }
            actionMethod =
              actionMethod +
              `
                  ${setState};
                  [action_method]
              `;
          }*/
        }
      }

      /*actionMethod =
        actionMethod +
        `
                  }, []);
                  [action_method]
              `;

      if (actionMethod.length > 0) {
        await readWriteFile.replaceWordInFile(
          fileName,
          "[action_method]",
          actionMethod
        );
      }*/
    } else {
    }
  }
}


async function stateManagement(pageId, fileName, object) {
  let actionMethod = "useEffect(() => {";
  let component = object?.component ?? "";
  if (component !== "") {
    let componentType = component?.componentType ?? "";

    if (componentType === "state_management") {
      let componentBody = component?.componentBody ?? "";
      if (componentBody !== "") {
        let fields = componentBody?.fields ?? [];
        if (fields.length > 0) {
            for (let m = 0; m < fields.length; m++) {

          let field = fields[m];
          const handler = stateHandler.getInstance();
          let assignJsonPath = (field?.assignJsonPath ?? "").replace("$.", "");
          assignJsonPath = assignJsonPath.replace(".", "?.");
          assignJsonPath =
            assignJsonPath.length > 0 ? `?.${assignJsonPath}` : "";

          let assignedStateId = field?.assignedStateId ?? "";
          let assignedState = null;
          let selectedStateId = field?.selectedStateId ?? "";
          let selectedState = null;
          let firstValueAssignedStateId = assignedStateId.split("-")[0];
          if (firstValueAssignedStateId == "a") {
            assignedState = handler.getAppStateByField(
              "id",
              String(assignedStateId)
            );
          } else {
            assignedState = handler.getStateByField(
              String(pageId),
              "stateId",
              String(assignedStateId)
            );
          }

          let firstValueSelectedStateId = selectedStateId.split("-")[0];
          if (firstValueSelectedStateId == "a") {
            selectedState = handler.getAppStateByField(
              "id",
              String(selectedStateId)
            );
            actionMethod =
              actionMethod +
              `
                set('${selectedState?.name}',userData${assignJsonPath});  
            `;
          } else {
            selectedState = handler.getStateByField(
              String(pageId),
              "stateId",
              String(selectedStateId)
            );
            let setState = "";
            if ((assignedState != null || assignedState?.name.length > 0)

              && firstValueAssignedStateId!='ao'
            ) {
              setState =
                selectedState?.setMethodName?.length > 0
                  ? `${selectedState?.setMethodName}(get("${assignedState.name}")${assignJsonPath})`
                  : "";

              setState =
                setState +
                `
                   const unsubscribe = subscribe(() => {
                    ${selectedState?.setMethodName}(get("${assignedState.name}")${assignJsonPath})
                  });

                  return unsubscribe;
                  `;
            } else {
              if (firstValueAssignedStateId=='ao')
              {
                setState =
                selectedState?.setMethodName?.length > 0
                  ? `${selectedState?.setMethodName}(receivedValueFromPage${assignJsonPath})`
                  : "";
              }else {
                setState =
                selectedState?.setMethodName?.length > 0
                  ? `${selectedState?.setMethodName}(userData${assignJsonPath})`
                  : "";
              }
              
            }
            actionMethod =
              actionMethod +
              `
                  ${setState};
              `;
          }
          let stateObjects = {};
          stateObjects.pageId = pageId;
          stateObjects.selectedStateId = selectedStateId;
          stateObjects.assignedStateId = assignedStateId;
          stateObjects.selectedStateMethodName = selectedState?.setMethodName;
          stateObjects.selectedStateName = selectedState?.name;
          stateObjects.assignedStateName = assignedState?.name;
          stateObjects.assignedStateMethodName = assignedState?.setMethodName;
          stateObjects.assignJsonPath = assignJsonPath;
          handler.addAssignedState(stateObjects);

          /*let firstValueAssignedStateId = assignedStateId.split("-")[0];
          
          if (firstValueAssignedStateId == "a") {
            assignedState = handler.getAppStateByField(
              "id",
              String(assignedStateId)
            );
          } else {
          }

          let selectedStateId = field?.selectedStateId ?? "";
          let firstValue = selectedStateId.split("-")[0];
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
                [action_method] 
            `;
          } else {
            

            const handler = stateHandler.getInstance();
            handler.states = {
              key: String(`${pageId}`),
              value: stateObjects,
            };
            let state = handler.getStateByField(
              String(pageId),
              "stateId",
              String(selectedStateId)
            );
            console.log("state:", state);
            let setState = "";
            if (assignedState != null || assignedState?.name.length > 0) {
              setState =
                state?.setMethodName?.length > 0
                  ? `${state?.setMethodName}(get("${assignedState.name}")${
                      assignJsonPath.length > 0 ? `?.${assignJsonPath}` : ""
                    })`
                  : "";

              setState =
                setState +
                `
                   const unsubscribe = subscribe(() => {
                  `;
            } else {
              setState =
                state?.setMethodName?.length > 0
                  ? `${state?.setMethodName}(userData${
                      assignJsonPath.length > 0 ? `?.${assignJsonPath}` : ""
                    })`
                  : "";
            }
            actionMethod =
              actionMethod +
              `
                  ${setState};
                  [action_method]
              `;
          }*/
            }
        
        }
      }

      actionMethod =
        actionMethod +
        `
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
    } else {
    }
  }
}

async function updateAsignedState(fileName, pageId) {
  const handler = stateHandler.getInstance();
  const asignStates = handler.getAllUniqueAssignedStates(pageId);
  // console.log(`pageId: ${pageId} asignStates: ${JSON.stringify(asignStates)}`);
  if (asignStates.length > 0) {
    let actionMethod = "useEffect(() => {";
    for (let i = 0; i < asignStates.length; i++) {
      const asignedObj = asignStates[i];
      actionMethod =
        actionMethod +
        `
        ${asignedObj.selectedStateMethodName}(get("${asignedObj.assignedStateName}")${asignedObj.assignJsonPath});
      `;
    }
    actionMethod =
      actionMethod +
      `\n
        // Subscribe for any store change
        const unsubscribe = subscribe(() => {\n
      `;
    for (let i = 0; i < asignStates.length; i++) {
      const asignedObj = asignStates[i];
      actionMethod =
        actionMethod +
        `
        ${asignedObj.selectedStateMethodName}(get("${asignedObj.assignedStateName}")${asignedObj.assignJsonPath});
      `;
    }
    actionMethod =
      actionMethod +
      `\n
         });
         
        return unsubscribe;
        }, []);

        [action_method]
      `;
    await readWriteFile.replaceWordInFile(
      fileName,
      "[action_method]",
      actionMethod
    );
  }
}

async function asignedState(
  assignedStateId,
  selectedStateId,
  assignJsonPath,
  pageId
) {
  let asignedState = "";
  let firstValue = selectedStateId.split("-")[0];
  let assignedFirstValue = assignedStateId.split("-")[0];
  let selectedState = {};
  let assignedState = {};
  const handler = stateHandler.getInstance();
  if (assignedFirstValue == "a") {
    assignedState = handler.getAppStateByField("id", String(assignedStateId));
  } else {
    assignedState = handler.getStateByField(
      String(pageId),
      "stateId",
      String(assignedStateId)
    );
  }
  if (firstValue == "a") {
    selectedState = handler.getAppStateByField("id", String(selectedStateId));
    if (assignedFirstValue == "a") {
      asignedState = `set('${selectedState.name}', get('${assignedState.name}')${assignJsonPath});
      forceUpdate(v => v + 1);`;
      if (selectedState?.persist == true) {
        asignedState =
          asignedState +
          `
           if(storageInstance){
             await storageInstance.localStorageSet(
              "${selectedState.name}",
              get('${assignedState.name}')${assignJsonPath}
              );
          }`;
      }
    } else {
      asignedState = `set('${selectedState.name}', ${assignedState.name}${assignJsonPath});
                      forceUpdate(v => v + 1);`;
      if (selectedState?.persist == true) {
        asignedState =
          asignedState +
          `
           if(storageInstance){
             await storageInstance.localStorageSet(
              "${selectedState.name}",
              ${assignedState.name}${assignJsonPath}
              );
          }`;
      }
    }
  } else {
    selectedState = handler.getStateByField(
      String(pageId),
      "stateId",
      String(selectedStateId)
    );
    if (assignedFirstValue == "a") {
      asignedState = `${selectedState.setMethodName}(get('${assignedState.name}')${assignJsonPath});`;
      if (selectedState?.persist == true) {
        asignedState =
          asignedState +
          `
           if(storageInstance){
             await storageInstance.localStorageSet(
              "${selectedState.name}",
              get('${assignedState.name}')${assignJsonPath}
              );
          }`;
      }
    } else {
      asignedState = `${selectedState.setMethodName}(${assignedState.name}${assignJsonPath});`;
      if (selectedState?.persist == true) {
        asignedState =
          asignedState +
          `
           if(storageInstance){
             await storageInstance.localStorageSet(
              "${selectedState.name}",
              ${assignedState.name}${assignJsonPath}
              );
          }`;
      }
    }
  }
  asignedState = asignedState.replace("?.[:]", "[event.index]");
  return asignedState;
}

async function onClickStateUpdate(fileName, object, pageId) {
  let component = object?.component ?? "";
  let componentType = component?.componentType ?? "";
  let actionMethod = "";
  if (componentType === "state_management") {
    let componentBody = component?.componentBody ?? "";
    if (componentBody !== "") {
      let fields = componentBody?.fields ?? [];
      if (fields.length > 0) {
        let field = fields[0];
        let assignJsonPath = (field?.assignJsonPath ?? "").replace("$.", "");
        assignJsonPath = assignJsonPath.replace(".", "?.");
        let selectedStateId = field?.selectedStateId ?? "";
        let assignedStateId = field?.assignedStateId ?? "";
        let displayassignState = field?.displayassignState ?? "";
        let displayassignStateFirstValue = displayassignState.split("-")[0];
        if (
          assignedStateId.length > 0 &&
          displayassignStateFirstValue != "ao"
        ) {
          let stateValue = await asignedState(
            assignedStateId,
            selectedStateId,
            assignJsonPath.length > 0 ? `?.${assignJsonPath}` : "",
            pageId
          );

          actionMethod =
            actionMethod +
            `
                ${stateValue};
            `;
        } else {
        }
      }
    }
  } else {
  }

  return actionMethod;
}

async function onClickStateUpdate_copy(fileName, object, pageId) {
  const lastComponent = `${path.basename(fileName)}_${
    commonUtils.windowDevice
  }`;
  let component = object?.component ?? "";
  let componentType = component?.componentType ?? "";
  if (componentType === "state_management") {
    const methodName = commonUtils.toPascalCase(
      `${object?.label ?? ""}_${object?.id ?? ""}`
    );
    // Now actionsManager is guaranteed to be valid
    if (
      !(await actionFlowHandler.getActionsArray(lastComponent)).some(
        (action) => action.method === methodName
      )
    ) {
      let componentBody = component?.componentBody ?? "";
      if (componentBody !== "") {
        let fields = componentBody?.fields ?? [];
        if (fields.length > 0) {
          let field = fields[0];
          let assignJsonPath = (field?.assignJsonPath ?? "").replace("$.", "");
          assignJsonPath = assignJsonPath.replace(".", "?.");
          let selectedStateId = field?.selectedStateId ?? "";
          let assignedStateId = field?.assignedStateId ?? "";
          let displayassignState = field?.displayassignState ?? "";
          let displayassignStateFirstValue = displayassignState.split("-")[0];
          if (
            assignedStateId.length > 0 &&
            displayassignStateFirstValue != "ao"
          ) {
            let stateValue = await asignedState(
              assignedStateId,
              selectedStateId,
              assignJsonPath.length > 0 ? `?.${assignJsonPath}` : "",
              pageId
            );
            actionMethod =
              (await actionFlowHandler.actionObjects[lastComponent]) ?? "";

            actionMethod =
              actionMethod +
              `
              const ${methodName} = useCallback((event) => {
                ${stateValue};
              }, []);

            `;
            actionFlowHandler.actionObjects[lastComponent] = actionMethod;
            await actionFlowHandler.insertAction(lastComponent, {
              method: methodName,
              destinationType: "",
            });
          } else {
          }
        }
      }
    }

    await readWriteFile.writeToFile(fileName, `onClick: "${methodName}",`);
  } else {
  }
}

module.exports = {
  stateManagement,
  updateAsignedState,
  asignedState,
  onClickStateUpdate,
};
