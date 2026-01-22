const commonUtils = require("../../utility/common_utils");

const destinations = [];

async function addDestinations(destination) {
  let destinationFileName = commonUtils.toPascalCase(
    `${destination.replace("-", "_").trim()}Screen`
  );
  destinations.push({
    slug: `\"${destination.replace("-", "_").trim()}\"`,
    screen: `${destinationFileName}`,
  });
}

module.exports = {
  addDestinations,
};
