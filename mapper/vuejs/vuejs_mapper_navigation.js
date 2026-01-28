const readWriteFile = require("../../utility/read_write_file");
const actionFlowHandler = require("../../utility/action_flow_handler");
const commonUtils = require("../../utility/common_utils");
const reactUtilits = require("../../parser/Vue/common_utilits_vue");
const path = require("path");

let actionMethod = "";

// Remove the import of actionsManager - receive it as parameter instead
async function navigateMapper(fileName, onClickObjects) {
  const lastComponent = `${path.basename(fileName)}_${
    commonUtils.windowDevice
  }`;

  if (!onClickObjects || onClickObjects.length === 0) {
    console.log("⚠️ No onClickObjects provided, exiting");
    // return;
  }

  for (let i = 0; i < onClickObjects.length; i++) {
    let onClickObject = onClickObjects[i];
    let component = onClickObject?.component ?? "";

    if (component !== "") {
      let componentType = component?.componentType ?? "";
      if (componentType === "navigate_to") {
        // let destinationType =
        //   component?.componentBody?.destination?.destinationType ?? "";
        const destination =
          component?.componentBody?.destination?.destinationType.trim() ?? "";
        const destinationFileName = destination.replace(/-/g, "_");
        let destinationType = commonUtils.toPascalCase(destinationFileName);

        if (destinationType) {
          const methodName = `navigateTo${destinationType}`;
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
                NavigationUtils.navigateTo(navigate, "/${destinationType}");
              }, [navigate]);

            `;
            actionFlowHandler.actionObjects[lastComponent] = actionMethod;
            await actionFlowHandler.insertAction(lastComponent, {
              method: methodName,
              destinationType: destinationType,
            });
          }

          await readWriteFile.writeToFile(
            fileName,
            `onClick: "${methodName}",`
          );
        }
      } else if (componentType === "navigate_back") {
        if (
          !(await actionFlowHandler.getActionsArray(lastComponent)).some(
            (action) => action.method === "navigateBack"
          )
        ) {
          actionMethod =
            (await actionFlowHandler.actionObjects[lastComponent]) ?? "";
          // if (actionMethod.length === 0) {
          //   actionMethod = "const navigate = useNavigate();\n";
          // }
          actionMethod =
            actionMethod +
            `
            const navigateBack = useCallback((event) => {
              NavigationUtils.goBack(navigate);
            }, [navigate]);
          `;
          actionFlowHandler.actionObjects[lastComponent] = actionMethod;

          /*await readWriteFile.replaceWordInFile(
            fileName,
            "[action_method]",
            actionMethod
          );*/

          await actionFlowHandler.insertAction(lastComponent, {
            method: "navigateBack",
          });
        }

        await readWriteFile.writeToFile(fileName, `onClick: "navigateBack",`);
      }
    }
  }
}

async function navigateMapperWithSingleObject(fileName, onClickObject) {
  let component = onClickObject?.component ?? "";
  let componentType = component?.componentType ?? "";
  actionMethod = "";
  if (componentType === "navigate_to") {
    const destination =
      component?.componentBody?.destination?.destinationType.trim() ?? "";
    const destinationFileName = destination.replace(/-/g, "_");
    let destinationType = commonUtils.toPascalCase(destinationFileName);
    if (destinationType) {
      actionMethod =
        actionMethod +
        `
                ${
                  destinationType == "Checkout" ? "closeModal('CartModal')" : ""
                }
                NavigationUtils.navigateTo(navigate, "/${destinationType}");
            `;
    }
  } else if (componentType === "navigate_back") {
    actionMethod =
      actionMethod +
      `
          NavigationUtils.goBack(navigate);
      `;
  }
  return actionMethod;
}

async function navigateMapperWithSingleObject_copy(fileName, onClickObject) {
  // console.log(`navigateMapperWithSingleObject called`);
  const lastComponent = `${path.basename(fileName)}_${
    commonUtils.windowDevice
  }`;
  // onClickObject = onClickObject.length > 0 ? onClickObject[0] : onClickObject;
  // onClickObject = onClickObject.length > 0 ? onClickObject[0] : onClickObject;
  let component = onClickObject?.component ?? "";
  // console.log(`onClickObject: ${JSON.stringify(onClickObject)}`);
  let componentType = component?.componentType ?? "";
  if (componentType === "navigate_to") {
    // let destinationType =
    //   component?.componentBody?.destination?.destinationType ?? "";
    const destination =
      component?.componentBody?.destination?.destinationType.trim() ?? "";
    const destinationFileName = destination.replace(/-/g, "_");
    let destinationType = commonUtils.toPascalCase(destinationFileName);

    if (destinationType) {
      const methodName = `navigateTo${destinationType}`;
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
                ${
                  destinationType == "Checkout" ? "closeModal('CartModal')" : ""
                }
                NavigationUtils.navigateTo(navigate, "/${destinationType}");
              }, [navigate]);

            `;
        actionFlowHandler.actionObjects[lastComponent] = actionMethod;
        await actionFlowHandler.insertAction(lastComponent, {
          method: methodName,
          destinationType: destinationType,
        });
      }

      // console.log(`methodName: ${methodName}`);
      // console.log(`fileName: ${fileName}`);
      await readWriteFile.writeToFile(fileName, `onClick: "${methodName}",`);
    }
  } else if (componentType === "navigate_back") {
    if (
      !(await actionFlowHandler.getActionsArray(lastComponent)).some(
        (action) => action.method === "navigateBack"
      )
    ) {
      actionMethod =
        (await actionFlowHandler.actionObjects[lastComponent]) ?? "";
      // if (actionMethod.length === 0) {
      //   actionMethod = "const navigate = useNavigate();\n";
      // }
      actionMethod =
        actionMethod +
        `
            const navigateBack = useCallback((event) => {
              NavigationUtils.goBack(navigate);
            }, [navigate]);
          `;
      actionFlowHandler.actionObjects[lastComponent] = actionMethod;

      /*await readWriteFile.replaceWordInFile(
            fileName,
            "[action_method]",
            actionMethod
          );*/

      await actionFlowHandler.insertAction(lastComponent, {
        method: "navigateBack",
      });
    }

    await readWriteFile.writeToFile(fileName, `onClick: "navigateBack",`);
  }
}

async function endNavigateMapper(fileName) {
  // actionMethod = actionMethod + "\n [action_method]";
  // console.log(`endNavigateMapper fileName: ${fileName}`);
  const lastComponent = `${path.basename(fileName)}_${
    commonUtils.windowDevice
  }`;
  actionMethod = (await actionFlowHandler.actionObjects[lastComponent]) ?? "";
  // console.log("Final actionMethod:", actionMethod);
  // console.log(`fileName: ${fileName}`);
  await readWriteFile.replaceWordInFile(
    fileName,
    "[action_method]",
    actionMethod
  );
  // actionMethod = "const navigate = useNavigate();\n";
  actionFlowHandler.actionObjects[lastComponent] = "";
}

module.exports = {
  navigateMapper,
  navigateMapperWithSingleObject,
  endNavigateMapper,
};
