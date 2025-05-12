const propertyModel = require('../models/propertyModels');

// Add a new property
const addProperty = async (property) => {
  try {
    const propertyId = await propertyModel.addProperty(property);
    return { success: true, propertyId };
  } catch (err) {
    return { success: false, message: 'Error adding property: ' + err.message };
  }
};

// Get property by ID
const getPropertyById = async (propertyId) => {
  try {
    const property = await propertyModel.getPropertyById(propertyId);
    if (property) {
      return { success: true, property };
    } else {
      return { success: false, message: 'Property not found' };
    }
  } catch (err) {
    return { success: false, message: 'Error retrieving property: ' + err.message };
  }
};

// Get all properties with optional filters
const getAllProperties = async (filters) => {
  try {
    const properties = await propertyModel.getAllProperties(filters);
    return properties;
  } catch (err) {
    return { success: false, message: 'Error retrieving properties: ' + err.message };
  }
};

// Check if the property ID is available
const isPropertyIdFree = async (propertyId) => {
  try {
    return await propertyModel.isPropertyIdFree(propertyId);
  } catch (err) {
    return { success: false, message: 'Error checking property ID availability: ' + err.message };
  }
};

// Check if the property title is available
const isPropertyTitleFree = async (title) => {
  try {
    return await propertyModel.isPropertyTitleFree(title);
  } catch (err) {
    return { success: false, message: 'Error checking property title availability: ' + err.message };
  }
};

// Update an existing property
const updateProperty = async (propertyId, updatedProperty) => {
  try {
    const changes = await propertyModel.updateProperty(propertyId, updatedProperty);
    if (changes > 0) {
      return { success: true, changes };
    } else {
      return { success: false, message: 'No changes made to the property' };
    }
  } catch (err) {
    return { success: false, message: 'Error updating property: ' + err.message };
  }
};

// Delete a property by ID
const deleteProperty = async (propertyId) => {
  try {
    const changes = await propertyModel.deleteProperty(propertyId);
    if (changes > 0) {
      return { success: true, changes };
    } else {
      return { success: false, message: 'Property not found or already deleted' };
    }
  } catch (err) {
    return { success: false, message: 'Error deleting property: ' + err.message };
  }
};

// Mark property as sold
const markAsSold = async (propertyId) => {
  try {
    const changes = await propertyModel.updateAsSold(propertyId);
    if (changes > 0) {
      return { success: true, changes };
    } else {
      return { success: false, message: 'Property not found or already deleted' };
    }
  } catch (err) {
    return { success: false, message: 'Error deleting property: ' + err.message };
  }
};

// Get the latest 6 properties
const latesProperty = async () => {
  try {
    return await propertyModel.getFirstSixProperties();
  } catch (error) {
    throw error;
  }
};

// Filter properties
const filterProperties = async (filters) => {
  try {
    return await propertyModel.getAllProperties(filters);
  
  } catch (error) {
    throw error;
  }
};

// Get property by slug title
const getPropertyByTitleService = async (slug) => {
  try {
    return await propertyModel.getPropertyByTitle(slug);
  } catch (error) {
    throw new Error(`Service layer error: ${error.message}`);
  }
};

module.exports = {
  addProperty,
  getPropertyById,
  getAllProperties,
  isPropertyIdFree,
  isPropertyTitleFree,
  updateProperty,
  deleteProperty,
  markAsSold,
  latesProperty,
  filterProperties,
  getPropertyByTitleService,
};
