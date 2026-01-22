const fs = require("fs").promises;
const fs_not_promises = require("fs");
const path = require("path");
const archiver = require("archiver");
const { createReadStream, createWriteStream } = require("fs");
const { pipeline } = require("stream/promises");

async function createFolderIfNotExists(folderPath) {
  try {
    await fs.access(folderPath);
    // console.log(`Folder ${folderPath} already exists`);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.mkdir(folderPath, { recursive: true });
      await fs.chmod(folderPath, 0o755);
      /*console.log(
        `Folder ${folderPath} created successfully with 777 permissions`
      );*/
    } else {
      throw error;
    }
  }
}

async function createFileIfNotExists(filePath, initialContent = "") {
  try {
    await fs.access(filePath);
    // console.log(`File ${filePath} already exists`);
  } catch (error) {
    if (error.code === "ENOENT") {
      // Ensure directory exists first
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });

      // Create file with initial content
      await fs.writeFile(filePath, initialContent);
      // console.log(`File ${filePath} created successfully`);
    } else {
      throw error;
    }
  }
}

async function makeFilesReadable(folderPath) {
  try {
    // Change directory permissions
    await fs.chmod(folderPath, 0o755);

    // Get all files
    const files = await fs.readdir(folderPath);

    // Change each file's permissions
    await Promise.all(
      files.map(async (file) => {
        const filePath = folderPath + file;
        await fs.chmod(filePath, 0o644);
      })
    );

    console.log("All files are now readable");
  } catch (err) {
    console.error("Error changing permissions:", err);
  }
}

async function contentFromFile(filePath) {
  try {
    const contentOfFile = await fs.readFile(filePath, "utf8");
    return contentOfFile;
  } catch (error) {
    console.error("An error occurred while reading the file:", error);
    return null;
  }
}

async function writeToFile(filePath, content) {
  try {
    await fs.appendFile(filePath, content);
    return "success";
  } catch (err) {
    console.error(err);
    return "failure";
  }
}

// function deleteFile(filePath) {
//   fs.unlink(filePath);
// }

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (err) {
    return false;
  }
}

async function deleteFile(filePath) {
  try {
    if (await fileExists(filePath)) {
      await fs.unlink(filePath);
    }
    return "success";
  } catch (err) {
    console.error(err);
    return "failure";
  }
}

async function copyPasteSourceToDestination(sourcePath, destinationPath) {
  try {
    await fs.cp(sourcePath, destinationPath, { recursive: true });
    // console.log("Folder copied successfully!");
  } catch (err) {
    console.error("Error copying folder:", err);
  }
}

async function copyPasteFileToFolder(sourcePath, destinationFolder) {
  try {
    // Ensure the destination folder exists, create it if it doesn't
    await fs.mkdir(destinationFolder, { recursive: true });

    // Extract the filename from the source path
    const fileName = path.basename(sourcePath);

    // Construct the full destination path (folder + filename)
    const destinationPath = path.join(destinationFolder, fileName);

    // Copy the file to the destination
    await fs.copyFile(sourcePath, destinationPath);
    /*console.log(
      `File ${fileName} copied successfully to ${destinationFolder}!`
    );*/
  } catch (err) {
    console.error("Error copying file:", err);
  }
}

async function copyPasteFileContent(sourceFilePath, destinationFilePath) {
  /*try {
    // Read content from source file
    const data = await fs.readFile(sourceFilePath, "utf8");

    // Write content to destination file
    await fs.writeFile(destinationFilePath, data);

    // console.log('File has been copied successfully!');
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(
        "Error: Source file not found or inaccessible:",
        sourceFilePath
      );
    } else {
      console.error("Error during file operation:", err.message);
    }
  }*/
  try {
    // 1. Verify source file exists
    await fs.access(sourceFilePath);
    // console.log(`Source file verified: ${sourceFilePath}`);

    // 2. Ensure destination directory exists
    const destDir = path.dirname(destinationFilePath);
    await fs.mkdir(destDir, { recursive: true });
    // console.log(`Ensured destination directory: ${destDir}`);

    // 3. Copy with explicit permissions
    const data = await fs.readFile(sourceFilePath, "utf8");
    await fs.writeFile(destinationFilePath, data, { mode: 0o644 }); // rw-r--r--

    // console.log(`Copied successfully to ${destinationFilePath}`);
    return true;
  } catch (err) {
    console.error(`COPY FAILED:
    Source: ${sourceFilePath}
    Destination: ${destinationFilePath}
    Error: ${err.message}
    Stack: ${err.stack}`);
    return false;
  }
}

async function appendFileContent(sourceFilePath, destinationFilePath) {
  try {
    // Read content from source file
    const data = await fs.readFile(sourceFilePath, "utf8");

    // Append content to destination file
    await fs.appendFile(destinationFilePath, data);

    // console.log('Content has been appended successfully!');
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(
        "Error: Source file not found or inaccessible:",
        sourceFilePath
      );
    } else {
      console.error("Error during file operation:", err.message);
    }
  }
}

async function replaceWordInFile(filePath, wordToReplace, replacementWord) {
  try {
    // Read the content of the file
    const content = await fs.readFile(filePath, "utf8");

    // Replace all occurrences of the word (case-sensitive)
    const modifiedContent = content.replaceAll(wordToReplace, replacementWord);
    // For case-insensitive replacement, use:
    // const modifiedContent = content.replace(new RegExp(wordToReplace, 'gi'), replacementWord);

    // Write the modified content back to the file
    await fs.writeFile(filePath, modifiedContent);

    // console.log(`All occurrences of "${wordToReplace}" replaced with "${replacementWord}" successfully!`);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error("Error: File not found or inaccessible:", filePath);
    } else {
      console.error("Error during file operation:", err.message);
    }
  }
}

async function deleteFilesInFolder(folderPath) {
  try {
    // Read all items in the folder
    const files = await fs.readdir(folderPath);

    // Process each item
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = await fs.stat(filePath);

      // Check if it's a file (not a directory) and delete it
      if (stats.isFile()) {
        await fs.unlink(filePath);
        // console.log(`Deleted file: ${filePath}`);
      }
    }

    // console.log('All files deleted successfully!');
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error("Error: Folder not found:", folderPath);
    } else {
      console.error("Error during file deletion:", err.message);
    }
  }
}

async function deleteFilesAndFolders(folderPath) {
  try {
    await fs.rm(folderPath, { recursive: true, force: true });
    // console.log(`All contents in ${folderPath} deleted successfully!`);
  } catch (err) {
    console.error("Error during deletion:", err.message);
  }
}

async function zipFolder(sourceDir, outputZipPath) {
  await deleteFile(outputZipPath);
  return new Promise((resolve, reject) => {
    // Create output stream for the zip file
    const output = fs_not_promises.createWriteStream(outputZipPath);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression
    });

    // Handle errors
    output.on("close", () => {
      resolve(
        `Zip file created: ${outputZipPath} (${archive.pointer()} total bytes)`
      );
    });

    archive.on("error", (err) => {
      reject(err);
    });

    // Pipe archive data to the output file
    archive.pipe(output);

    // Append all files and directories from sourceDir
    archive.directory(sourceDir, false);

    // Finalize the archive
    archive.finalize();
  });
}

async function getFolders(sourceDir) {
  try {
    // Specify the directory path
    const directoryPath = sourceDir;

    // Read the directory
    const files = await fs.readdir(directoryPath, { withFileTypes: true });

    // Filter for directories only and get their names
    const folders = files
      .filter((file) => file.isDirectory())
      .map((file) => file.name);

    // console.log(`folders: ${folders}`);
    return folders; // Return the folder names
  } catch (err) {
    console.error("Error reading directory:", err);
    throw err; // Rethrow the error for the caller to handle
  }
}

module.exports = {
  createFolderIfNotExists,
  createFileIfNotExists,
  makeFilesReadable,
  contentFromFile,
  writeToFile,
  fileExists,
  deleteFile,
  copyPasteSourceToDestination,
  copyPasteFileToFolder,
  copyPasteFileContent,
  appendFileContent,
  replaceWordInFile,
  deleteFilesInFolder,
  deleteFilesAndFolders,
  zipFolder,
  getFolders,
};
