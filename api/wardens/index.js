const { CosmosClient } = require('@azure/cosmos');

// Get connection string from environment variables
const connectionString = process.env.COSMOS_CONNECTION_STRING;
if (!connectionString) {
    throw new Error('COSMOS_CONNECTION_STRING environment variable is not set');
}

// Parse connection string
const endpoint = connectionString.split(';').find(s => s.startsWith('AccountEndpoint=')).split('=')[1];
const key = connectionString.split(';').find(s => s.startsWith('AccountKey=')).split('=')[1];

const client = new CosmosClient({ endpoint, key });
const database = client.database('bs3221cosmosdb');
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