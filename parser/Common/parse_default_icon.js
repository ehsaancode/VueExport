var object;

async function parseDefaultIcon(jsonObject) {
  object = jsonObject;
}

async function getDefaultValue(key) {
  return object[key];
}

async function getDefaultObject() {
  return object;
}

module.exports = {
  parseDefaultIcon,
  getDefaultValue,
  getDefaultObject,
};
