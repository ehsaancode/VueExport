const commonUtils = require('../../utility/common_utils');
const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./android_create_page_design');
const commonUtilsAndroid = require('./utils');

async function parserMap(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parentType) {
    let frame = await commonUtilsAndroid.componentFrame(jsonObjects, {}, parentWidth, parentHeight, true, true);
    let paddingProps = await commonUtilsAndroid.extractPadding(jsonObjects, {});
    let marginProps = await commonUtilsAndroid.extractMargin(jsonObjects, {});

    await readWriteFile.writeToFile(fileName,
        ' '.repeat(startingColum) + 'QMap( \n' +
        ' '.repeat(startingColum + 2) + `${frame} \n` +
        // Padding
        Object.entries(paddingProps).map(([key, value]) =>
            ' '.repeat(this.startingColum + 2) + `${key} = ${value}, \n`
        ).join("") +
        // Margin
        Object.entries(marginProps).map(([key, value]) =>
            ' '.repeat(this.startingColum + 2) + `${key} = ${value}, \n`
        ).join("") +
        ' '.repeat(startingColum + 2) + `isSelected = ${jsonObjects?.['isSelected']}` +
        ' '.repeat(startingColum + 2) + `isHover = ${jsonObjects?.['isHover']}` +
        ' '.repeat(startingColum + 2) + `isDraggable = ${jsonObjects?.['isDraggable']}` +
        ' '.repeat(startingColum + 2) + `insertTop = ${jsonObjects?.['insertTop']}` +
        ' '.repeat(startingColum + 2) + `boundaryEnabled = ${jsonObjects?.['boundaryEnabled']}` +
        ' '.repeat(startingColum + 2) + `isPolygonEnable = ${jsonObjects?.['isPolygonEnable']}` +
        ' '.repeat(startingColum + 2) + `isHeatmapEnable = ${jsonObjects?.['isHeatmapEnable']}` +
        ' '.repeat(startingColum + 2) + `mapZoomSize = ${jsonObjects?.['mapZoomSize']}` +
        ' '.repeat(startingColum + 2) + `mapType = ${jsonObjects?.['mapType']}` +
        ' '.repeat(startingColum + 2) + `overflow = ${jsonObjects?.['overflow']}` +
        ' '.repeat(startingColum + 2) + `markers = ${await commonUtilsAndroid.formatText(jsonObjects?.['markers'])}.fromJsonToList()` +
        ' '.repeat(startingColum + 2) + `centerMarkers = ${await commonUtilsAndroid.formatText(jsonObjects?.['centerMarkers'])}.fromJsonToList()` +
        ' '.repeat(startingColum) + ')\n'
    )

}

module.exports = {
    parserMap
}