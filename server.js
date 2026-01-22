/*const axios = require("axios");
const express = require("express");
const { exec } = require("child_process");
const util = require("util");
const path = require("path");
const execPromise = util.promisify(exec);
const app = express();
const commonPath = require("./utility/common_path");
const bodyParser = require("body-parser");
const App = require("./app");
const fs = require("fs");
const cors = require("cors");
const readWriteFile = require("./utility/read_write_file");
const commonUtils = require("./utility/common_utils");
const PORT = 3000;

const reactProjectPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectPath.get(commonPath.environmentHosting)}`
);

const reactProjectBuildPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectBuildPath.get(commonPath.environmentHosting)}`
);

const androidProjectPath = path.resolve(
  __dirname,
  `${commonPath.androidProjectPath.get(commonPath.environmentHosting)}`
);

const iosProjectPath = path.resolve(
  __dirname,
  `${commonPath.iosProjectPath.get(commonPath.environmentHosting)}`
);

// Server configuration for SSH
const serverConfig = {
  host: "10.0.50.179",
  port: 22,
  username: "root", // Replace with your SSH username
  // privateKey: require("fs").readFileSync("/Users/sayan/.ssh/id_rsa"), // Path to SSH key
  // passphrase: " ",
  password: "1qaz!QAZ",
};

// Middleware
app.use(cors()); // Enable CORS for all routess
app.use(bodyParser.json());

// For React.js project
app.get("/api/export/process", async (req, res) => {
  try {
    const { projectID, pageId, platform } = req.query; // platform: ios, android, reactjs

    // Validate projectID
    if (!projectID) {
      return res.status(400).json({
        status: "error",
        msg: "projectID is required",
        // error: "projectID is required",
      });
    }

    let subProjectPath = projectID;

    let zipProjectPath = "";
    let projectFolderPath = "";
    let fileName = "";

    if (platform === "reactjs") {
      await App.createReactjsProject(projectID, pageId, platform);
      projectFolderPath = `${reactProjectPath}/${subProjectPath}/react_project`;
      zipProjectPath = `${reactProjectPath}/${subProjectPath}/reactjs_project.zip`;
      // await readWriteFile.deleteFilesAndFolders(zipProjectPath);
    } else if (platform === "ios") {
      await App.createIosProject(projectID, pageId, platform);
      projectFolderPath = `${iosProjectPath}/${projectID}/export_files`;
      zipProjectPath = `${iosProjectPath}/${projectID}/ios_project.zip`;
      fileName = "ios_project.zip";
    } else if (platform === "android") {
      await App.createAndroidProject(projectID, pageId, platform);
      projectFolderPath = `${androidProjectPath}/${projectID}/export_files`;
      zipProjectPath = `${androidProjectPath}/${projectID}/android_project.zip`;
      fileName = "android_project.zip";
    } else {
      return res.status(400).json({
        status: "error",
        msg: "Invalid platform specified. Use 'reactjs', 'ios', or 'android'.",
      });
    }
    await readWriteFile.zipFolder(projectFolderPath, zipProjectPath);
    // Check if file exists
    if (!fs.existsSync(zipProjectPath)) {
      return res.status(404).json({ error: "Output file not found" });
    }

    // Set headers for ZIP file download
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-Type", "application/zip");

    // Create read stream and pipe to response
    const fileStream = fs.createReadStream(zipProjectPath);
    fileStream.pipe(res);

    // Error handling for the file stream
    fileStream.on("error", (err) => {
      console.error("File stream error:", err);
      res.status(500).json({ error: "Error streaming file" });
    });
  } catch (error) {
    console.error("Error executing commands:", error.message);
    res.status(500).json({
      status: "error",
      msg: "Failed to complete build process.",
      // details: error.message,
    });
  }
});

app.get("/api/export/build", async (req, res) => {
  try {
    const { projectID, pageId, platform } = req.query; // platform: ios, android, reactjs

    // Validate projectID
    if (!projectID) {
      return res.status(400).json({ error: "projectID is required" });
    }

    let subProjectPath = projectID;
    await App.createReactjsProject(projectID, pageId, platform);
    let projectFolderPath = `${reactProjectPath}/${subProjectPath}/react_project`;

    // Run npm install
    console.log("Running npm install in React project...");
    await execPromise("npm i", { cwd: projectFolderPath });
    console.log("npm install completed successfully.");

    // Run npm run build
    console.log("Running npm run build in React project...");
    await execPromise("npm run build", { cwd: projectFolderPath });
    console.log("npm run build completed successfully.");

    let buildFolderPath = `${reactProjectBuildPath}/${subProjectPath}`;

    await readWriteFile.deleteFilesAndFolders(buildFolderPath);
    await readWriteFile.createFolderIfNotExists(buildFolderPath);
    let sourceBuildPath = `${projectFolderPath}/dist`;
    await readWriteFile.copyPasteSourceToDestination(
      sourceBuildPath,
      buildFolderPath
    );

    let htaccessFilePath = `${reactProjectPath}/${subProjectPath}/template/.htaccess`;
    await readWriteFile.copyPasteFileToFolder(
      htaccessFilePath,
      buildFolderPath
    );
    // previewLink: `https://staging.cmsexport.react.redoq.host/${subProjectPath}/${commonUtils.currentPage}`,
    console.log("Build completed successfully.");
    res.status(200).json({
      status: "success",
      message: "Build completed successfully.",
      previewLink: `https://staging.cmsexport.react.redoq.host/${subProjectPath}/`,
      // buildPath: reactProjectBuildPath,
    });
  } catch (error) {
    console.error("Error executing commands:", error.message);
    res.status(500).json({
      status: "error",
      msg: "Failed to complete build process.",
      // details: error.message,
    });
  }
});

app.get("/api/export/download_files", async (req, res) => {
  try {
    const { projectID, pageId, platform } = req.query; // platform: ios, android, reactjs

    // Validate projectID
    if (!projectID) {
      return res.status(400).json({
        status: "error",
        msg: "projectID is required",
        // error: "projectID is required",
      });
    }
    // console.log(`projectID: ${projectID}`);

    let subProjectPath = projectID;
    
    let projectFolderPath = `${reactProjectPath}/${subProjectPath}`;
    console.log(`projectFolderPath: ${projectFolderPath}`);

    let oldZipProjectPath = `${reactProjectPath}/${subProjectPath}/reactjs_project.zip`;
    await readWriteFile.deleteFilesAndFolders(oldZipProjectPath);

    let zipProjectPath = `${reactProjectPath}/reactjs_project.zip`;
    console.log(`zipProjectPath: ${zipProjectPath}`);
    await readWriteFile.deleteFilesAndFolders(zipProjectPath);
    await readWriteFile.zipFolder(projectFolderPath, zipProjectPath);
    // Check if file exists
    if (!fs.existsSync(zipProjectPath)) {
      return res.status(404).json({ error: "Output file not found" });
    }

    // Set headers for ZIP file download
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="reactjs_project.zip"'
    );
    res.setHeader("Content-Type", "application/zip");

    // Create read stream and pipe to response
    const fileStream = fs.createReadStream(zipProjectPath);
    fileStream.pipe(res);

    console.log("Build completed successfully.");
    // Error handling for the file stream
    fileStream.on("error", (err) => {
      console.error("File stream error:", err);
      res.status(500).json({ error: "Error streaming file" });
    });
  } catch (error) {
    console.error("Error executing commands:", error.message);
    res.status(500).json({
      status: "error",
      msg: "Failed to complete build process.",
      // details: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Gracefully shut down on Ctrl+C
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
*/

/*
const express = require("express");
const { exec } = require("child_process");
const util = require("util");
const path = require("path");
const execPromise = util.promisify(exec);
const app = express();
const commonPath = require("./utility/common_path");
const bodyParser = require("body-parser");
const App = require("./app");
const fs = require("fs");
const cors = require("cors");
const readWriteFile = require("./utility/read_write_file");
const PORT = 3000;

// Socket.IO setup
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this to your specific domains in production
    methods: ["GET", "POST"],
  },
});

const reactProjectPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectPath.get(commonPath.environmentHosting)}`
);

const reactProjectBuildPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectBuildPath.get(commonPath.environmentHosting)}`
);

// Store connected clients and their build progress
const connectedClients = new Map();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Socket.IO Connection Handling
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Store client connection
  connectedClients.set(socket.id, {
    socket: socket,
    connectedAt: new Date(),
    currentProject: null,
    buildStatus: null,
  });

  // Send welcome message
  socket.emit("connection_established", {
    message: "Connected to build server",
    socketId: socket.id,
    timestamp: new Date().toISOString(),
  });

  // Handle build status requests
  socket.on("get_build_status", (data) => {
    const client = connectedClients.get(socket.id);
    if (client && client.currentProject) {
      socket.emit("build_status_update", {
        projectID: client.currentProject,
        status: client.buildStatus,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Handle client disconnection
  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id} - Reason: ${reason}`);
    connectedClients.delete(socket.id);
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error(`Socket error for client ${socket.id}:`, error);
  });
});

// Helper function to emit build progress
function emitBuildProgress(
  socketId,
  projectID,
  stage,
  message,
  progress = null
) {
  const progressData = {
    projectID,
    stage,
    message,
    progress,
    timestamp: new Date().toISOString(),
  };

  io.to(socketId).emit("build_progress", progressData);
  console.log(`Build progress for ${projectID}: ${stage} - ${message}`);
}

// Updated build endpoint with WebSocket support
app.get("/api/export/build", async (req, res) => {
  const { projectID, pageId, platform, socketId } = req.query;

  // Validate projectID
  if (!projectID) {
    return res.status(400).json({ error: "projectID is required" });
  }

  // If socketId is provided, use WebSocket for real-time updates
  const useWebSocket = socketId && connectedClients.has(socketId);

  try {
    if (useWebSocket) {
      const client = connectedClients.get(socketId);
      client.currentProject = projectID;
      client.buildStatus = "started";

      emitBuildProgress(
        socketId,
        projectID,
        "initializing",
        "Starting build process",
        0
      );
    }

    // Create React project
    if (useWebSocket) {
      emitBuildProgress(
        socketId,
        projectID,
        "creating_project",
        "Creating React project structure",
        20
      );
    }

    await App.createReactjsProject(projectID, pageId, platform);
    let subProjectPath = projectID;
    let projectFolderPath = `${reactProjectPath}/${subProjectPath}/react_project`;

    // Run npm install
    if (useWebSocket) {
      emitBuildProgress(
        socketId,
        projectID,
        "installing_dependencies",
        "Installing npm dependencies",
        40
      );
    }

    console.log("Running npm install in React project...");
    await execPromise("npm i", { cwd: projectFolderPath });
    console.log("npm install completed successfully.");

    // Run npm run build
    if (useWebSocket) {
      emitBuildProgress(
        socketId,
        projectID,
        "building",
        "Building React project",
        70
      );
    }

    console.log("Running npm run build in React project...");
    await execPromise("npm run build", { cwd: projectFolderPath });
    console.log("npm run build completed successfully.");

    // Handle build output
    if (useWebSocket) {
      emitBuildProgress(
        socketId,
        projectID,
        "handling_output",
        "Processing build output",
        90
      );
    }

    let buildFolderPath = `${reactProjectBuildPath}/${subProjectPath}`;
    await readWriteFile.deleteFilesAndFolders(buildFolderPath);
    await readWriteFile.createFolderIfNotExists(buildFolderPath);
    let sourceBuildPath = `${projectFolderPath}/dist`;
    await readWriteFile.copyPasteSourceToDestination(
      sourceBuildPath,
      buildFolderPath
    );

    let htaccessFilePath = `${reactProjectPath}/${subProjectPath}/template/.htaccess`;
    await readWriteFile.copyPasteFileToFolder(
      htaccessFilePath,
      buildFolderPath
    );

    // Final success message
    if (useWebSocket) {
      emitBuildProgress(
        socketId,
        projectID,
        "completed",
        "Build completed successfully",
        100
      );

      const client = connectedClients.get(socketId);
      client.buildStatus = "completed";

      io.to(socketId).emit("build_completed", {
        projectID,
        previewLink: `https://staging.cmsexport.react.redoq.host/${subProjectPath}/`,
        timestamp: new Date().toISOString(),
        message: "Build process completed successfully",
      });
    }

    console.log("Build completed successfully.");
    res.status(200).json({
      status: "success",
      message: "Build completed successfully.",
      previewLink: `https://staging.cmsexport.react.redoq.host/${subProjectPath}/`,
      ...(useWebSocket && { socketUpdates: true }),
    });
  } catch (error) {
    console.error("Error executing commands:", error.message);

    // Emit error via WebSocket if applicable
    if (useWebSocket) {
      const client = connectedClients.get(socketId);
      client.buildStatus = "failed";

      io.to(socketId).emit("build_error", {
        projectID,
        error: error.message,
        timestamp: new Date().toISOString(),
        message: "Build process failed",
      });
    }

    res.status(500).json({
      status: "error",
      msg: "Failed to complete build process.",
      ...(useWebSocket && { socketUpdates: true }),
    });
  }
});

// New endpoint to get connected clients (for monitoring)
app.get("/api/connected-clients", (req, res) => {
  const clients = Array.from(connectedClients.entries()).map(
    ([socketId, client]) => ({
      socketId,
      connectedAt: client.connectedAt,
      currentProject: client.currentProject,
      buildStatus: client.buildStatus,
    })
  );

  res.json({
    totalConnected: connectedClients.size,
    clients,
  });
});

// New endpoint to send messages to specific client
app.post("/api/send-message", (req, res) => {
  const { socketId, message } = req.body;

  if (!socketId || !message) {
    return res.status(400).json({ error: "socketId and message are required" });
  }

  const client = connectedClients.get(socketId);
  if (!client) {
    return res.status(404).json({ error: "Client not found" });
  }

  client.socket.emit("server_message", {
    message,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, message: "Message sent to client" });
});

// Start server with Socket.IO
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket server available at ws://localhost:${PORT}`);
});

// Gracefully shut down on Ctrl+C
process.on("SIGINT", () => {
  console.log("Shutting down server...");

  // Notify all connected clients
  io.emit("server_shutdown", {
    message: "Server is shutting down",
    timestamp: new Date().toISOString(),
  });

  // Close all connections
  io.close(() => {
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });
});

module.exports = { app, io, connectedClients };
*/

const express = require("express");
const { exec } = require("child_process");
const util = require("util");
const path = require("path");
const execPromise = util.promisify(exec);
const app = express();
const commonPath = require("./utility/common_path");
const projectStatus = require("./utility/update_project_status");
const bodyParser = require("body-parser");
const App = require("./app");
const fs = require("fs");
const cors = require("cors");
const readWriteFile = require("./utility/read_write_file");
const ShellScriptRunner = require("./utility/shell_script_runner");
const PORT = 3000;

// Socket.IO setup
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const e = require("express");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const reactProjectPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectPath.get(commonPath.environmentHosting)}`
);

const reactProjectBuildPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectBuildPath.get(commonPath.environmentHosting)}`
);

const iosProjectPath = path.resolve(
  __dirname,
  `${commonPath.iosProjectPath.get(commonPath.environmentHosting)}`
);

const androidProjectPath = path.resolve(
  __dirname,
  `${commonPath.androidProjectPath.get(commonPath.environmentHosting)}`
);

// Store connected clients and their process progress
const connectedClients = new Map();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Socket.IO Connection Handling (same as before)
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  connectedClients.set(socket.id, {
    socket: socket,
    connectedAt: new Date(),
    currentProject: null,
    processStatus: null,
  });

  socket.emit("connection_established", {
    message: "Connected to process server",
    socketId: socket.id,
    timestamp: new Date().toISOString(),
  });

  socket.on("get_process_status", (data) => {
    const client = connectedClients.get(socket.id);
    if (client && client.currentProject) {
      socket.emit("process_status_update", {
        projectID: client.currentProject,
        status: client.processStatus,
        timestamp: new Date().toISOString(),
      });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id} - Reason: ${reason}`);
    connectedClients.delete(socket.id);
  });

  socket.on("error", (error) => {
    console.error(`Socket error for client ${socket.id}:`, error);
  });
});

// Helper function to emit process progress
function emitProcessProgress(
  socketId,
  projectID,
  platform,
  stage,
  message,
  progress = null
) {
  const progressData = {
    projectID,
    platform,
    stage,
    message,
    progress,
    timestamp: new Date().toISOString(),
  };

  io.to(socketId).emit("process_progress", progressData);
  console.log(
    `Process progress for ${projectID} (${platform}): ${stage} - ${message}`
  );
}

// Helper to disconnect a specific socket
async function disconnectSocket(socketId, delay = 300) {
  const socket = io.sockets.sockets.get(socketId);
  if (socket) {
    // Small delay to ensure last message is delivered
    await new Promise((resolve) => setTimeout(resolve, delay));
    socket.disconnect();
    connectedClients.delete(socketId);
    console.log(`Disconnected socket: ${socketId}`);
    return true;
  }
  return false;
}

// Helper to emit final message and disconnect
async function emitFinalAndDisconnect(socketId, eventName, data) {
  const socket = io.sockets.sockets.get(socketId);
  if (socket) {
    socket.emit(eventName, {
      ...data,
      final: true,
    });
    await disconnectSocket(socketId);
  }
}

// Updated /api/export/process endpoint with WebSocket support
app.get("/api/export/process", async (req, res) => {
  const { projectID, pageId, platform, socketId } = req.query;

  // Validate projectID
  if (!projectID) {
    return res.status(400).json({
      status: "error",
      msg: "projectID is required",
    });
  }

  // Validate platform
  if (!platform || !["reactjs", "ios", "android"].includes(platform)) {
    return res.status(400).json({
      status: "error",
      msg: "Invalid platform specified. Use 'reactjs', 'ios', or 'android'.",
    });
  }

  // If socketId is provided, use WebSocket for real-time updates
  const useWebSocket = socketId && connectedClients.has(socketId);

  try {
    if (useWebSocket) {
      const client = connectedClients.get(socketId);
      client.currentProject = projectID;
      client.processStatus = "started";

      emitProcessProgress(
        socketId,
        projectID,
        platform,
        "initializing",
        "Starting export process",
        0
      );
    }

    let subProjectPath = projectID;
    let zipProjectPath = "";
    let projectFolderPath = "";
    let fileName = "";

    // Platform-specific project creation
    if (useWebSocket) {
      emitProcessProgress(
        socketId,
        projectID,
        platform,
        "creating_project",
        `Creating ${platform} project structure`,
        20
      );
    }

    if (platform === "reactjs") {
      await App.createReactjsProject(projectID, pageId, platform);
      projectFolderPath = `${reactProjectPath}/${subProjectPath}/react_project`;
      zipProjectPath = `${reactProjectPath}/${subProjectPath}/reactjs_project.zip`;
      fileName = "reactjs_project.zip";
    } else if (platform === "ios") {
      await App.createIosProject(projectID, pageId, platform);
      projectFolderPath = `${iosProjectPath}/${projectID}/export_files`;
      zipProjectPath = `${iosProjectPath}/${projectID}/ios_project.zip`;
      fileName = "ios_project.zip";
    } else if (platform === "android") {
      await App.createAndroidProject(projectID, pageId, platform);
      projectFolderPath = `${androidProjectPath}/${projectID}/export_files`;
      zipProjectPath = `${androidProjectPath}/${projectID}/android_project.zip`;
      fileName = "android_project.zip";
    }

    console.log(`Project created successfully for platform: ${platform}`);

    // Zip the project folder
    if (useWebSocket) {
      emitProcessProgress(
        socketId,
        projectID,
        platform,
        "zipping",
        "Compressing project files",
        70
      );
    }

    await readWriteFile.zipFolder(projectFolderPath, zipProjectPath);
    console.log(`Project zipped successfully: ${zipProjectPath}`);

    // Check if file exists
    if (!fs.existsSync(zipProjectPath)) {
      const errorMsg = "Output file not found after zipping";

      if (useWebSocket) {
        const client = connectedClients.get(socketId);
        client.processStatus = "failed";

        io.to(socketId).emit("process_error", {
          projectID,
          platform,
          error: errorMsg,
          timestamp: new Date().toISOString(),
          message: "Export process failed - file not found",
        });
      }

      return res.status(404).json({
        status: "error",
        msg: errorMsg,
      });
    }

    // Final success message via WebSocket
    if (useWebSocket) {
      emitProcessProgress(
        socketId,
        projectID,
        platform,
        "completed",
        "Export completed successfully",
        100
      );

      const client = connectedClients.get(socketId);
      client.processStatus = "completed";

      io.to(socketId).emit("process_completed", {
        projectID,
        platform,
        fileName,
        filePath: zipProjectPath,
        timestamp: new Date().toISOString(),
        message: "Export process completed successfully. Download starting...",
      });
    }

    // Set headers for ZIP file download
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-Type", "application/zip");

    // Create read stream and pipe to response
    const fileStream = fs.createReadStream(zipProjectPath);

    // Track download progress if WebSocket is enabled
    if (useWebSocket) {
      const fileStats = fs.statSync(zipProjectPath);
      const fileSize = fileStats.size;
      let downloadedBytes = 0;

      fileStream.on("data", (chunk) => {
        downloadedBytes += chunk.length;
        const downloadProgress = Math.min(
          100,
          Math.round((downloadedBytes / fileSize) * 100)
        );

        io.to(socketId).emit("download_progress", {
          projectID,
          platform,
          progress: downloadProgress,
          downloadedBytes,
          totalBytes: fileSize,
          timestamp: new Date().toISOString(),
        });
      });

      fileStream.on("end", () => {
        io.to(socketId).emit("download_completed", {
          projectID,
          platform,
          fileName,
          fileSize,
          timestamp: new Date().toISOString(),
          message: "File download completed successfully",
        });
      });
    }

    fileStream.pipe(res);

    // Error handling for the file stream
    fileStream.on("error", (err) => {
      console.error("File stream error:", err);

      if (useWebSocket) {
        const client = connectedClients.get(socketId);
        client.processStatus = "failed";

        io.to(socketId).emit("process_error", {
          projectID,
          platform,
          error: err.message,
          timestamp: new Date().toISOString(),
          message: "Error during file download",
        });
      }

      res.status(500).json({
        status: "error",
        msg: "Error streaming file",
      });
    });
  } catch (error) {
    console.error("Error executing commands:", error.message);

    // Emit error via WebSocket if applicable
    if (useWebSocket) {
      const client = connectedClients.get(socketId);
      client.processStatus = "failed";

      io.to(socketId).emit("process_error", {
        projectID,
        platform,
        error: error.message,
        timestamp: new Date().toISOString(),
        message: "Export process failed",
      });
    }

    res.status(500).json({
      status: "error",
      msg: "Failed to complete export process.",
    });
  }
});

// Keep your existing /api/export/build endpoint (same as before)
app.get("/api/export/build", async (req, res) => {
  try {
    const { projectID, pageId, platform, socketId } = req.query;

    if (!projectID) {
      return res.status(400).json({ error: "projectID is required" });
    }

    const projStatus = await projectStatus.getProjectStatus(
      projectID,
      platform
    );

    if (projStatus != "processing") {
      res.status(200).json({
        status: "processing",
        message: "Your request is being processed. Please wait for some time.",
        previewLink: ``,
      });

      const useWebSocket = socketId && connectedClients.has(socketId);

      if (useWebSocket) {
        const client = connectedClients.get(socketId);
        client.currentProject = projectID;
        client.buildStatus = "started";

        emitProcessProgress(
          socketId,
          projectID,
          platform,
          "initializing",
          "Starting build process",
          0
        );
      }

      await App.createReactjsProject(projectID, pageId, platform);
      let subProjectPath = projectID;
      let projectFolderPath = `${reactProjectPath}/${subProjectPath}/react_project`;

      if (useWebSocket) {
        emitProcessProgress(
          socketId,
          projectID,
          platform,
          "installing_dependencies",
          "Installing npm dependencies",
          40
        );
      }

      console.log("Running npm install in React project...");
      await execPromise("npm i", { cwd: projectFolderPath });
      console.log("npm install completed successfully.");

      if (useWebSocket) {
        emitProcessProgress(
          socketId,
          projectID,
          platform,
          "building",
          "Building React project",
          70
        );
      }

      console.log("Running npm run build in React project...");
      await execPromise("npm run build", { cwd: projectFolderPath });
      console.log("npm run build completed successfully.");

      emitProcessProgress(
        socketId,
        projectID,
        platform,
        "handling_output",
        "Processing build output",
        90
      );

      let buildFolderPath = `${reactProjectBuildPath}/${subProjectPath}`;
      await readWriteFile.deleteFilesAndFolders(buildFolderPath);
      await readWriteFile.createFolderIfNotExists(buildFolderPath);
      let sourceBuildPath = `${projectFolderPath}/dist`;
      await readWriteFile.copyPasteSourceToDestination(
        sourceBuildPath,
        buildFolderPath
      );

      let htaccessFilePath = `${reactProjectPath}/${subProjectPath}/template/.htaccess`;
      await readWriteFile.copyPasteFileToFolder(
        htaccessFilePath,
        buildFolderPath
      );

      if (commonPath.environmentHosting === "server") {
        const result = await ShellScriptRunner.runScript(
          `${reactProjectBuildPath}/docker_transfer_and_configure.sh`,
          [projectID],
          {
            realtimeOutput: true,
          }
        );
        console.log("Docker transfer script result:", result);
      }

      emitProcessProgress(
        socketId,
        projectID,
        platform,
        "completed",
        "Build completed successfully",
        100
      );
      // const client = connectedClients.get(socketId);
      // client.buildStatus = "completed";

      if (useWebSocket) {
        await emitFinalAndDisconnect(socketId, "build_completed", {
          projectID,
          platform,
          previewLink: `http://kuickstudio-preview.redoq.host/${subProjectPath}/`,
          timestamp: new Date().toISOString(),
          message: "build_completed",
        });
      }
      /*io.to(socketId).emit("build_completed", {
        projectID,
        platform,
        previewLink: `http://kuickstudio-preview.redoq.host/${subProjectPath}/`,
        timestamp: new Date().toISOString(),
        message: "build_completed", //"Build process completed successfully",
      });*/

      console.log("Build completed successfully.");
      await projectStatus.updateProjectStatus(projectID, platform, "completed");
      /*
      res.status(200).json({
        status: "success",
        message: "Build completed successfully.",
        previewLink: `http://kuickstudio-preview.redoq.host/${subProjectPath}/`,
        ...(useWebSocket && { socketUpdates: true }),
      });
      */
    } else {
      res.status(200).json({
        status: "error",
        message:
          "Your request is currently busy. Please try again after some time.",
        previewLink: ``,
      });
    }
  } catch (error) {
    console.error("Error executing commands:", error.message);

    // const client = connectedClients.get(socketId);
    // client.buildStatus = "failed";

    /*io.to(socketId).emit("build_error", {
      projectID,
      platform,
      error: error.message,
      timestamp: new Date().toISOString(),
      message: "Build process failed",
    });*/

    if (socketId) {
      await emitFinalAndDisconnect(socketId, "build_error", {
        projectID,
        platform,
        error: error.message,
        timestamp: new Date().toISOString(),
        message: "Build process failed",
      });
    }

    await projectStatus.updateProjectStatus(projectID, platform, "error");
    res.status(500).json({
      status: "error",
      msg: "Failed to complete build process.",
      ...(useWebSocket && { socketUpdates: true }),
    });
  }
});

// New endpoint to handle both process status
app.get("/api/process-status", (req, res) => {
  const clients = Array.from(connectedClients.entries()).map(
    ([socketId, client]) => ({
      socketId,
      connectedAt: client.connectedAt,
      currentProject: client.currentProject,
      buildStatus: client.buildStatus,
      processStatus: client.processStatus,
    })
  );

  res.json({
    totalConnected: connectedClients.size,
    clients,
  });
});

// Start server with Socket.IO
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket server available at ws://localhost:${PORT}`);
});

// Gracefully shut down
process.on("SIGINT", () => {
  console.log("Shutting down server...");

  io.emit("server_shutdown", {
    message: "Server is shutting down",
    timestamp: new Date().toISOString(),
  });

  io.close(() => {
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });
});

module.exports = { app, io, connectedClients };
