import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tasks API',
            version: '1.0.0',
            description: 'A simple Task API',
        },
        components: {
            schemas: {
                Task: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'The task ID',
                            example: 1,
                        },
                        title: {
                            type: 'string',
                            description: 'The task title',
                            example: 'My new task',
                        },
                        completed: {
                            type: 'boolean',
                            description: 'The task completion status',
                            example: false,
                        }
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    msg: {
                                        type: 'string',
                                        description: 'The error message',
                                        example: 'ID must be greater than 0',
                                    },
                                },
                            },
                        }
                    }
                }
            },
        },
        tags: [
            {
                name: 'task',
                description: 'CRUD operations for tasks',
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
export default swaggerDocs;