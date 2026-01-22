const commonUtils = require("./common_utils");

let actions = {};
let onLoadActions = {};
let formSubmitActions = {};
let actionObjects = {};

async function insertAction(tag, actionObj) {
  if (!tag || !actionObj || actionObj === undefined) {
    return false; // Return false if tag or actionObj is invalid
  }

  // Initialize array for the tag if it doesn't exist
  if (!actions[tag]) {
    actions[tag] = [];
  }

  // Insert the action object into the tag's array
  actions[tag].push(actionObj);
  return true; // Return true to indicate success
}

// Function to clear all objects for a specific tag
async function clearActionsForTag(tag) {
  if (!tag) {
    return false; // Return false if tag is invalid
  }
  if (actions[tag]) {
    delete actions[tag]; // Remove the tag and its array
    // Alternatively, you could use: actions[tag] = [];
    return true; // Return true to indicate success
  }
  return false; // Return false if tag doesn't exist
}

// Function to get the array for a specific tag
async function getActionsArray(tag) {
  if (!tag || !actions[tag]) {
    return []; // Return empty array if tag doesn't exist
  }
  return [...actions[tag]]; // Return a copy of the array
}

async function insertOnLoadAction(tag, actionObj) {
  if (!tag || !actionObj || actionObj === undefined) {
    return false; // Return false if tag or actionObj is invalid
  }

  // Initialize array for the tag if it doesn't exist
  if (!onLoadActions[tag]) {
    onLoadActions[tag] = [];
  }

  // Insert the action object into the tag's array
  onLoadActions[tag].push(actionObj);
  return true; // Return true to indicate success
}

async function insertFormSubmitAction(tag, actionObj) {
  if (!tag || !actionObj || actionObj === undefined) {
    return false; // Return false if tag or actionObj is invalid
  }

  // Initialize array for the tag if it doesn't exist
  if (!formSubmitActions[tag]) {
    formSubmitActions[tag] = [];
  }

  // Insert the action object into the tag's array
  formSubmitActions[tag].push(actionObj);
  return true; // Return true to indicate success
}

// Function to clear all objects for a specific tag
async function clearOnLoadActionsForTag(tag) {
  if (!tag) {
    return false; // Return false if tag is invalid
  }
  if (onLoadActions[tag]) {
    delete onLoadActions[tag]; // Remove the tag and its array
    // Alternatively, you could use: actions[tag] = [];
    return true; // Return true to indicate success
  }
  return false; // Return false if tag doesn't exist
}

async function clearFormSubmitForTag(tag) {
  if (!tag) {
    return false; // Return false if tag is invalid
  }
  if (formSubmitActions[tag]) {
    delete formSubmitActions[tag]; // Remove the tag and its array
    // Alternatively, you could use: actions[tag] = [];
    return true; // Return true to indicate success
  }
  return false; // Return false if tag doesn't exist
}

// Function to get the array for a specific tag
async function getOnLoadActionsArray(tag) {
  if (!tag || !onLoadActions[tag]) {
    return []; // Return empty array if tag doesn't exist
  }
  return [...onLoadActions[tag]]; // Return a copy of the array
}

async function getFormSubmitActionsArray(tag) {
  if (!tag || !formSubmitActions[tag]) {
    return []; // Return empty array if tag doesn't exist
  }
  return [...formSubmitActions[tag]]; // Return a copy of the array
}

async function filterFlowsByTriggerAndWidget(data, trigger, widgetId) {
  if (!data || !data.data || !Array.isArray(data.data)) {
    return [];
  }

  return data.data.filter((flow) => {
    return flow.trigger === trigger && flow.widgetId === widgetId;
  });
}

// Alternative method that returns specific properties only
async function filterFlowsWithSpecificProperties(data, trigger, widgetId) {
  if (!data || !data.data || !Array.isArray(data.data)) {
    return [];
  }

  return data.data
    .filter((flow) => flow.trigger === trigger && flow.widgetId === widgetId)
    .map((flow) => ({
      flowId: flow.flowId,
      title: flow.title,
      trigger: flow.trigger,
      widgetId: flow.widgetId,
      pageId: flow.pageId,
      projectId: flow.projectId,
      flowNodes: flow.flowNodes,
      nodes: flow.nodes,
    }));
}

// Method that returns just the nodes array for matching flows
async function getNodesByTriggerAndWidget(data, trigger, widgetId, pageId = 0) {
  if (!data || !data.data || !Array.isArray(data.data)) {
    return [];
  }

 //  console.log(`widgetId: ${widgetId} pageId: ${pageId}_${commonUtils.windowDevice}` );
  if (widgetId && widgetId != 0) {
    const matchingFlows = data.data.filter(
      (flow) => flow.trigger === trigger && flow.widgetId == widgetId
    );
   //  console.log(`matchingFlows: ${JSON.stringify(matchingFlows)}`);
    return matchingFlows;
  } else {
   
    const matchingFlows = data.data.filter(
      (flow) =>
        flow.trigger === trigger &&
        flow.pageId == pageId &&
        (flow.widgetId == 'null' || flow.widgetId== 0)
    );
   // console.log(`matchingFlows: ${JSON.stringify(matchingFlows)}`);
    return matchingFlows;
  }

  /*return matchingFlows.map((flow) =>
    (flow.nodes || []).sort(
      (a, b) => parseInt(a.parentId) - parseInt(b.parentId)
    )
  );*/
}

async function flushAllData() {
  // Clear all actions
  actions = {};
  onLoadActions = {};
  formSubmitActions = {};
  actionObjects = {};

  return true; // Return true to indicate success
}

module.exports = {
  actions,
  onLoadActions,
  actionObjects,
  insertAction,
  clearActionsForTag,
  getActionsArray,
  insertOnLoadAction,
  insertFormSubmitAction,
  clearOnLoadActionsForTag,
  clearFormSubmitForTag,
  getOnLoadActionsArray,
  getFormSubmitActionsArray,
  filterFlowsByTriggerAndWidget,
  filterFlowsWithSpecificProperties,
  getNodesByTriggerAndWidget,
  flushAllData,
};
