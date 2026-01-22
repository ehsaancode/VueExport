const commonUtils = require('../../utility/common_utils');
const parseDefaultDesign = require('./parse_default_design');

// var textTypeList = [];

async function parsePageContent(filePath) {
   try {
        const jsonObject = require(filePath);
        // console.log('******* {}', filePath);
        // const templatesNewObject = jsonObject["templatesNew"];
        const jsonObjects = jsonObject["templates"];
        await parseDefaultObjects(jsonObjects);

        // const topKeys = Object.keys(templatesNewObject);
        // console.log('Top-level keys:', topKeys);

        // Call the async function to process top keys
        // await parseTopKeys(topKeys, templatesNewObject);
    } catch (error) {
        //console.error(Error processing file: ${error.message});
    }
}

async function parseDefaultObjects(jsonObjects) {
    try {
        for (const index in jsonObjects) {
            var jsonObj = jsonObjects[index];
            await parseDefaultDesign.defaultDesign(jsonObj); // Await the async function
            // console.log(`Object type: ${jsonObj["webdesign_Default_Attrs"]["type"]}`);
        }
    } catch (err) {
        console.error(err);
        return 'failure';
   }
}

async function parseTopKeys(topKeys, templatesNewObject) {
    try {
        for (const key of topKeys) {
            //console.log(`Key: ${key} || ${templatesNewObject[key]}`);
            // Iterate using for...of to use await properly
            // console.log(`Key: ${key}`);
            var jsonObjects = templatesNewObject[key];
            for (const index in jsonObjects) {
                var jsonObj = jsonObjects[index];
                await parseDefaultDesign.defaultDesign(jsonObj); // Await the async function
                // console.log(`Object type: ${jsonObj["webdesign_Default_Attrs"]["type"]}`);
            }
        }
    } catch (err) {
        console.error(err);
        return 'failure';
   }
}

// async function createTextTypeList(topKeys, templatesNewObject) {
//     for (const key of topKeys) {
//         for (const element of templatesNewObject[key]) {
//             // console.log('Element type:', element['webdesign_Default_Attrs']['type']);
//             if (element['webdesign_Default_Attrs']['type'] == 'QText') {
//                 textTypeList.push(element['webdesign_Default_Attrs']);
//             }else if (element['webdesign_Default_Attrs']['type'] == 'QParagraph') {
//                 textTypeList.push(element['webdesign_Default_Attrs']);
//             }else if (element['webdesign_Default_Attrs']['type'] == 'QTextH1') {
//                 textTypeList.push(element['webdesign_Default_Attrs']);
//             }else if (element['webdesign_Default_Attrs']['type'] == 'QTextH1') {
//                 textTypeList.push(element['webdesign_Default_Attrs']);
//             }else if (element['webdesign_Default_Attrs']['type'] == 'QTextH2') {
//                 textTypeList.push(element['webdesign_Default_Attrs']);
//             }else if (element['webdesign_Default_Attrs']['type'] == 'QTextH3') {
//                 textTypeList.push(element['webdesign_Default_Attrs']);
//             }else if (element['webdesign_Default_Attrs']['type'] == 'QTextH4') {
//                 textTypeList.push(element['webdesign_Default_Attrs']);
//             }else if (element['webdesign_Default_Attrs']['type'] == 'QTextH5') {
//                 textTypeList.push(element['webdesign_Default_Attrs']);
//             }
//         }
//     }
//      console.log('Text Type List:', textTypeList);
// }

module.exports = {
    parsePageContent
};