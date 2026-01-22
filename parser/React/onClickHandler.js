// async function getOnClickProps(jsonObjects) {

//   const hasOnClick = jsonObjects?.onClick;

//   const onClick = hasOnClick != undefined ? 'Yes' : 'No';
//   const action = onClick === 'Yes' ? hasOnClick?.action : '';
//   const navigation = onClick === 'Yes' ? hasOnClick?.destination : '';

//   return { onClick, action, navigation };
// }

// module.exports = getOnClickProps;

const commonUtils = require("../../utility/common_utils");
const homeController = require("./react_parser_home_controller");

async function getOnClickProps(jsonObjects) {
  const hasOnClick = jsonObjects?.onClick;

  const onClick = hasOnClick != undefined ? "Yes" : "";
  const action = onClick === "Yes" ? hasOnClick?.action : "";
  const navigation = onClick === "Yes" ? hasOnClick?.destination : "";

  /*if (action === "Navigate to" && navigation) {
    const destination = navigation.trim();
    const destinationFileName = destination.replace(/-/g, "_");
    const pascalCaseName = commonUtils.toPascalCase(destinationFileName);
    await reactParserSlugPage.parseSlugPageContent(pascalCaseName, navigation);
  }*/

  return { onClick, action, navigation };
}

module.exports = getOnClickProps;
