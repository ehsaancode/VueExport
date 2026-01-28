const readWriteFile = require("../../utility/read_write_file");
const commonUtils = require("../../utility/common_utils");
const commonPath = require("../../utility/common_path");
const path = require("path");

const vueProjectPath = path.resolve(
  __dirname,
  `${commonPath.vueProjectPath.get(commonPath.environmentHosting)}`
);

const destinations = [];

async function addDestinations(slug, isCurrentPage = false) {
  const destination = slug.trim();
  const destinationFileName = destination.replace(/-/g, "_");
  const pascalCaseName = commonUtils.toPascalCase(destinationFileName);
  if (isCurrentPage === true) {
    // console.log(`pascalCaseName: ${pascalCaseName}`);
    commonUtils.currentPage = slug;
  }

  destinations.push({
    slug: slug,
    screen: pascalCaseName,
  });
}

async function createAndUpdateHomeController(defaultSlug = "") {
  console.log("createAndUpdateHomeController skipped for Vue Router architecture.");
  // This function was generating a legacy React-style Home controller which is not needed
  // with the new Vue Router setup. Disabling it prevents ENOENT errors for missing templates.
}

module.exports = {
  addDestinations,
  createAndUpdateHomeController,
  destinations,
};
