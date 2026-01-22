const readWriteFile = require("../../utility/read_write_file");
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

async function createAndUpdateNavController() {
  let pageName = `./created_files/Android/MainNavHost.kt`;

  await readWriteFile.writeToFile(
    pageName,
    "package com.redoq.appbuilder.ui.screen.bottom \n\n" +
      "import com.redoq.appbuilder.ui.screen.bottom.*\n" +
      "import com.redoq.appbuilder.ui.screen.*\n" +
      "import androidx.navigation.compose.*\n" +
      "import androidx.compose.runtime.*\n\n\n" +
      "@Composable \n" +
      `fun MainNavHost(){\n` +
      " ".repeat(2) +
      `val navController = rememberNavController()\n\n` +
      " ".repeat(2) +
      `NavHost(navController = navController, startDestination = "home") {\n\n`
  );

  let navDestinations = "";
  for (const index in destinations) {
    var jsonObj = destinations[index];
    navDestinations =
      navDestinations + " ".repeat(4) + `composable(${jsonObj["slug"]}) {\n`;
    navDestinations =
      navDestinations + " ".repeat(6) + `${jsonObj["screen"]}(navController)\n`;
    navDestinations = navDestinations + " ".repeat(4) + `}\n`;
  }

  await readWriteFile.writeToFile(
    pageName,
    navDestinations + " ".repeat(2) + `}\n` + `}\n`
  );
}

module.exports = {
  addDestinations,
  createAndUpdateNavController,
  destinations,
};
