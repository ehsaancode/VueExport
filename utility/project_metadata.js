class ProjectMetadata {
  // ------------------------------------------------------------
  // Singleton handling
  Yale;
  static #instance = null;

  // ------------------------------------------------------------
  // Private storage: { [key:string]: string[] }
  // ------------------------------------------------------------
  #importFiles = {};

  // ------------------------------------------------------------
  // Private constructor – called only once
  // ------------------------------------------------------------
  constructor(initialMap = {}) {
    if (ProjectMetadata.#instance) {
      // merge any initial data into the existing map
      this._merge(initialMap);
      return ProjectMetadata.#instance;
    }

    this._merge(initialMap);
    ProjectMetadata.#instance = this;
  }

  // ------------------------------------------------------------
  // Helper: merge an object into #importFiles (dedupes arrays)
  // ------------------------------------------------------------
  _merge(obj) {
    for (const [k, v] of Object.entries(obj)) {
      const arr = Array.isArray(v) ? v : [v];
      this.#importFiles[k] = [
        ...new Set([...(this.#importFiles[k] || []), ...arr.map(String)]),
      ];
    }
  }

  // ------------------------------------------------------------
  // SETTER – key & value are both strings
  // ------------------------------------------------------------
  set importFiles({ key, value }) {
    if (typeof key !== "string" || key === "") {
      throw new Error("Key must be a non-empty string");
    }
    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }

    const current = this.#importFiles[key] || [];
    // add the new string and dedupe (preserves first-occurrence order)
    this.#importFiles[key] = [...new Set([...current, value])];
  }

  // ------------------------------------------------------------
  // GETTER – whole map (for debugging / inspection)
  // ------------------------------------------------------------
  get importFiles() {
    // return a shallow copy so external code cannot mutate the internal map
    return { ...this.#importFiles };
  }

  // ------------------------------------------------------------
  // Get array for a specific key (unique, copy)
  // ------------------------------------------------------------
  getFilesFor(key) {
    if (typeof key !== "string" || key === "") {
      throw new Error("Key must be a non-empty string");
    }
    const arr = this.#importFiles[key];
    return arr ? [...arr] : undefined;
  }

  removeAllFilesFor(key) {
    if (typeof key !== "string" || key === "") {
      throw new Error("Key must be a non-empty string");
    }

    const existed = key in this.#importFiles;
    delete this.#importFiles[key]; // removes the key completely
    return existed; // true if key existed, false otherwise
  }

  // ------------------------------------------------------------
  // Static convenience method (optional)
  // ------------------------------------------------------------
  static removeAllFilesFor(key) {
    return ProjectMetadata.getInstance().removeAllFilesFor(key);
  }

  // ------------------------------------------------------------
  // Static factory – create / update singleton
  // ------------------------------------------------------------
  static getInstance(partial = {}) {
    if (!ProjectMetadata.#instance) {
      ProjectMetadata.#instance = new ProjectMetadata(partial);
    } else {
      // ----- single string-pair update -------------------------------------------------
      if (partial.key !== undefined && typeof partial.value === "string") {
        ProjectMetadata.#instance.importFiles = partial; // uses the setter above
      }
      // ----- bulk init / update --------------------------------------------------------
      else if (partial && typeof partial === "object") {
        ProjectMetadata.#instance._merge(partial);
      }
    }
    return ProjectMetadata.#instance;
  }
}

// ----------------------------------------------------------------
// Export for Node / CommonJS
// ----------------------------------------------------------------
module.exports = ProjectMetadata;
