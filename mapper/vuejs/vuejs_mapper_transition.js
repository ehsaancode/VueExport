const readWriteFile = require("../../utility/read_write_file");
const stateHandler = require("../../utility/state_handler");
const commonUtils = require("../../utility/common_utils");
const actionFlowHandler = require("../../utility/action_flow_handler");
const path = require("path");

let actionMethod = "";

async function transitionManagement(pageId, fileName, object, useEffectApply = 'No', returnn = 'No') {
  let component = object?.component ?? "";
  if (component !== "") {
    let componentType = component?.componentType ?? "";

    if (componentType === "scene_transition") {

      if (returnn == 'No') {
        const destination = component?.componentBody?.destination?.destinationType.trim() ?? "";
        const destinationFileName = destination.replace(/-/g, "_");
        let destinationType = commonUtils.toPascalCase(destinationFileName);

        actionMethod =
          useEffectApply === "Yes"
            ? `
              useEffect(() => {
                setTimeout(() => {
                  setupSceneCalling('${destinationType}');
                }, 1000);
              }, []);
              [action_method]
              `
            : `
              setTimeout(() => {
                setupSceneCalling('${destinationType}');
              }, 1000);
              [action_method]
              `;


        await readWriteFile.replaceWordInFile(
          fileName,
          "[action_method]",
          actionMethod
        );
      }else{
        let actionMethod = "";

          const destination = component?.componentBody?.destination?.destinationType.trim() ?? "";
        const destinationFileName = destination.replace(/-/g, "_");
        let destinationType = commonUtils.toPascalCase(destinationFileName);

        actionMethod =actionMethod+
          useEffectApply === "Yes"
            ? `
              useEffect(() => {
                setTimeout(() => {
                  setupSceneCalling('${destinationType}');
                }, 1000);
              }, []);
              
              `
            : `
              setTimeout(() => {
                setupSceneCalling('${destinationType}');
              }, 1000);
             
              `;

      return actionMethod;


      }



    }
  }


}

module.exports = {
  transitionManagement
};
