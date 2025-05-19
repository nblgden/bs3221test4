const { CosmosClient } = require('@azure/cosmos');

// Get connection string from environment variables
const connectionString = process.env.COSMOS_CONNECTION_STRING;
if (!connectionString) {
    throw new Error('COSMOS_CONNECTION_STRING environment variable is not set');
}

// Parse connection string
const endpoint = connectionString.split(';').find(s => s.startsWith('AccountEndpoint=')).split('=')[1];
const key = connectionString.split(';').find(s => s.startsWith('AccountKey=')).split('=')[1];

context.log('Connecting to Cosmos DB at:', endpoint);

const client = new CosmosClient({ endpoint, key });
const database = client.database('bs3221cosmosdb');
const container = database.container('wardens');

// Test database connection
async function testConnection() {
    try {
        await database.read();
        context.log('Successfully connected to database');
    } catch (error) {
        context.log.error('Database connection error:', error);
        throw new Error(`Failed to connect to database: ${error.message}`);
    }
}

module.exports = async function (context, req) {
    context.log('Wardens API called with method:', req.method);

    try {
        // Test connection first
        await testConnection();

        switch (req.method) {
            case 'GET':
                context.log('Fetching all wardens');
                try {
                    const { resources } = await container.items.readAll().fetchAll();
                    context.log('Successfully fetched wardens:', resources);
                    context.res = {
                        status: 200,
                        body: resources,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                } catch (error) {
                    context.log.error('Error fetching wardens:', error);
                    throw new Error(`Failed to fetch wardens: ${error.message}`);
                }
                break;

            case 'POST':
                context.log('Creating new warden:', req.body);
                if (!req.body) {
                    throw new Error('Request body is required');
                }
                const newWarden = {
                    ...req.body,
                    id: Date.now().toString(), // Add explicit ID
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
                context.log('Deleting warden with ID:', id);
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
        context.log.error('Detailed error:', {
            message: error.message,
            code: error.code,
            stack: error.stack,
            details: error.details
        });
        context.res = {
            status: 500,
            body: {
                error: 'Internal server error',
                details: error.message,
                code: error.code
            }
        };
    }
}; 