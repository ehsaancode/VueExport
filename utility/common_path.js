//const environmentHosting = "server";
  // const environmentHosting = "local_pabitra";
const environmentHosting = "local_ehsaan";

//const environmentHosting = "local_biswajit"; // local or server

const reactProjectPath = new Map([
  ["server", "/home/ubuntu/output_project/reactjs"],
  [
    "local_biswajit",
    "/Users/sayan/Documents/redoq_projects/node_js/Export/output_project/reactjs",
  ],
  [
    "local_pabitra",
    "C:\\node\\output_project\\reactjs", // Fixed: Escaped backslashes
  ],
  ["local_ehsaan", "C:\\Users\\maile\\Documents\\kuikExport"],
  [
    "local_suman",
    "C:\\Users\\suman\\Dev-Project\\Live Project\\Node\\output_project\\reactjs", // Fixed: Escaped backslashes
  ],
]);

const reactProjectBuildPath = new Map([
  ["server", "/home/ubuntu/cmsexport_html_biswajit"],
  [
    "local_biswajit",
    "/Users/sayan/Documents/redoq_projects/node_js/Export/React/cmsexport_html_biswajit",
  ],
  [
    "local_pabitra",
    "C:\\node\\cmsexport_html_biswajit", // ✅ Escaped backslashes for Windows
  ],
  [
    "local_suman",
    "C:\\Users\\suman\\Dev-Project\\Live Project\\Node\\output_project\\cmsexport_html_biswajit", // ✅ Escaped backslashes for Windows
  ],
]);

const reactNativeProjectPath = new Map([
  ["server", "/home/ubuntu/output_project/react_native"],
  [
    "local_biswajit",
    "/Users/sayan/Documents/redoq_projects/node_js/Export/output_project/react_native",
  ],
  [
    "local_pabitra",
    "C:\\node\\output_project\\react_native", // Fixed: Escaped backslashes
  ],
  [
    "local_suman",
    "C:\\Users\\suman\\Dev-Project\\Live Project\\Node\\output_project\\react_native", // Fixed: Escaped backslashes
  ],
]);

const androidProjectPath = new Map([
  ["server", "/home/ubuntu/output_project/android"],
  [
    "local_biswajit",
    "/Users/sayan/Documents/redoq_projects/node_js/Export/output_project/android",
  ],
  [
    "local_pabitra",
    "C:\\node\\output_project\\android", // Fixed: Escaped backslashes
  ],
  [
    "local_suman",
    "C:\\Users\\suman\\Dev-Project\\Live Project\\Node\\output_project\\android", // Fixed: Escaped backslashes
  ],
]);

const iosProjectPath = new Map([
  ["server", "/home/ubuntu/output_project/ios"],
  [
    "local_biswajit",
    "/Users/sayan/Documents/redoq_projects/node_js/Export/output_project/ios",
  ],
  [
    "local_pabitra",
    "C:\\node\\output_project\\ios", // Fixed: Escaped backslashes
  ],
  [
    "local_suman",
    "C:\\Users\\suman\\Dev-Project\\Live Project\\Node\\output_project\\ios", // Fixed: Escaped backslashes
  ],
]);

// const environment = "STG";
const environment = "Showcase";
const BaseUrl = new Map([
  ["Production", "https://ksw.api.redoq.host/api/"],
  ["STG", "https://sankar.posservice.dinetestapi.com/api/"],
  ["Showcase", "https://showcase.kuickstudio.dinetestapi.com/api/"],
]);

const projectInfoUrl =
  "https://showcase.kuickstudio.dinetestapi.com/api/redoqcms/page-slug";

const wrl = new Map([
  ["Production", "web.kuickstudio.com"],
  ["STG", "dev.kuickstudio.com"],
]);

module.exports = {
  environmentHosting,
  reactProjectPath,
  reactProjectBuildPath,
  reactNativeProjectPath,
  androidProjectPath,
  iosProjectPath,
  environment,
  BaseUrl,
  projectInfoUrl,
  wrl,
};
