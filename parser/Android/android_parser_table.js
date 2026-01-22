const commonDefault = require('../Common/parse_default_div');
const commonUtils = require('../../utility/common_utils');
const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./android_create_page_design');
const commonUtilsAndroid = require('./utils');
const defaultTableContent = require('../Common/parse_default_table');
const defaultTableSearch = require('../Common/parse_default_table_search');
const defaultTableWrapper = require('../Common/parse_default_table_wrapper');
const defaultInputSearch = require('../Common/parse_default_input_search');

class AndroidParserTable {
    constructor(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parentType) {
        this.startingColum = startingColum;
        this.fileName = fileName;
        this.jsonObjects = jsonObjects;
        this.parentWidth = parentWidth;
        this.parentHeight = parentHeight;
        this.parentType = parentType;
        this.headers = [];
        this.rows = [];
        this.url = "";
        this.body = "";
        this.method = "";
        this.header = ""
    }

    async parseTable() {
        await this.parseHeader();
        await this.parserRow();
        //console.log(`json data - ${JSON.stringify(this.jsonObjects["table_payload_settings"])} \n${JSON.stringify(this.jsonObjects["api_data"])}`);

        const mainAlignment = (() => {
            switch (this.jsonObjects['mainAlignment']) {
                case 'align_left':
                    return 'Arrangement.Top';
                case 'align_center':
                    return 'Arrangement.Center';
                case 'align_right':
                    return 'Arrangement.Bottom';
                default:
                    return 'Arrangement.Top'; // Default value if no match
            }
        })();

        const crossAlignment = (() => {
            switch (this.jsonObjects['crossAlignment']) {
                case 'align_left':
                    return 'Alignment.Start';
                case 'align_center':
                    return 'Alignment.CenterHorizontally';
                case 'align_right':
                    return 'Alignment.End';
                default:
                    return 'Alignment.Start'; // Default value if no match
            }
        })();

        // let getDefaultObject = await commonDefault.getDefaultObject(this.jsonObjects['type']);
        //let frame = await commonUtilsAndroid.componentFrame(this.jsonObjects, getDefaultObject, this.parentWidth, this.parentHeight, false, true);

        // let paddingProps = await commonUtilsAndroid.extractPadding(this.jsonObjects, getDefaultObject);
        // let marginProps = await commonUtilsAndroid.extractMargin(this.jsonObjects, getDefaultObject);
        // let shadowProps = await commonUtilsAndroid.extractShadow(this.jsonObjects, getDefaultObject);

        // Extract border properties
        //let borderProperties = await commonUtilsAndroid.extractBorderProperties(this.jsonObjects);

        if (this.parentType == "QStack") {
            await readWriteFile.writeToFile(this.fileName,
                ' '.repeat(this.startingColum) + `Box(\n` +
                ' '.repeat(this.startingColum + 1) + `modifier = Modifier.fillMaxSize()\n` +
                ' '.repeat(this.startingColum + 1) + `.padding(start = ${parseFloat(this.jsonObjects['positionedLeft'] ?? 0)}.dp, end = ${parseFloat(this.jsonObjects['positionedRight'] ?? 0)}.dp, top = ${parseFloat(this.jsonObjects['positionedTop'] ?? 0)}.dp, bottom = ${parseFloat(this.jsonObjects['positionedBottom'] ?? 0)}.dp)\n` +
                ' '.repeat(this.startingColum + 1) + `) { \n`
            );
        }

        const columnJson = JSON.stringify(this.headers);
        let formattedColumnJson = await commonUtilsAndroid.formatText(columnJson);

        const rowJson = JSON.stringify(this.rows);
        let formattedRowJson = await commonUtilsAndroid.formatText(rowJson);

        const isApiExists = this.url != ""
        let apiSection = "";
        if (isApiExists) {
            apiSection =
                ' '.repeat(this.startingColum + 4) + `url= ${this.url},\n` +
                ' '.repeat(this.startingColum + 4) + `body= ${this.body},\n` +
                ' '.repeat(this.startingColum + 4) + `method= ${this.method},\n`;
        } else {
            apiSection = ' '.repeat(this.startingColum + 4) + `data= ${formattedRowJson}.toTableRowsFromJson()\n`;
        }

        await readWriteFile.writeToFile(this.fileName,
            ' '.repeat(this.startingColum) + `Box {\n` +
            ' '.repeat(this.startingColum + 2) + `TableView(\n` +
            ' '.repeat(this.startingColum + 4) + `headers= ${formattedColumnJson}.parseAsTableHeaders(),\n` +
            apiSection +
            ' '.repeat(this.startingColum + 2) + `)\n` +
            ' '.repeat(this.startingColum) + `}\n`
        )
    }

    async parseHeader() {

        const columnsJson = this.jsonObjects["table_payload_settings"] || []; // Each item is a column
        // Step 1: Generate headers
        for (let i = 0; i < columnsJson["columns"].length; i++) {
            const columnsMeta = columnsJson["columns"][i];

            var width;
            if (columnsMeta?.widthValue != null && columnsMeta?.widthValue != '') {
                width = columnsMeta?.widthValue;
            } else {
                width = columnsJson?.widthValue;
            }

            const columnStyle = columnsMeta.columnStyle || {};
            //console.log(`fontSize: ${columnStyle.fontSize} \n fontWeight:${columnStyle.fontWeight} \n color:${columnStyle.color} \n fontFamily:${columnStyle.fontFamily}`)

            this.headers.push({
                id: columnsMeta.id ?? "",
                index: columnsMeta.index ?? 0,
                headerWidth: width,
                headerTitle: columnsMeta.columnLabel ?? "",
                accessor: columnsMeta.columnKey ?? "",
                backgroundColor: columnsMeta.backgroundColor ?? "",
                headerTextAlign: columnsMeta.textAlign ?? "align_start",
                headerFontSize: columnStyle.fontSize ?? "14px",
                headerFontWeight: `FontWeight.W${columnStyle.fontWeight ?? 400}`,
                headerColor: columnStyle.color ?? "#FF000000",
                headerFontFamily: columnStyle.fontFamily ?? "Arial",
                sort: columnsMeta.sortable ? "Yes" : "No",
                search: columnsMeta.searchable ? "Yes" : "No",
                filter: columnsMeta.filterable ? "Yes" : "No",
                value: "",
                isHidden: columnsMeta.isHidden ? "Yes" : "No",
                option: await this.columnMetaOption(columnsMeta.children),
            });
        }
    }

    async columnMetaOption(columnsMeta) {
        let option = {};
        for (let i = 0; i < columnsMeta.length; i++) {
            let frame = await commonUtilsAndroid.componentFrame(this.jsonObjects, {}, this.parentWidth, this.parentHeight, true, true);
            let metaObj = columnsMeta[i];
            if (metaObj.text == "filter") {
                option["filterIcon"] = metaObj.iconLink ?? "";
                option["filterHeight"] = metaObj.height ?? "0";
                option["filterWidth"] = metaObj.width ?? "0"
                // option["height"] = frame;
            } else if (metaObj.text == "sort") {
                option["sortIcon"] = metaObj.iconLink ?? "";
                option["sortHeight"] = metaObj.height ?? "0";
                option["sortWidth"] = metaObj.width ?? "0"
            } else {
                option["searchWidth"] = (metaObj.width != null && metaObj.width !== "null") ? metaObj.width : "0";//metaObj?.width ?? "0";
                option["searchHeight"] = metaObj?.height ?? "0";
                option["searchBorderBLR"] = metaObj.borderBLR ?? "0";
                option["searchBorderBRR"] = metaObj.borderBRR ?? "0";
                option["searchBorderTLR"] = metaObj.borderTLR ?? "0";
                option["searchBorderTRR"] = metaObj.borderTRR ?? "0";
                option["searchBorderBW"] = metaObj.borderBW ?? "0px";
                option["searchBorderLW"] = metaObj.borderLW ?? "0px";
                option["searchBorderRW"] = metaObj.borderRW ?? "0px";
                option["searchBorderTW"] = metaObj.borderTW ?? "0px";
                option["searchBorderLC"] = metaObj.borderLC ?? "#FF000000";
                option["searchBorderRC"] = metaObj.borderRC ?? "#FF000000";
                option["searchBorderTC"] = metaObj.borderTC ?? "#FF000000";
                option["searchBorderBC"] = metaObj.borderBC ?? "#FF000000";
                option["searchBorderLS"] = metaObj.borderLS ?? "";
                option["searchBorderRS"] = metaObj.borderRS ?? "";
                option["searchBorderTS"] = metaObj.borderTS ?? "";
                option["searchBorderBS"] = metaObj.borderBS ?? "";
                option["searchBgColor"] = metaObj.bgColor ?? "#FFFFFFFF";
                option["searchFontFamily"] = metaObj.fontFamily ?? "Arial";
                option["searchFontSize"] = metaObj.fontSize ?? "12px";
                option["searchFontStyle"] = metaObj.fontStyle ?? "";
                option["searchFontWeight"] = `FontWeight.W${metaObj?.fontWeight ?? 400}`;
                option["searchPaddingLeft"] = metaObj?.paddingLeft ?? "0px";
                option["searchPaddingRight"] = metaObj?.paddingRight ?? "0px";
                option["searchPaddingTop"] = metaObj?.paddingTop ?? "0px";
                option["searchPaddingBottom"] = metaObj?.paddingBottom ?? "0px";
            }
        }

        return option;
    }

    async parserRow() {
        const columnObject = this.jsonObjects["api_data"] || {};
        const isApiExists = !!columnObject?.url;
        const url = columnObject?.url;
        const body = columnObject?.body;
        const header = columnObject?.header;
        const method = columnObject?.method;
        //console.log(`${JSON.stringify(this.jsonObjects["api_data"])} ||\n${isApiExists} ||\n${this.url}`);

        if (isApiExists) {
            this.url = await commonUtilsAndroid.formatText(url);
            this.body = await commonUtilsAndroid.formatText(body);
            this.header = await commonUtilsAndroid.formatText(header);
            this.method = await commonUtilsAndroid.formatText(method);
        } else {
            const tableRowsJson = this.jsonObjects["children"][1].children || [];
            const numRows = tableRowsJson?.length || 0;

            for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
                const row = {};

                for (
                    let colIndex = 0;
                    colIndex < tableRowsJson[rowIndex]["children"].length;
                    colIndex++
                ) {
                    //console.log(tableRowsJson[rowIndex]["children"][colIndex]?.columnValue)
                    row[tableRowsJson[rowIndex]["children"][colIndex]?.columnValue] =
                        tableRowsJson[rowIndex]["children"][colIndex]?.text || "";
                }

                this.rows.push(row);
            }
        }

        console.log(`${JSON.stringify(this.jsonObjects["api_data"])} ||\n${isApiExists} ||\n${this.url}`);

    }

    /*
    async parseHeaderAndRow() {
        const columnsJson = this.jsonObjects["children"] || []; // Each item is a column
        const columnsMeta = this.jsonObjects?.tablePayload?.tableSettings?.columns || [];
        // Step 1: Generate headers
        for (let i = 0; i < columnsJson.length; i++) {
            const label = columnsJson[i].text?.trim();
            if (label && columnsMeta[i]) {
                this.headers.push({
                    id: columnsJson[i].id ?? "",
                    headerTitle: columnsMeta[i].columnLabel ?? "",
                    accessor: columnsMeta[i].columnKey ?? "",
                    sort: columnsMeta[i].sortable ? "Yes" : "No",
                    search: columnsMeta[i].searchable ? "Yes" : "No",
                    filter: columnsMeta[i].filterable ? "Yes" : "No",
                    value: "",
                    // show: columnsMeta[i].isHidden,
                    show: true,
                });
            }
        }

        // Step 2: Transpose columns to rows
        const numRows = columnsJson[0]?.children?.length || 0;
        for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
            const row = {};
            for (let colIndex = 0; colIndex < columnsJson.length; colIndex++) {
                const cell = columnsJson[colIndex]?.children?.[rowIndex];
                const accessor = columnsMeta[colIndex]?.columnKey;
                if (accessor) {
                    row[accessor] = cell?.text || "";
                }
            }
            this.rows.push(row);
        }
    }
*/

}

module.exports = {
    AndroidParserTable
}