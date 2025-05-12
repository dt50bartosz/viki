const fs = require('fs').promises;
const path = require('path');
const newName = require('../utils/helpeFunctions');
const { move } = require('../routes/userRoutes');

// Helper function to check if folder exists
async function folderExists(folderPath) {
  try {
    await fs.access(folderPath); // This will throw an error if the folder does not exist
    return true; // Folder exists
  } catch (err) {
    return false; // Folder does not exist
  }
}

async function renameFolder(name) {
  try {
    const oldPath = path.resolve('src/uploads/temp_folder');
    const standardizedName = newName.standardizeNameWithUnderscore(name);
    const newPath = path.resolve(`src/uploads/${standardizedName}`);

    // Check if the old folder exists
    const files = await fs.readdir(oldPath);
    console.log('Files inside temp_folder before rename:', files);

    // Check if the new path exists and handle it
    try {
      await fs.stat(newPath);
      console.error(`Folder with the name '${standardizedName}' already exists.`);
      return;
    } catch (err) {
      // The new folder does not exist, so we can proceed with renaming
      if (err.code !== 'ENOENT') {
        throw err; // Something went wrong other than folder not existing
      }
    }

    // Rename the folder
    await fs.rename(oldPath, newPath);
    console.log(`Folder renamed from '${oldPath}' to '${newPath}'`);
  } catch (err) {
    console.error('Error renaming folder:', err);
  }
}

function newPaths(fileNames, name) {
  const standardizedName = newName.standardizeNameWithUnderscore(name);
  const basePath = `/uploads/${standardizedName}`;

  // Call renameFolder before creating paths
  renameFolder(standardizedName);

  const paths = fileNames.map(filePath => {
    const fileName = path.basename(filePath); // get just the filename
    return `${basePath}/${fileName}`; // build the relative path
  });

  return paths;
}

async function deleteFolder(folderName) {
  const folderPath = path.resolve(`src/uploads/${folderName}`);

  try {
    // Check if the folder exists
    const folderExistsResult = await folderExists(folderPath); // Ensure this function is called after definition
    if (!folderExistsResult) {
      console.log("Folder does not exist, nothing to delete.");
      return true; // Return true if folder does not exist
    }

    const results = await deleteFolderRecursive(folderPath);
    console.log("Results:", results);
    return true; // Return true when the folder is successfully deleted
  } catch (err) {
    console.error('Error deleting folder:', err);
    return false; // Return false if there was an error
  }
}

async function deleteFolderRecursive(folderPath) {
  try {
    const files = await fs.readdir(folderPath);
    for (const file of files) {
      const currentPath = path.join(folderPath, file);
      const stat = await fs.lstat(currentPath);

      if (stat.isDirectory()) {
        await deleteFolderRecursive(currentPath); // Recursively delete subfolders
      } else {
        await fs.unlink(currentPath); // Delete file
      }
    }
    await fs.rmdir(folderPath); // Remove the empty directory
    return true; // Folder is successfully deleted
  } catch (err) {
    console.error("Error deleting folder:", err);
    return false; // Return false if there was an error
  }
}

const createTempFolder = async (filesNames, title) => {
  const folderPath = path.resolve(`src/uploads/temp_folder`);
  try {
    await fs.mkdir(folderPath, { recursive: true });

    for (const fileName of filesNames) {
      const oldPath = path.join(__dirname, 'uploads', fileName);
      const newPath = path.join(folderPath, fileName);
      await fs.rename(oldPath, newPath);
    }

    return folderPath;
  } catch (error) {
    console.error("Error creating or populating temp folder:", error);
    throw error;
  }
};

const moveTempToFinal = async (title) => {
  const tempFolderPath = path.resolve(`src/uploads/temp_folder`);
  const finalFolderPath = path.resolve(`src/uploads/${title}`);

  try {
    await fs.mkdir(path.dirname(finalFolderPath), { recursive: true });

    // Copy everything from temp to final/title
    await fs.cp(tempFolderPath, finalFolderPath, { recursive: true });

    // Clean up temp folder after copy
    await fs.rm(tempFolderPath, { recursive: true, force: true });

    return finalFolderPath;
  } catch (error) {
    console.error("Error moving folder:", error);
    throw error;
  }
};

const deleteTempFolder = async () => {
  const folderPath = path.resolve(`src/uploads/temp_folder`);

  try {
    const results = await deleteFolderRecursive(folderPath);
    console.log("results", results);
    return true; // Return true when the folder is successfully deleted
  } catch (err) {
    console.error('Error deleting folder:', err);
    return false; // Return false if there was an error
  }
};

module.exports = { newPaths, deleteFolder, moveTempToFinal, createTempFolder, deleteTempFolder };
