const cds = require('@sap/cds');

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
async function  fetchEntryByDocumentType(entityName, docType) {
  // Ensure the CDS framework is ready
  await cds.connect();

  // Access the entity
  const entity = cds.entities[entityName];
  if (!entity) {
    throw new Error(`Entity ${entityName} not found`);
  }

  // Fetch the entry by ID
  const entry = await cds.run(SELECT.one.from(entity).where({ documentType: docType }));
  return entry;
}

/**
 * Fetches a single entry by its Communication type and Client from the specified entity.
 * @param {string} entityName - The name of the entity to fetch.
 * @param {string} type - The type of the entry to fetch.
 * @returns {Promise<Object|null>} - A promise that resolves to the entity entry or null if not found.
 */
async function  fetchEntryByCommunicationType(entityName, type, vendor) {
  // Ensure the CDS framework is ready
  await cds.connect();

  // Access the entity
  const entity = cds.entities[entityName];
  if (!entity) {
    throw new Error(`Entity ${entityName} not found`);
  }

  // Fetch the entry by ID
  const entry = await cds.run(SELECT.one.from(entity).where({ type: type }).and({client: vendor}));
  return entry;
}
module.exports = {
  fetchAllEntries,
  fetchEntryById,
  fetchEntryByDocumentType,
  fetchEntryByCommunicationType
};
