const fs = require("fs");
const path = require("path");

const target = "/Users/swastikdey/document/node_modules";
const source = "/Users/swastikdey/claud/node_modules";

try {
  // Delete the existing node_modules directory if it exists
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
    console.log("Deleted existing empty node_modules folder.");
  }

  // Create symlink
  fs.symlinkSync(source, target, "dir");
  console.log("Successfully symlinked claud/node_modules to document/node_modules!");
} catch (err) {
  console.error("Symlink operation failed:", err.message);
  process.exit(1);
}
