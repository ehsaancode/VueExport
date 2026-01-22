class FormMetadata {
  // Static instance for Singleton
  static #instance = null;

  // Private properties
  #formMetadata = {};
  #formSubmitObjects = {};

  constructor(initialMap = {}) {
    if (FormMetadata.#instance) {
      this._merge(initialMap);
      return FormMetadata.#instance;
    }

    this.#formMetadata = {};
    this.#formSubmitObjects = {};
    this._merge(initialMap);
    FormMetadata.#instance = this;
  }

  // ------------------------------------------------------------
  // Helper: merge an object into #formMetadata (dedupes arrays)
  // ------------------------------------------------------------
  _merge(obj) {
    for (const [k, v] of Object.entries(obj)) {
      const arr = Array.isArray(v) ? v : [v];
      this.#formMetadata[k] = [
        ...new Set([...(this.#formMetadata[k] || []), ...arr]),
      ];
    }
  }

  // ------------------------------------------------------------
  // FLUSH ALL DATA - Remove all formMetadata
  // ------------------------------------------------------------
  flushAll() {
    const hadMetadata = Object.keys(this.#formMetadata).length > 0;
    const hadSubmitObjects = Object.keys(this.#formSubmitObjects).length > 0;

    this.#formMetadata = {};
    this.#formSubmitObjects = {};

    return hadMetadata || hadSubmitObjects;
  }

  // ------------------------------------------------------------
  // SETTER – key & value are both strings
  // ------------------------------------------------------------
  set formMetadata({ key, value }) {
    if (typeof key !== "string" || key === "") {
      throw new Error("Key must be a non-empty string");
    }

    const current = this.#formMetadata[key] || [];

    // FIXED: Create a new array with the current values and new value, then dedupe
    this.#formMetadata[key] = [...new Set([...current, value])];
  }

  // ------------------------------------------------------------
  // GETTER – whole map (for debugging / inspection)
  // ------------------------------------------------------------
  get formMetadata() {
    return { ...this.#formMetadata };
  }

  // ------------------------------------------------------------
  // Get array for a specific key (unique, copy)
  // ------------------------------------------------------------
  getFilesFor(key) {
    if (typeof key !== "string" || key === "") {
      throw new Error("Key must be a non-empty string");
    }
    const arr = this.#formMetadata[key];
    // console.log(`FormMetadata.getFilesFor(${key}): ${JSON.stringify(arr)}`);
    // console.log(`Full formMetadata: ${JSON.stringify(this.#formMetadata)}`);

    if (!arr) {
      return [];
    }

    // Remove duplicates based on 'name' property (keeping last occurrence)
    const uniqueMap = new Map();

    arr.forEach((item) => {
      if (item && item.widgetId) {
        uniqueMap.set(item.widgetId, {
          ...item,
        });
      }
    });

    return Array.from(uniqueMap.values());
  }

  // ------------------------------------------------------------
  // SETTER – key & value are both strings
  // ------------------------------------------------------------
  set formSubmitObjects({ key, value }) {
    if (typeof key !== "string" || key === "") {
      throw new Error("Key must be a non-empty string");
    }

    const current = this.#formSubmitObjects[key] || [];

    // FIXED: Create a new array with the current values and new value, then dedupe
    this.#formSubmitObjects[key] = [...new Set([...current, value])];
  }

  // ------------------------------------------------------------
  // GETTER – whole map (for debugging / inspection)
  // ------------------------------------------------------------
  get formSubmitObjects() {
    return { ...this.#formSubmitObjects };
  }

  // ------------------------------------------------------------
  // Get array for a specific key (unique, copy)
  // ------------------------------------------------------------
  getFormSubmitFilesFor(key) {
    if (typeof key !== "string" || key === "") {
      throw new Error("Key must be a non-empty string");
    }
    const arr = this.#formSubmitObjects[key];
    /*console.log(
      `formSubmitObjects.getFilesFor(${key}): ${JSON.stringify(arr)}`
    );
    console.log(
      `Full formSubmitObjects: ${JSON.stringify(this.#formMetadata)}`
    );*/

    if (!arr) {
      return [];
    }

    // Remove duplicates based on 'name' property (keeping last occurrence)
    const uniqueMap = new Map();

    arr.forEach((item) => {
      if (item && item.methodName) {
        uniqueMap.set(item.methodName, {
          ...item,
        });
      }
    });

    return Array.from(uniqueMap.values());
  }

  removeAllFilesFor(key) {
    if (typeof key !== "string" || key === "") {
      throw new Error("Key must be a non-empty string");
    }

    const existed = key in this.#formMetadata;
    delete this.#formMetadata[key];
    return existed;
  }

  // ------------------------------------------------------------
  // Static convenience methods
  // ------------------------------------------------------------
  static removeAllFilesFor(key) {
    // You can uncomment this when ready to implement:
    // return FormMetadata.getInstance().removeAllFilesFor(key);
  }

  // Static method to flush all data
  static flushAll() {
    return FormMetadata.getInstance().flushAll();
  }

  // Static method to get the singleton instance
  static getInstance(partial = {}) {
    if (!FormMetadata.#instance) {
      FormMetadata.#instance = new FormMetadata(partial);
    } else {
      // Single key-value update
      if (partial.key !== undefined) {
        FormMetadata.#instance.formMetadata = partial;
      }
      // Bulk init/update
      else if (
        partial &&
        typeof partial === "object" &&
        Object.keys(partial).length > 0
      ) {
        FormMetadata.#instance._merge(partial);
      }
    }
    return FormMetadata.#instance;
  }
}

module.exports = FormMetadata;
