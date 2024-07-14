const cds = require('@sap/cds');
const destHelper = require("./DestHelper");
const destinationServiceInstanceName = "notif-sender-destination-service"
const axios = require('axios');

/**
 * Fetches all entries from the specified entity.
 * @param {string} entityName - The name of the entity to fetch.
 * @returns {Promise<Array>} - A promise that resolves to an array of entity entries.
 */
async function fetchAllEntries(entityName) {
  // Ensure the CDS framework is ready
  await cds.connect();

  // Access the entity
  const entity = cds.entities[entityName];
  if (!entity) {
    throw new Error(`Entity ${entityName} not found`);
  }

  // Fetch all entries from the entity
  const entries = await cds.run(SELECT.from(entity));
  return entries;
}

/**
 * Fetches a single entry by its ID from the specified entity.
 * @param {string} entityName - The name of the entity to fetch.
 * @param {string} id - The ID of the entry to fetch.
 * @returns {Promise<Object|null>} - A promise that resolves to the entity entry or null if not found.
 */
async function fetchEntryById(entityName, id) {
  // Ensure the CDS framework is ready
  await cds.connect();

  // Access the entity
  const entity = cds.entities[entityName];
  if (!entity) {
    throw new Error(`Entity ${entityName} not found`);
  }

  // Fetch the entry by ID
  const entry = await cds.run(SELECT.one.from(entity).where({ type: id }));
  return entry;
}

/**
 * Fetches a single entry by its documentType from the specified entity.
 * @param {string} entityName - The name of the entity to fetch.
 * @param {string} docType - The docType of the entry to fetch.
 * @returns {Promise<Object|null>} - A promise that resolves to the entity entry or null if not found.
 */
async function  fetchEntryForTemplate(vendor, docType, messageType) {
  let destinationName = "SELF_SRV";
  let selfDest = await destHelper.getDestination(destinationServiceInstanceName, destinationName);
  const params = `$filter=vendor eq '${vendor}' and documentType eq '${docType}' and msgType eq '${messageType}'`;
  // let local= "http://localhost:4004";
  try {
    console.log("URL 1"+`${selfDest.destDetails.URL}`)
    const response = await axios.get(`${selfDest.destDetails.URL}/msgmstdata/templates?${params}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${selfDest.authDetails[0].value}`
      }
  });
    return response.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw new Error('Failed to fetch templates');
  }
  
}

/**
 * Fetches a single entry by its Communication type and Client from the specified entity.
 * @param {string} entityName - The name of the entity to fetch.
 * @param {string} type - The type of the entry to fetch.
 * @returns {Promise<Object|null>} - A promise that resolves to the entity entry or null if not found.
 */
async function  fetchEntryForConfiguration(vendor, msgType) {
  let destinationName = "SELF_SRV";
  let selfDest = await destHelper.getDestination(destinationServiceInstanceName, destinationName);
  const params = `$filter=vendor eq '${vendor}' and msgType eq '${msgType}'`;
  // let local= "http://localhost:4004";
  try {
    console.log("URL"+`${selfDest.destDetails.URL}`)
    const response = await axios.get(`${selfDest.destDetails.URL}/msgmstdata/configuration?${params}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${selfDest.authDetails[0].value}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching configuration:', error);
    throw new Error('Failed to fetch configuration');
  }
}
module.exports = {
  fetchAllEntries,
  fetchEntryById,
  fetchEntryForTemplate,
  fetchEntryForConfiguration
};
