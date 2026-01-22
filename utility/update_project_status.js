const readWriteFile = require("./read_write_file");
const commonPath = require("./common_path");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const reactProjectPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectPath.get(commonPath.environmentHosting)}`
);

async function getProjectStatus(projectId, platform) {
  let subProjectPath = projectId;
  let statusJsonPath = `${reactProjectPath}/status.json`;
  if ((await readWriteFile.fileExists(statusJsonPath)) == true) {
    await delete require.cache[require.resolve(statusJsonPath)];
    let objects = await require(statusJsonPath);
    if (!objects.modified_at) {
      return "empty";
    } else {
      const modifiedTime = new Date(objects.modified_at);
      const currentTime = new Date();
      const timeDifferenceInSeconds = (currentTime - modifiedTime) / 1000;

      // Check if more than 30 seconds have passed
      if (timeDifferenceInSeconds > 30) {
        return "error";
      } else {
        return objects.status || "empty";
      }
    }
  } else {
    return "empty";
  }
}

async function updateProjectStatus(projectId, platform, status) {
  let subProjectPath = projectId;
  let statusJsonPath = `${reactProjectPath}/status.json`;
  let projectTemplatePath = `${reactProjectPath}/${subProjectPath}/template`;
  let templatePath = `${projectTemplatePath}/status.hbs`;

  const data = {
    status: status,
    modified_at: new Date().toISOString(), // Changed to "modified_at"
  };

  let templateContent = fs.readFileSync(templatePath, "utf8");
  let template = handlebars.compile(templateContent);
  let result = template(data);

  try {
    fs.writeFileSync(statusJsonPath, result, "utf8");
  } catch (err) {
    console.error("Error writing file:", err);
    throw err;
  }
}

module.exports = {
  getProjectStatus,
  updateProjectStatus,
};
