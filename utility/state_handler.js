const routesController = require("../parser/React/react_parser_routes");
class StateHandler {
  // Static instance for Singleton
  static #instance = null; // Should be null, not {}

  // Private properties
  #states = {}; // Initialize as object
  #assignedStates = [];

  constructor(initialMap = {}) {
    if (StateHandler.#instance) {
      this._merge(initialMap);
      return StateHandler.#instance;
    }

    this.#states = {};
    this.#assignedStates = [];
    this._merge(initialMap);
    StateHandler.#instance = this;
  }

  // ------------------------------------------------------------
  // Helper: merge an object into #states (dedupes arrays)
  // ------------------------------------------------------------
  _merge(obj) {
    for (const [k, v] of Object.entries(obj)) {
      const arr = Array.isArray(v) ? v : [v];
      this.#states[k] = [...new Set([...(this.#states[k] || []), ...arr])];
    }
  }

  // ------------------------------------------------------------
  // FLUSH ALL DATA - Remove all states
  // ------------------------------------------------------------
  flushAll() {
    const hadData = Object.keys(this.#states).length > 0;
    this.#states = {};
    this.#assignedStates = [];
    return hadData; // Returns true if there was data, false if already empty
  }

  // ------------------------------------------------------------
  // SETTER – key & value are both strings
  // ------------------------------------------------------------
  set states({ key, value }) {
    if (typeof key !== "string" || key === "") {
      throw new Error("Key must be a non-empty string");
    }

    const current = this.#states[key] || [];
    // add the new string and dedupe (preserves first-occurrence order)
    this.#states[key] = [...new Set(...current, value)];
  }

  // ------------------------------------------------------------
  // GETTER – whole map (for debugging / inspection)
  // ------------------------------------------------------------
  get states() {
    // return a shallow copy so external code cannot mutate the internal map
    return { ...this.#states };
  }

  // ------------------------------------------------------------
  // Get array for a specific key (unique, copy)
  // ------------------------------------------------------------
  getFilesFor(key) {
    if (typeof key !== "string" || key === "") {
      throw new Error("Key must be a non-empty string");
    }
    const arr = this.#states[key];

    if (!arr) {
      return [];
    }

    // Remove duplicates based on 'name' property (keeping last occurrence)
    const uniqueMap = new Map();
    const currentTime = new Date().toISOString();

    arr.forEach((item) => {
      if (item && item.name) {
        uniqueMap.set(item.name, {
          ...item,
        });
      }
    });

    return Array.from(uniqueMap.values());
  }

  getStateByManagementId(key, managementStateId) {
    if (typeof key !== "string" || key === "") {
      throw new Error("Key must be a non-empty string");
    }

    if (typeof managementStateId !== "string" || managementStateId === "") {
      throw new Error("managementStateId must be a non-empty string");
    }

    const arr = StateHandler.getInstance().getFilesFor(key);

    if (arr.length > 0) {
      // Find the state object with matching managementStateId
      const state = arr.find(
        (item) => item && item.managementStateId == managementStateId
      );

      // Return with timestamp and ensure no duplicates by name in nested structures
      return {
        ...state,
      };
    } else {
      return null;
    }
  }

  getStateByField(key, field, fieldValue) {
    if (typeof key !== "string" || key === "") {
      throw new Error("Key must be a non-empty string");
    }

    const arr = StateHandler.getInstance().getFilesFor(key);

    if (arr.length > 0) {
      // Find the state object with matching managementStateId
      const state = arr.find((item) => item && item[field] == fieldValue);

      // Return with timestamp and ensure no duplicates by name in nested structures
      return {
        ...state,
      };
    } else {
      return null;
    }
  }

  getAppStateByField(field, fieldValue) {
    const appStates = routesController.states ?? [];
    // console.log("appStatesappStates", appStates);

    if (appStates.length > 0) {
      // Find the state object with matching managementStateId
      const state = appStates.find((item) => item && item[field] == fieldValue);

      // Return with timestamp and ensure no duplicates by name in nested structures
      return {
        ...state,
      };
    } else {
      return null;
    }
  }

  // ------------------------------------------------------------
  // Add assigned state object to #assignedStates array
  // ------------------------------------------------------------
  addAssignedState(stateObject) {
    if (!stateObject || typeof stateObject !== "object") {
      throw new Error("State object must be a valid object");
    }

    // Basic validation for required properties
    if (!stateObject.pageId) {
      throw new Error("State object must have a pageId");
    }

    // Add timestamp if not present
    const stateWithTimestamp = {
      ...stateObject,
      timestamp: stateObject.timestamp || new Date().toISOString(),
    };

    this.#assignedStates.push(stateWithTimestamp);
    return stateWithTimestamp;
  }

  // ------------------------------------------------------------
  // Get all unique assigned states for a pageId
  // Unique based on selectedStateId AND assignedStateId combination
  // ------------------------------------------------------------
  getAllUniqueAssignedStates(pageId) {
    if (!pageId) {
      return [];
    }

    // Filter by pageId first
    const pageStates = this.#assignedStates.filter(
      (state) => state && state.pageId === pageId
    );

    if (pageStates.length === 0) {
      return [];
    }

    // Create a Map to ensure uniqueness based on selectedStateId & assignedStateId
    const uniqueMap = new Map();

    // Process in reverse order to keep the latest occurrence
    [...pageStates].reverse().forEach((state) => {
      const key = `${state.selectedStateId || ""}_${
        state.assignedStateId || ""
      }`;

      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, state);
      }
    });

    // Convert Map values back to array (in original order)
    return Array.from(uniqueMap.values());
  }

  // ------------------------------------------------------------
  // Static convenience methods
  // ------------------------------------------------------------
  static removeAllFilesFor(key) {
    // return StateHandler.getInstance().removeAllFilesFor(key);
  }

  // Static method to flush all data
  static flushAll() {
    return StateHandler.getInstance().flushAll();
  }

  // Static method to get the singleton instance
  static getInstance(partial = {}) {
    if (!StateHandler.#instance) {
      StateHandler.#instance = new StateHandler(partial);
    } else {
      // ----- single string-pair update -------------------------------------------------
      if (partial.key !== undefined) {
        StateHandler.#instance.states = partial; // uses the setter above
      }
      // ----- bulk init / update --------------------------------------------------------
      else if (
        partial &&
        typeof partial === "object" &&
        Object.keys(partial).length > 0
      ) {
        StateHandler.#instance._merge(partial);
      }
    }
    return StateHandler.#instance;
  }
}

module.exports = StateHandler;
