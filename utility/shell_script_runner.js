// handlers/ShellScriptRunner.js
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

class ShellScriptRunner {
  /**
   * Execute a shell script with arguments
   * @param {string} scriptPath - Full path to the script file or script name in scripts directory
   * @param {Array} args - Array of arguments to pass to the script
   * @param {Object} options - Configuration options
   * @returns {Promise} Promise that resolves with script result
   */
  static async runScript(scriptPath, args = [], options = {}) {
    // Resolve the script path
    let resolvedScriptPath;

    if (path.isAbsolute(scriptPath)) {
      // Use absolute path as is
      resolvedScriptPath = scriptPath;
    } else if (scriptPath.includes("/") || scriptPath.includes("\\")) {
      // Relative path with directories
      resolvedScriptPath = path.resolve(process.cwd(), scriptPath);
    } else {
      // Just script name - look in scripts directory
      resolvedScriptPath = path.join(__dirname, "..", "scripts", scriptPath);
    }

    // Check if script exists and is executable
    try {
      await this.checkScriptAccess(resolvedScriptPath);
    } catch (error) {
      throw new Error(`Script access error: ${error.message}`);
    }

    const defaultOptions = {
      cwd: path.dirname(resolvedScriptPath), // Use script's directory as cwd
      timeout: 30000, // 30 seconds timeout
      shell: true,
      realtimeOutput: false,
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return new Promise((resolve, reject) => {
      console.log(`📁 Executing: ${resolvedScriptPath}`);
      console.log(`📝 Arguments: ${args.join(" ")}`);
      console.log(`📂 Working directory: ${mergedOptions.cwd}`);

      const child = spawn(resolvedScriptPath, args, mergedOptions);

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (data) => {
        const output = data.toString();
        stdout += output;

        if (mergedOptions.realtimeOutput) {
          process.stdout.write(`[STDOUT] ${output}`);
        }
      });

      child.stderr.on("data", (data) => {
        const output = data.toString();
        stderr += output;

        if (mergedOptions.realtimeOutput) {
          process.stderr.write(`[STDERR] ${output}`);
        }
      });

      // Handle timeout
      let timeoutId;
      if (mergedOptions.timeout) {
        timeoutId = setTimeout(() => {
          child.kill("SIGTERM");
          reject(new Error(`Process timeout after ${mergedOptions.timeout}ms`));
        }, mergedOptions.timeout);
      }

      child.on("close", (code) => {
        if (timeoutId) clearTimeout(timeoutId);

        const result = {
          exitCode: code,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          success: code === 0,
          scriptPath: resolvedScriptPath,
          args: args,
          timestamp: new Date().toISOString(),
        };

        console.log(`✅ Script exited with code ${code}`);

        if (code === 0) {
          resolve(result);
        } else {
          const error = new Error(`Script failed with exit code ${code}`);
          error.result = result;
          reject(error);
        }
      });

      child.on("error", (error) => {
        if (timeoutId) clearTimeout(timeoutId);
        console.error(`❌ Error executing script:`, error);
        reject(new Error(`Failed to execute script: ${error.message}`));
      });
    });
  }

  /**
   * Check if script exists and is executable
   * @param {string} scriptPath - Path to the script
   * @returns {Promise} Promise that resolves if script is accessible
   */
  static async checkScriptAccess(scriptPath) {
    return new Promise((resolve, reject) => {
      fs.access(scriptPath, fs.constants.F_OK | fs.constants.X_OK, (err) => {
        if (err) {
          if (err.code === "ENOENT") {
            reject(new Error(`Script not found: ${scriptPath}`));
          } else if (err.code === "EACCES") {
            reject(new Error(`Script not executable: ${scriptPath}`));
          } else {
            reject(new Error(`Cannot access script: ${err.message}`));
          }
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Run multiple scripts sequentially with full paths
   * @param {Array} scripts - Array of script configurations
   * @returns {Promise} Promise that resolves with all results
   */
  static async runScriptsSequentially(scripts) {
    const results = [];
    for (const script of scripts) {
      try {
        console.log(`🔄 Running script: ${script.path || script.name}`);
        const result = await this.runScript(
          script.path || script.name,
          script.args || [],
          script.options || {}
        );
        results.push({ success: true, result });
        console.log(`✅ Script completed: ${script.path || script.name}`);
      } catch (error) {
        console.error(
          `❌ Script failed: ${script.path || script.name}`,
          error.message
        );
        results.push({
          success: false,
          error: error.message,
          result: error.result || null,
        });
        // Stop execution if one script fails (optional)
        if (script.stopOnFailure) {
          throw error;
        }
      }
    }
    return results;
  }

  /**
   * Utility method to resolve script path
   * @param {string} scriptInput - Script name or path
   * @returns {string} Resolved absolute path
   */
  static resolveScriptPath(scriptInput) {
    if (path.isAbsolute(scriptInput)) {
      return scriptInput;
    } else if (scriptInput.includes("/") || scriptInput.includes("\\")) {
      return path.resolve(process.cwd(), scriptInput);
    } else {
      return path.join(__dirname, "..", "scripts", scriptInput);
    }
  }
}

module.exports = ShellScriptRunner;
