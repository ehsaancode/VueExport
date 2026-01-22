const readWriteFile = require("../../utility/read_write_file");
const commonUtils = require("../../utility/common_utils");
const commonPath = require("../../utility/common_path");
const path = require("path");

const reactProjectPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectPath.get(commonPath.environmentHosting)}`
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
  const uniqueArray = destinations.filter(
    (item, index, self) =>
      index ===
      self.findIndex((t) => t.slug === item.slug && t.screen === item.screen)
  );
  let subProjectPath = commonUtils.projectId;
  let pageName = `${reactProjectPath}/${subProjectPath}/react_project/src/pages/Home.jsx`;
  // delete require.cache[require.resolve(pageName)];
  await readWriteFile.deleteFile(pageName);
  let projectTemplatePath = `${reactProjectPath}/${subProjectPath}/template`;
  let sourceTopPage = `${projectTemplatePath}/topTemplate.txt`;
  console.log(`sourceTopPage: ${sourceTopPage}`);
  await readWriteFile.copyPasteFileContent(sourceTopPage, pageName);

  let importClasses = "";
  for (const index in uniqueArray) {
    var jsonObj = uniqueArray[index];
    var className = jsonObj["screen"];

    let classFilePath = "";
    // classFilePath = `./created_files/React/react_export/src/templates/${className}_D.jsx`;
    classFilePath = `${reactProjectPath}/${subProjectPath}/react_project/src/templates/${className}_D.jsx`;
    if (await readWriteFile.fileExists(classFilePath)) {
      importClasses =
        importClasses +
        `import { ${className}_D } from "../templates/${className}_D";\n`;
    }

    // classFilePath = `./created_files/React/react_export/src/templates/${className}_M.jsx`;
    classFilePath = `${reactProjectPath}/${subProjectPath}/react_project/src/templates/${className}_M.jsx`;
    if (await readWriteFile.fileExists(classFilePath)) {
      importClasses =
        importClasses +
        `import { ${className}_M } from "../templates/${className}_M";\n`;
    }
  }

  await readWriteFile.replaceWordInFile(
    pageName,
    `import { [class_name] } from "../templates/[class_name]";`,
    importClasses
  );

  await readWriteFile.writeToFile(pageName, `\n`);
  let isStarted = false;
  for (const index in uniqueArray) {
    var jsonObj = uniqueArray[index];
    var slug = jsonObj["slug"];
    var className = jsonObj["screen"];

    let desktopClassFilePath = `${reactProjectPath}/${subProjectPath}/react_project/src/templates/${className}_D.jsx`;
    let mobileClassFilePath = `${reactProjectPath}/${subProjectPath}/react_project/src/templates/${className}_M.jsx`;
    // classFilePath = `./created_files/React/react_export/src/templates/${className}_D.jsx`;
    // classFilePath = `${reactProjectPath}/${subProjectPath}/react_project/src/templates/${className}_D.jsx`;
    let screen = "(screenWidth >= 800 ? ";
    if (await readWriteFile.fileExists(desktopClassFilePath)) {
      screen = screen + `<${className}_D />`;
    } else {
      screen = screen + `<></>`;
    }
    screen = screen + " : ";
    // classFilePath = `./created_files/React/react_export/src/templates/${className}_M.jsx`;
    // classFilePath = `${reactProjectPath}/${subProjectPath}/react_project/src/templates/${className}_M.jsx`;
    if (await readWriteFile.fileExists(mobileClassFilePath)) {
      screen = screen + `<${className}_M />)`;
    } else {
      if (await readWriteFile.fileExists(desktopClassFilePath)) {
        screen = screen + `<${className}_D />)`;
      } else {
        screen = screen + `<></>)`;
      }
    }
    let pageDestination = "";
    if (defaultSlug === slug) {
      pageDestination = `(id === "" || id === \"${slug}\") ?\n`;
    } else if (slug.length > 0) {
      pageDestination = `id === \"${slug}\" ?\n`;
    } else {
    }
    if (pageDestination.length > 0) {
      if (isStarted === false) {
        isStarted = true;
        await readWriteFile.writeToFile(
          pageName,
          " ".repeat(4) +
            `\n{\n` +
            " ".repeat(6) +
            `${pageDestination}` +
            " ".repeat(6) +
            `${screen} :\n`
          // `(screenWidth >= 800 ? <${className}_D /> : <${className}_M />) :\n`
        );
      } else {
        await readWriteFile.writeToFile(
          pageName,
          " ".repeat(6) + `${pageDestination}` + " ".repeat(6) + `${screen} :\n`
          // `(screenWidth >= 800 ? <${className}_D /> : <${className}_M />) :\n`
        );
      }
    }
  }
  await readWriteFile.writeToFile(pageName, " ".repeat(4) + `<></>}\n`);

  let sourceBottomPage = `${projectTemplatePath}/bottomTemplate.txt`;
  // console.log(`sourceBottomPage: ${sourceBottomPage}`);
  await readWriteFile.appendFileContent(sourceBottomPage, pageName);
}

module.exports = {
  addDestinations,
  createAndUpdateHomeController,
  destinations,
};
