const { CosmosClient } = require('@azure/cosmos');

let client, database, container;

// Initialize Cosmos DB client
function initializeCosmosClient(context) {
    try {
        // Get connection string from environment variables
        const connectionString = process.env.COSMOS_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error('COSMOS_CONNECTION_STRING environment variable is not set');
        }

        // Parse connection string
        const endpoint = connectionString.split(';').find(s => s.startsWith('AccountEndpoint='))?.split('=')[1];
        const key = connectionString.split(';').find(s => s.startsWith('AccountKey='))?.split('=')[1];

        if (!endpoint || !key) {
            throw new Error('Invalid connection string format');
        }

        context.log('Connecting to Cosmos DB at:', endpoint);

        client = new CosmosClient({ endpoint, key });
        database = client.database('bs3221cosmosdb');
        container = database.container('wardens');
    } catch (error) {
        context.log.error('Failed to initialize Cosmos DB client:', error);
        throw error;
    }
}

// Test database connection
async function testConnection(context) {
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
        // Initialize client if not already initialized
        if (!client) {
            initializeCosmosClient(context);
        }

        // Test connection first
        await testConnection(context);

        switch (req.method) {
            case 'GET':
                context.log('Fetching all wardens');
                const { resources } = await container.items.readAll().fetchAll();
                context.res = {
                    status: 200,
                    body: resources
                };
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
                if (!id) {
                    throw new Error('Warden ID is required for deletion');
                }
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
        
        // Set appropriate status code based on error type
        const statusCode = error.code === 404 ? 404 : 
                          error.code === 409 ? 409 : 
                          error.code === 400 ? 400 : 500;

        context.res = {
            status: statusCode,
            body: {
                error: statusCode === 500 ? 'Internal server error' : error.message,
                details: error.details || error.message,
                code: error.code
            }
        };
    }
}; 