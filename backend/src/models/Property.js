class Property {
  constructor({
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
    sellerName,
    telephone,
    photos,  // Expecting an array of photo paths
  }) {
    this.propertyId = propertyId;
    this.title = title;
    this.orientation = orientation;
    this.propertyType = propertyType;
    this.propertyCondition = propertyCondition;
    this.usefulArea = usefulArea;
    this.totalArea = totalArea;
    this.bedrooms = bedrooms;
    this.bathrooms = bathrooms;
    this.floor = floor;
    this.yearOfConstruction = yearOfConstruction;
    this.price = price;
    this.ibi = ibi;
    this.community = community;
    this.description = description;
    this.town = town;
    this.postalCode = postalCode;
    this.street = street;
    this.latitude = latitude;
    this.longitude = longitude;
    this.sellerName = sellerName;
    this.telephone = telephone;
    this.photos = photos;  // Store the array of photo paths
  }
}

module.exports = Property;
