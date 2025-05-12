const db = require('../config/database');  // Import the SQLite DB connection

// Add a new property to the properties table
const addProperty = async (propertyData) => {
  try {
    const {
      propertyId,
      title,
      orientation,
      propertyType,
      propertyCondition,
      usefulArea,
      totalArea,
      bedrooms,
      bathrooms,
      floor,
      yearOfConstruction,
      price,
      ibi,
      community,
      description,
      town,
      postalCode,
      street,
      latitude,
      longitude,
      items,
      sellerName,
      telephone,
      photos
    } = propertyData;

 
    // Serialize arrays
    const serializedItems = JSON.stringify(items);
    const serializedPhotos = JSON.stringify(photos);

    const values = [
      propertyId, title, orientation || null, propertyType || null, propertyCondition || null,
      usefulArea || null, totalArea || null, bedrooms || null, bathrooms || null, floor || null, 
      yearOfConstruction || null, price || null, ibi || null, community || null, description || null, 
      town || null, postalCode || null, street || null, latitude || null, longitude || null, 
      serializedItems, sellerName || null, telephone || null, serializedPhotos
    ];
    
    const query = `
      INSERT INTO properties (
        property_id, title, orientation, property_type, property_condition,
        useful_area, total_area, bedrooms, bathrooms, floor, year_of_construction,
        price, ibi, community, description, town, postal_code, street,
        latitude, longitude, items, seller_name, telephone, photos
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    
  

    await db.run(query, values);

    return { message: "Property added successfully" };

  } catch (error) {
    console.error("Error in propertyService.addProperty:", error);
    throw new Error("Error adding property: " + error.message);
  }
};

// Get a property by its ID
const getPropertyById = async (propertyId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM properties WHERE property_id = ?
    `;
    db.get(query, [propertyId], (err, row) => {
      if (err) {
        reject(new Error('Error retrieving property: ' + err.message));
      } else if (row) {
        resolve(row); // Return the property
      } else {
        resolve(null); // No property found
      }
    });
  });
};



// Helper to handle filters like "6+" (minimum value)
const handleMinValueFilter = (columnName, value, filterConditions, params) => {
  if (value.toString().includes('plus')) {
    const min = parseInt(value, 10);
    filterConditions.push(`${columnName} >= ?`);
    params.push(min);
  } else {
    filterConditions.push(`${columnName} = ?`);
    params.push(value);
  }
};

// Get all properties with optional filters
const getAllProperties = async (filters = {}) => {

  


  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM properties';
    const params = [];
    const filterConditions = [];

    const filterMap = {
      property_id: 'property_id = ?',
      location: 'town = ?',
      number_of_rooms: 'bedrooms = ?',
      price_range: 'price BETWEEN ? AND ?',
      property_condition: 'property_condition = ?',
      property_type: 'property_type = ?',
      bathrooms: 'bathrooms = ?',
    };

    
    const specialHandlers = {
      price_range: (value) => {
        if (value.includes('plus')) {
          const min = parseInt(value);
          filterConditions.push('price >= ?');
          console.log("plus",min);
          params.push(min);
        } else {
          const [min, max] = value.split('-');
          filterConditions.push(filterMap.price_range);
          params.push(min, max);
        }
      },
      location: (value) => {
        console.log("location",filterMap.location)
        filterConditions.push(filterMap.location);
        params.push(`%${value}%`);
        console.log("location",);
      },
      number_of_rooms: (value) => {
        handleMinValueFilter('bedrooms', value, filterConditions, params);
      },
      bathrooms: (value) => {
        handleMinValueFilter('bathrooms', value, filterConditions, params);
      },
    };

    // Apply filters
    for (const key in filterMap) {
      const value = filters[key];
      if (!value || value === 'undefined') continue;

      if (specialHandlers[key]) {
        specialHandlers[key](value);
      } else {
        filterConditions.push(filterMap[key]);
        params.push(value);
      }
    }

    // Finalize query
    if (filterConditions.length > 0) {
      query += ' WHERE ' + filterConditions.join(' AND ');
    }

    // Execute query
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(new Error('Error retrieving properties: ' + err.message));
      } else {
        resolve(rows);
      }
    });
  });
};

// Check if a property ID is available (not already taken)
const isPropertyIdFree = async (propertyId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 1 FROM properties WHERE property_id = ?
    `;
    db.get(query, [propertyId], (err, row) => {
      if (err) {
        reject(new Error('Error checking property ID availability: ' + err.message));
      } else {
        resolve(row === undefined); // If no row is found, the ID is free
      }
    });
  });
};

// Check if a property title is available (not already taken)
const isPropertyTitleFree = async (title) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 1 FROM properties WHERE title = ?
    `;
    db.get(query, [title], (err, row) => {
      if (err) {
        reject(new Error('Error checking property title availability: ' + err.message));
      } else {
        resolve(row === undefined); // If no row is found, the title is free
      }
    });
  });
};

// Update an existing property by its ID
const updateProperty = async (propertyId, updatedPropertyData) => {
  const {
    title, orientation, property_type, property_condition, useful_area,
    total_area, bedrooms, bathrooms, floor, year_of_construction, price, ibi, community,
    description, town, postal_code, street, latitude, longitude, seller_name, telephone
  } = updatedPropertyData;

  return new Promise((resolve, reject) => {
    const query = `
      UPDATE properties SET
        title = ?, orientation = ?, property_type = ?, property_condition = ?, useful_area = ?,
        total_area = ?, bedrooms = ?, bathrooms = ?, floor = ?, year_of_construction = ?, price = ?,
        ibi = ?, community = ?, description = ?, town = ?, postal_code = ?, street = ?, latitude = ?,
        longitude = ?, seller_name = ?, telephone = ?
      WHERE property_id = ?
    `;
    db.run(query, [
      title, orientation, property_type, property_condition, useful_area, total_area, bedrooms,
      bathrooms, floor, year_of_construction, price, ibi, community, description, town, postal_code,
      street, latitude, longitude, seller_name, telephone, propertyId
    ], function (err) {
      if (err) {
        reject(new Error('Error updating property: ' + err.message));
      } else {
        resolve(this.changes); // Return the number of rows affected
      }
    });
  });
};

// Delete a property by its ID
const deleteProperty = async (propertyId) => {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM properties WHERE title = ?
    `;
    db.run(query, [propertyId], function (err) {
      if (err) {
        reject(new Error('Error deleting property: ' + err.message));
      } else {
        resolve(this.changes); // Return the number of rows affected
      }
    });
  });
};

const updateAsSold = async (propertyId) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE properties
      SET status = 0
      WHERE property_id = ?
    `;
    db.run(query, [propertyId], function (err) {
      if (err) {
        reject(new Error('Error updating property as sold: ' + err.message));
      } else {
        resolve(this.changes); // Number of rows updated
      }
    });
  });
};


const getFirstSixProperties = async () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM properties LIMIT 6';

    db.all(query, [], (err, rows) => {
      if (err) {
        reject(new Error('Error retrieving properties: ' + err.message));
      } else {
        resolve(rows);
      }
    });
  });
};


const getPropertyByTitle = (slug) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM properties WHERE LOWER(title) = LOWER(?) LIMIT 1',
      [slug],
      (err, row) => {
        if (err) return reject(err);
        if (!row) return reject(new Error('Property not found'));
        resolve(row);
      }
    );
  });
};


module.exports = {
  addProperty,
  getPropertyById,
  getAllProperties,
  isPropertyIdFree,
  isPropertyTitleFree,
  updateProperty,
  deleteProperty,
  updateAsSold,
  getFirstSixProperties,
  getPropertyByTitle,
};
