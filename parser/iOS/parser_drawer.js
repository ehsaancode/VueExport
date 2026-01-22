const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./create_page_design');
const commonUtilsIos = require('./common_utilits_ios');

let drawerJsonObj = "";

async function parseDrawer(jsonObject) {
     let pageName = './created_files/iOS/DrawerView.swift'; // + jsonObject['webdesign_Attrs']['wstyle']['page-name'] + '.swift';
     await readWriteFile.deleteFile(pageName);
     
     await readWriteFile.writeToFile(pageName, "import SwiftUI \n\n" +
          "struct " + "DrawerView" + ": View { \n" +
          ' '.repeat(1) + "@State private var isDrawerOpen = false \n" +
          ' '.repeat(1) + "@State private var selectedView: String = \"Home\" \n\n" +
          ' '.repeat(1) + "var body: some View { \n" +
          ' '.repeat(2) + "ZStack { \n" +
          ' '.repeat(3) + "NavigationStack { \n" +
          ' '.repeat(4) + "VStack(spacing: 0) {\n" +
          ' '.repeat(5) + "selectedViewFor(selectedView)\n" +
          ' '.repeat(5) + ".frame(maxWidth: .infinity, maxHeight: .infinity)\n" +
          ' '.repeat(5) + ".background(Color(.systemBackground))\n" +
          ' '.repeat(4) + "}\n" +
          ' '.repeat(3) + "}\n\n" +
          ' '.repeat(3) + "if isDrawerOpen {\n" +
          ' '.repeat(4) + "DrawerMenu(isDrawerOpen: $isDrawerOpen, selectedView: $selectedView)\n" +
          ' '.repeat(3) + "}\n" +
          ' '.repeat(2) + "}\n" +
          ' '.repeat(1) + "}\n\n" +
          ' '.repeat(1) + "@ViewBuilder\n" +
          ' '.repeat(1) + "private func selectedViewFor(_ view: String) -> some View {\n" +
          ' '.repeat(2) + "switch view {\n" +
          ' '.repeat(2) + "case \"Home\":\n" +
          ' '.repeat(3) + "Home(isDrawerOpen: $isDrawerOpen)\n" +
          ' '.repeat(2) + "default:\n" +
          ' '.repeat(3) + "Home(isDrawerOpen: $isDrawerOpen)\n" +
          ' '.repeat(2) + "}\n" +
          ' '.repeat(1) + "}\n" +
          "}\n\n"
     ).then(async content => {
          if (content == 'success') {
               await parseDrawerView(1, pageName, jsonObject)
          }
     });
}

async function parseDrawerView(startingColum, fileName, jsonObjects) {
     try {
          let mainCanvasJsonFile = '../.././created_files/common_private/main_canvas.json';
          const mainCanvasObject = require(mainCanvasJsonFile);
          let parantWidth = mainCanvasObject["screenWidth"];
          let parantHeight = mainCanvasObject["screenHeight"];
          let mainAlignment = jsonObjects["mainAlignment"];
          let crossAlignment = jsonObjects["crossAlignment"];
          await readWriteFile.writeToFile(fileName, "\n" +
               "struct DrawerMenu: View { \n" +
               ' '.repeat(1) + "@Binding var isDrawerOpen: Bool \n" +
               ' '.repeat(1) + "@Binding var selectedView: String \n\n" +
               ' '.repeat(1) + "var body: some View { \n" +
               ' '.repeat(2) + "GeometryReader { geometry in \n" +
               ' '.repeat(3) + "HStack (alignment: .center) { \n"
          );
          // await drawerJson(jsonObjects);
          for (const index in jsonObjects["dChildren"]) {
               var jsonObj = jsonObjects["dChildren"][index];
               await createPageDesign.pageDesign(startingColum, fileName, jsonObj, parantWidth, parantHeight, mainAlignment, crossAlignment, "QDrawer");
          }
          
          await readWriteFile.writeToFile(fileName, "\n" +     
          ' '.repeat(3) + "Spacer() \n" +
          ' '.repeat(3) + "} \n" +
          ' '.repeat(3) + ".frame(width: geometry.size.width) \n" +
          ' '.repeat(3) + ".background( \n" +
          ' '.repeat(4) + "Color.gray.opacity(0.2) \n" +
          ' '.repeat(5) + ".onTapGesture { \n" +
          ' '.repeat(6) + "withAnimation { \n" +
          ' '.repeat(7) + "isDrawerOpen = false \n" +
          ' '.repeat(6) + "} \n" +
          ' '.repeat(5) + "} \n" +
          ' '.repeat(4) + ") \n" +
          ' '.repeat(3) + "} \n" +
          ' '.repeat(3) + ".edgesIgnoringSafeArea(.all) \n" +
          ' '.repeat(2) + "} \n\n" +
          ' '.repeat(2) + "private func navigate(to view: String) { \n" +
          ' '.repeat(3) + "withAnimation { \n" +
          ' '.repeat(4) + "selectedView = view \n" +
          ' '.repeat(4) + "isDrawerOpen = false \n" +
          ' '.repeat(3) + "} \n" +
          ' '.repeat(2) + "} \n" +
          ' '.repeat(1) + "} \n"
     );
     } catch (err) {
          console.error(err);
     }
}

async function parseDrawerMenu(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType) {
     let frame = await commonUtilsIos.componentFrame(jsonObjects, "", parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, true, true);
     let padding = await commonUtilsIos.componentPadding(jsonObjects, "");
     let margin = await commonUtilsIos.componentMargin(jsonObjects, "");
     let shadow = await commonUtilsIos.componentShadow(jsonObjects);
     let cornerRadius = await commonUtilsIos.componentCornerRadius(jsonObjects);
     await readWriteFile.writeToFile(fileName, 
          ' '.repeat(startingColum) + "VStack { \n");     
     await readWriteFile.writeToFile(fileName, 
          ' '.repeat(startingColum + 2) + `Button(action: {\n` +
          ' '.repeat(startingColum + 3) + `withAnimation {\n` +
          ' '.repeat(startingColum + 4) + `isDrawerOpen.toggle()\n` +
          ' '.repeat(startingColum + 3) + `}\n` +
          ' '.repeat(startingColum + 2) + `}) {\n` + 
          ' '.repeat(startingColum + 3) + `Image(systemName: "line.horizontal.3")\n` +
          ' '.repeat(startingColum + 4) + `.imageScale(.large)\n` +
          ' '.repeat(startingColum + 4) + `.foregroundColor(.primary)\n` +
          ' '.repeat(startingColum + 3) + `}\n` +
          ' '.repeat(startingColum) + "} \n"
     );

     if (parantType === "QStack") {
          let positioned = await commonUtilsIos.componentStackPositioned(jsonObjects, startingColum);
          await readWriteFile.writeToFile(fileName,
               ' '.repeat(startingColum) + `${positioned}\n`
          );
     } else {
          await readWriteFile.writeToFile(fileName,
               ' '.repeat(startingColum) + `.padding(.leading, ${!isNaN(parseFloat(padding.paddingLeft)) ? padding.paddingLeft : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.trailing, ${!isNaN(parseFloat(padding.paddingRight)) ? padding.paddingRight : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.top, ${!isNaN(parseFloat(padding.paddingTop)) ? padding.paddingTop : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.bottom, ${!isNaN(parseFloat(padding.paddingBottom)) ? padding.paddingBottom : 0.0})\n` +
               ' '.repeat(startingColum) + `.frame(${frame})\n` +
               ' '.repeat(startingColum) + `${cornerRadius}` +
               ' '.repeat(startingColum) + `.padding(.leading, ${!isNaN(parseFloat(margin.marginLeft)) ? margin.marginLeft : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.trailing, ${!isNaN(parseFloat(margin.marginRight)) ? margin.marginRight : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.top, ${!isNaN(parseFloat(margin.marginTop)) ? margin.marginTop : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.bottom, ${!isNaN(parseFloat(margin.marginBottom)) ? margin.marginBottom : 0.0})\n` +
               ' '.repeat(startingColum) + `${shadow}`
          );
     }

     await parseDrawer(jsonObjects);
}

module.exports = {
     parseDrawer,
     parseDrawerMenu
}
