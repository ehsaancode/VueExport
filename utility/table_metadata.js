class TableMetadata {
  // Static instance for Singleton
  static #instance = null;

  // Private properties
  #tableWidgetId;
  #tableType;
  #tableRowsId;
  #columnHeadersId;

  constructor(tableWidgetId, tableType, tableRowsId, columnHeadersId) {
    if (TableMetadata.#instance) {
      // Update only provided properties
      if (tableWidgetId !== undefined) this.tableWidgetId = tableWidgetId;
      if (tableType !== undefined) this.tableType = tableType;
      if (tableRowsId !== undefined) this.tableRowsId = tableRowsId;
      if (columnHeadersId !== undefined) this.columnHeadersId = columnHeadersId;
      return TableMetadata.#instance;
    }
    // Initialize private properties with defaults if not provided
    this.#tableWidgetId = tableWidgetId || "";
    this.#tableType = tableType || "";
    this.#tableRowsId = tableRowsId || "";
    this.#columnHeadersId = columnHeadersId || "";
    TableMetadata.#instance = this;
  }

  // Getter for tableWidgetId
  get tableWidgetId() {
    return this.#tableWidgetId;
  }

  // Setter for tableWidgetId
  set tableWidgetId(value) {
    if (typeof value === "string" && value.length > 0) {
      this.#tableWidgetId = value;
    } else {
      throw new Error("tableWidgetId must be a non-empty string");
    }
  }

  // Getter for tableType
  get tableType() {
    return this.#tableType;
  }

  // Setter for tableType
  set tableType(value) {
    if (typeof value === "string" && value.length > 0) {
      this.#tableType = value;
    } else {
      throw new Error("tableType must be a non-empty string");
    }
  }

  // Getter for tableWidgetId
  get tableRowsId() {
    return this.#tableRowsId;
  }

  // Setter for tableWidgetId
  set tableRowsId(value) {
    if (typeof value === "string" && value.length > 0) {
      this.#tableRowsId = value;
    } else {
      throw new Error("tableRowsId must be a non-empty string");
    }
  }


   // Getter for columnHeadersId
  get columnHeadersId() {
    return this.#columnHeadersId;
  }

  // Setter for columnHeadersId
  set columnHeadersId(value) {
    if (typeof value === "string" && value.length > 0) {
      this.#columnHeadersId = value;
    } else {
      throw new Error("columnHeadersId must be a non-empty string");
    }
  }

  

  // Static method to get the singleton instance
  static getInstance(tableWidgetId, tableType, tableRowsId, columnHeadersId) {
    if (!TableMetadata.#instance) {
      TableMetadata.#instance = new TableMetadata(
        tableWidgetId,
        tableType,
        tableRowsId,
        columnHeadersId
      );
    } else {
      // Update only provided properties
      if (tableWidgetId !== undefined)
        TableMetadata.#instance.tableWidgetId = tableWidgetId;
      if (tableType !== undefined)
        TableMetadata.#instance.tableType = tableType;
      if (tableRowsId !== undefined)
        TableMetadata.#instance.tableRowsId = tableRowsId;
      if (columnHeadersId !== undefined)
        TableMetadata.#instance.columnHeadersId = columnHeadersId;
      
    }
    return TableMetadata.#instance;
  }
}

module.exports = TableMetadata;
