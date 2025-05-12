const addedPropertyServices = require('../services/propertyService');
const folderServices = require('../services/folderService');
const normalizeTitle = require('../utils/helpeFunctions');
const { param } = require('../routes/userRoutes');

const addProperty = async (req, res) => {
  try {
    let { title, propertyId } = req.body;
    title = normalizeTitle.normalizeTitle(title);
    req.body.title = title;

    const isTitleFree = await addedPropertyServices.isPropertyTitleFree(title);
    const isPropertyIdFree = await addedPropertyServices.isPropertyIdFree(propertyId);

    if (!isTitleFree) {
      return res.status(409).json({ error: "title", message: "Title is already in use." });
    }

    if (!isPropertyIdFree) {
      return res.status(409).json({ error: "id", message: "Property ID is already in use." });
    }

    const files = req.files;
    const filesNames = files ? files.map(file => file.filename) : [];
    const updatedPaths = await folderServices.newPaths(filesNames, title);

    const propertyData = {
      ...req.body,
      photos: updatedPaths
    };

    const addedProperty = await addedPropertyServices.addProperty(propertyData);

    await folderServices.createTempFolder();
    await folderServices.moveTempToFinal();
    await folderServices.deleteTempFOlder();

    return res.status(201).json({
      message: "Property added successfully",
      property: addedProperty
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const allProperties = await addedPropertyServices.getAllProperties();
    return res.status(200).json(allProperties);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch properties', error: error.message });
  }
};

const deleteProperty = async (req, res) => {
  let { title } = req.query;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  title = normalizeTitle.standardizeNameWithUnderscore(title);

  try {
    const deleteFolder = await folderServices.deleteFolder(title);
    if (!deleteFolder) {
      return res.status(400).json({ message: 'Failed to delete folder' });
    }

    const results = await addedPropertyServices.deleteProperty(title);
    if (results) {
      return res.status(200).json({ message: 'Deleted successfully' });
    } else {
      return res.status(400).json({ message: 'Property not found or deletion failed' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

const markAsSold = async (req, res) => {
  const { id } = req.query;
  try {
    await addedPropertyServices.markAsSold(id);
    return res.status(200).json({ message: 'Update Success' });
  } catch (err) {
    return res.status(500).json({ message: 'Update failed' });
  }
};

const latesProperty = async (req, res) => {
  try {
    const properties = await addedPropertyServices.latesProperty();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve properties' });
  }
};

const searchProperties = async (req, res) => {
  try {
    const searchParams = req.query;
  
    const properties = await addedPropertyServices.getAllProperties(searchParams);
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve properties' });
  }
};

const fetchProperty = async (req, res) => {
  try {
    let { title } = req.params;
    title = normalizeTitle.normalizeTitleUrl(title);
    const property = await addedPropertyServices.getPropertyByTitleService(title);
    console.log("propert",property)
    return res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const editProperty = async (req,res) => {
   console.log("res",res);
   return res.status(200);
}

module.exports = {
  addProperty,
  getAllProperties,
  deleteProperty,
  markAsSold,
  latesProperty,
  searchProperties,
  fetchProperty,
  editProperty
};
