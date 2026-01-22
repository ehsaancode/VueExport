const commonPath = require("../utility/common_path");
const readWriteFile = require("../utility/read_write_file");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const commonUtils = require("../utility/common_utils");
const projectStatus = require("../utility/update_project_status");

const reactProjectPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectPath.get(commonPath.environmentHosting)}`
);

async function fetchThemeJson(project_Id = 0, filePath = "") {
  filePath = filePath + `/theme.json`;
  const apiUrl = `${commonPath.BaseUrl.get(
    commonPath.environment
  )}redoqcms/breakpoint/theme-list`;
  // const apiUrl = `https://darshita.kuickstudio.dinetestapi.com/api/redoqcms/breakpoint/theme-list`;
  const headers = {
    "Content-Type": "application/json",
  };
  const requestBody = {
    inputData: {
      cms_project_Id: project_Id,
    },
  };

  try {
    const response = await axios.post(apiUrl, requestBody, { headers });
    await readWriteFile.deleteFile(filePath);
    await readWriteFile.writeToFile(
      filePath,
      JSON.stringify(response.data, null, 2)
    );
    await createThemeCssFile(filePath, project_Id);
    await projectStatus.updateProjectStatus(
      project_Id,
      commonUtils.platform,
      "processing"
    );
    return "success";
  } catch (error) {
    console.error("API Error in fetchPageJson:", error);
    return "failure";
  }
}

async function createThemeCssFile(jsonFilePath, projectId = 0) {
  const subProjectPath = projectId;
  const cssFilePath = path.join(
    reactProjectPath,
    subProjectPath,
    "react_project",
    "src",
    "theme",
    "theme.css"
  );

  try {
    // Validate reactProjectPath
    if (!reactProjectPath || typeof reactProjectPath !== "string") {
      throw new Error("reactProjectPath is undefined or invalid");
    }

    // Load JSON data
    await delete require.cache[require.resolve(jsonFilePath)];
    const objects = await require(jsonFilePath);
    // const rawData = objects?.data;

    if (!objects) {
      throw new Error("Invalid JSON structure: Missing data property");
    }

    // Process breakpoints
    const breakpointObjects = objects.cms_project_theme_breakpoint ?? [];
    const breakpoints = breakpointObjects.map((obj) => {
      // Fix duplicate unit by ensuring only one unit is applied
      const value = obj.cms_project_theme_breakpoint_Value.endsWith(
        obj.cms_project_theme_breakpoint_Unit
      )
        ? obj.cms_project_theme_breakpoint_Value
        : `${obj.cms_project_theme_breakpoint_Value}${obj.cms_project_theme_breakpoint_Unit}`;
      return {
        breakpointVariable: `breakpoint-${obj.cms_project_theme_breakpoint_Title}`,
        breakpointValue: value,
      };
    });

    const lightColors = [];
    const darkColors = [];
    // Process theme categories (Typography and My Folder)
    const themeCategorys = objects.theme.map((theme) => {
      const themeTitle = commonUtils.removeSpacesAndspecialChars(
        theme?.cms_project_theme_variable_Title
      );

      const themes = [];

      theme.variables.size.map((size) => {
        const themeVariableTitle = commonUtils.removeSpacesAndspecialChars(
          size?.cms_project_theme_variable_Title
        );
        // console.log('themeVariableTitle1', themeVariableTitle)
        size.values.map((value) => {
          const breakpointId = value.cms_project_theme_breakpoint_Id ?? 0;
          // console.log("breakpointId", breakpointId);
          // console.log("breakpointObjects", JSON.stringify(breakpointObjects));
          const breakpoint =
            breakpointObjects.find(
              (v) => v.cms_project_theme_breakpoint_Id === breakpointId
            ) ?? {};
          const breakpointTitle =
            breakpoint.cms_project_theme_breakpoint_Title ?? "";
          const themeVariableValue =
            value.cms_project_theme_variable_Value ?? "";
          const themeVariableUnit = value.cms_project_theme_variable_Unit ?? "";
          themes.push({
            // themeVariable: `${themeTitle}-${breakpointTitle}-size-${themeVariableTitle}`,
            themeVariable: `${themeVariableTitle}-${breakpointTitle}`,
            themeValue: `${themeVariableValue}${themeVariableUnit}`,
          });
        });
      });

      theme.variables.fontfamily.map((fontfamily) => {
        const themeVariableTitle = commonUtils.removeSpacesAndspecialChars(
          fontfamily?.cms_project_theme_variable_Title
        );
        // console.log('themeVariableTitle', themeVariableTitle)
        fontfamily.values.map((value) => {
          const breakpointId = value.cms_project_theme_breakpoint_Id ?? 0;
          const breakpoint =
            breakpointObjects.find(
              (v) => v.cms_project_theme_breakpoint_Id === breakpointId
            ) ?? {};
          const breakpointTitle =
            breakpoint.cms_project_theme_breakpoint_Title ?? "";
          const themeVariableValue =
            value.cms_project_theme_variable_Value ?? "";
          const themeVariableUnit = value.cms_project_theme_variable_Unit ?? "";
          themes.push({
            themeVariable: `${themeVariableTitle}-${breakpointTitle}`,
            themeValue: `${themeVariableValue}${themeVariableUnit}`,
          });
        });
      });

      theme.variables.color.map((colorObj) => {
        const colorVariable = commonUtils.removeSpacesAndspecialChars(
          colorObj?.cms_project_theme_variable_Title
        );

        // console.log("colorVariable1", colorVariable);

        colorObj.values.map((value) => {
          const variableTitle = commonUtils.removeSpacesAndspecialChars(
            value?.cms_project_theme_variable_Title
          );
          // console.log("variableTitle1", variableTitle);
          const themeVariableValue =
            value.cms_project_theme_variable_Value ?? "";
          if (variableTitle.toLowerCase().includes("light")) {
            lightColors.push({
              // themeVariable: `${themeTitle}-${breakpointTitle}-size-${themeVariableTitle}`,
              colorVariable: `${colorVariable}`,
              lightColorValue: `${themeVariableValue}`,
            });
          } else {
            darkColors.push({
              // themeVariable: `${themeTitle}-${breakpointTitle}-size-${themeVariableTitle}`,
              colorVariable: `${colorVariable}`,
              darkColorValue: `${themeVariableValue}`,
            });
          }
        });
      });

      return {
        themeCategoryCommand: `/* ${commonUtils.removeSpacesAndspecialChars(
          theme?.cms_project_theme_variable_Title
        )} variables */`,
        themes,
      };
    });

    // Prepare data for Handlebars
    const data = {
      breakpointsCommand:
        breakpointObjects.length > 0
          ? "/* Breakpoints for responsive design */"
          : "",
      breakpoints,
      themeCategorys,
      lightColors,
      darkColors,
    };

    // Read the Handlebars template
    const projectTemplatePath = path.join(
      reactProjectPath,
      subProjectPath,
      "template"
    );
    const templatePath = path.join(projectTemplatePath, "theme.hbs");

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }

    const templateString = fs.readFileSync(templatePath, "utf8");

    // Compile and render the template
    const template = handlebars.compile(templateString);
    const output = template(data);

    // Ensure the output directory exists
    const routeDir = path.dirname(cssFilePath);
    if (!fs.existsSync(routeDir)) {
      try {
        fs.mkdirSync(routeDir, { recursive: true });
      } catch (mkdirError) {
        throw new Error(
          `Failed to create directory ${routeDir}: ${mkdirError.message}`
        );
      }
    } else {
    }

    // Verify write permissions
    try {
      fs.accessSync(routeDir, fs.constants.W_OK);
    } catch (accessError) {
      throw new Error(
        `No write permissions for ${routeDir}: ${accessError.message}`
      );
    }

    // Write the rendered output to theme.css
    try {
      fs.writeFileSync(cssFilePath, output, "utf8");
    } catch (writeError) {
      throw new Error(
        `Failed to write theme.css to ${cssFilePath}: ${writeError.message}`
      );
    }
  } catch (error) {
    console.error("Error in createThemeCssFile:", error.message);
    throw error;
  }
}

module.exports = {
  fetchThemeJson,
};
