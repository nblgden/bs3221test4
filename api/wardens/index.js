const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY
});

const database = client.database('fire-warden-db');
const container = database.container('wardens');

module.exports = async function (context, req) {
  context.log('Wardens API called');

  try {
    switch (req.method) {
      case 'GET':
        const { resources } = await container.items.readAll().fetchAll();
        context.res = {
          status: 200,
          body: resources
        };
        break;

      case 'POST':
        const newWarden = {
          ...req.body,
          timestamp: new Date().toISOString()
        };
        const { resource } = await container.items.create(newWarden);
        context.res = {
          status: 201,
          body: resource
        };
        break;

      case 'DELETE':
        const id = req.params.id;
        await container.item(id).delete();
        context.res = {
          status: 204
        };
        break;

      default:
        context.res = {
          status: 405,
          body: 'Method not allowed'
        };
    }
  } catch (error) {
    context.log.error('Error:', error);
    context.res = {
      status: 500,
      body: 'Internal server error'
    };
  }
}; 