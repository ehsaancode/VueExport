const readWriteFile = require("../../utility/read_write_file");
const actionFlowHandler = require("../../utility/action_flow_handler");
const commonUtils = require("../../utility/common_utils");
const reactUtilits = require("../../parser/React/common_utilits_react");
const path = require("path");

let actionMethod = "";

async function showModel(fileName, object) {
  const lastComponent = `${path.basename(fileName)}_${
    commonUtils.windowDevice
  }`;
  actionMethod = "";
  let component = object?.component ?? "";
  let componentType = component?.componentType ?? "";
  if (componentType === "ui_interaction") {
    let modelName = (component?.componentBody?.selectedCMSName).replace(
      " ",
      "_"
    );
    const refModelName = modelName.replace(/-/g, "_");
    const updatedModelName = commonUtils.toPascalCase(refModelName);
    actionMethod =
      actionMethod +
      `
          openModal("${updatedModelName}");

      `;
  }
  return actionMethod;
}

async function showModel_copy(fileName, object) {
  const lastComponent = `${path.basename(fileName)}_${
    commonUtils.windowDevice
  }`;
  // object = object.length > 0 ? object[0] : object;
  // object = object.length > 0 ? object[0] : object;
  let component = object?.component ?? "";
  // console.log(`object: ${JSON.stringify(object)}`);
  let componentType = component?.componentType ?? "";
  if (componentType === "ui_interaction") {
    // let destinationType =
    //   component?.componentBody?.destination?.destinationType ?? "";
    // const destination = "";

    const methodName = commonUtils.toPascalCase(
      `${object?.label ?? ""}_${object?.id ?? ""}`
    );
    let modelName = (component?.componentBody?.selectedCMSName).replace(
      " ",
      "_"
    );
    const refModelName = modelName.replace(/-/g, "_");
    const updatedModelName = commonUtils.toPascalCase(refModelName);
    // Now actionsManager is guaranteed to be valid
    if (
      !(await actionFlowHandler.getActionsArray(lastComponent)).some(
        (action) => action.method === methodName
      )
    ) {
      // console.log(`navigate_to destinationType: ${destinationType}`);
      actionMethod =
        (await actionFlowHandler.actionObjects[lastComponent]) ?? "";
      // if (actionMethod.length === 0) {
      //   actionMethod = "const navigate = useNavigate();\n";
      // }
      actionMethod =
        actionMethod +
        `
                const ${methodName} = useCallback((event) => {
                  openModal("${updatedModelName}");
                }, []);
  
              `;
      actionFlowHandler.actionObjects[lastComponent] = actionMethod;
      await actionFlowHandler.insertAction(lastComponent, {
        method: methodName,
        destinationType: "",
      });
    }

    await readWriteFile.writeToFile(fileName, `onClick: "${methodName}",`);
  }
}

module.exports = {
  showModel,
};
