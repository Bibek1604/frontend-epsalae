// src/utils/endpoints.ts
// Complete list of Cart API endpoints with their details

export interface EndpointParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example: string;
}

export interface RequestBody {
  [key: string]: {
    type: string;
    required: boolean;
    description: string;
    example: any;
  };
}

export interface Endpoint {
  id: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  path: string;
  title: string;
  description: string;
  category: string;
  requiresAuth: boolean;
  queryParams?: EndpointParam[];
  pathParams?: EndpointParam[];
  requestBody?: RequestBody;
  exampleResponse: any;
  errorCodes: string[];
  successCode: number;
}

export const CART_ENDPOINTS: Endpoint[] = [
  // ============================================
  // CART MANAGEMENT ENDPOINTS
  // ============================================
  {
    id: 'get-cart',
    method: 'GET',
    path: '/api/cart',
    title: 'Get or Create Cart',
    description: 'Retrieves the current user\'s or guest\'s cart. Creates cart if doesn\'t exist.',
    category: 'Cart Management',
    requiresAuth: false,
    queryParams: [
      {
        name: 'cartId',
        type: 'string',
        required: false,
        description: 'Optional cart ID to retrieve specific cart',
        example: '507f1f77bcf86cd799439001',
      },
    ],
    exampleResponse: {
      success: true,
      statusCode: 200,
      message: 'Cart retrieved successfully',
      data: {
        _id: '507f1f77bcf86cd799439001',
        userId: '507f1f77bcf86cd799439000',
        items: [
          {
            _id: '507f1f77bcf86cd799439013',
            productId: '507f1f77bcf86cd799439011',
            variantId: '507f1f77bcf86cd799439012',
            name: 'T-Shirt Blue',
            sku: 'TS-001-BL',
            price: 29.99,
            quantity: 2,
            image: 'https://cdn.example.com/shirt.jpg',
            attributes: { size: 'M', color: 'Blue' },
            saveForLater: false,
            addedAt: '2026-05-29T10:00:00.000Z',
          },
        ],
        itemsCount: 1,
        subtotal: 59.98,
        status: 'active',
        expiresAt: '2026-06-29T10:30:00.000Z',
        createdAt: '2026-05-29T10:30:00.000Z',
        updatedAt: '2026-05-29T10:30:00.000Z',
      },
      timestamp: '2026-05-29T10:30:00.000Z',
    },
    errorCodes: ['NOT_FOUND', 'DATABASE_ERROR'],
    successCode: 200,
  },

  {
    id: 'add-to-cart',
    method: 'POST',
    path: '/api/cart/items',
    title: 'Add Item to Cart',
    description: 'Adds a product variant to cart with validation. Detects duplicates and merges quantities.',
    category: 'Cart Management',
    requiresAuth: false,
    queryParams: [
      {
        name: 'cartId',
        type: 'string',
        required: false,
        description: 'Optional cart ID',
        example: '507f1f77bcf86cd799439001',
      },
    ],
    requestBody: {
      productId: {
        type: 'string',
        required: true,
        description: 'Product ID (MongoDB ObjectId)',
        example: '507f1f77bcf86cd799439011',
      },
      variantId: {
        type: 'string',
        required: true,
        description: 'Variant ID (MongoDB ObjectId)',
        example: '507f1f77bcf86cd799439012',
      },
      name: {
        type: 'string',
        required: true,
        description: 'Product name',
        example: 'T-Shirt Blue',
      },
      sku: {
        type: 'string',
        required: true,
        description: 'SKU code',
        example: 'TS-001-BL',
      },
      price: {
        type: 'number',
        required: true,
        description: 'Item price (server-set)',
        example: 29.99,
      },
      quantity: {
        type: 'number',
        required: true,
        description: 'Quantity (minimum 1)',
        example: 1,
      },
      image: {
        type: 'string',
        required: true,
        description: 'Product image URL',
        example: 'https://cdn.example.com/shirt.jpg',
      },
      attributes: {
        type: 'object',
        required: false,
        description: 'Product attributes (size, color, etc)',
        example: { size: 'M', color: 'Blue' },
      },
    },
    exampleResponse: {
      success: true,
      statusCode: 201,
      message: 'Item added to cart successfully',
      data: {
        cart: { /* cart object */ },
        itemsCount: 3,
      },
      timestamp: '2026-05-29T10:30:00.000Z',
    },
    errorCodes: ['BAD_REQUEST', 'VALIDATION_ERROR', 'NOT_FOUND'],
    successCode: 201,
  },

  {
    id: 'update-cart-item',
    method: 'PATCH',
    path: '/api/cart/items/:itemId',
    title: 'Update Item Quantity',
    description: 'Updates the quantity of an item in the cart.',
    category: 'Cart Management',
    requiresAuth: false,
    pathParams: [
      {
        name: 'itemId',
        type: 'string',
        required: true,
        description: 'Cart item ID',
        example: '507f1f77bcf86cd799439013',
      },
    ],
    queryParams: [
      {
        name: 'cartId',
        type: 'string',
        required: false,
        description: 'Optional cart ID',
        example: '507f1f77bcf86cd799439001',
      },
    ],
    requestBody: {
      quantity: {
        type: 'number',
        required: true,
        description: 'New quantity (minimum 1)',
        example: 2,
      },
    },
    exampleResponse: {
      success: true,
      statusCode: 200,
      message: 'Item quantity updated',
      data: { /* cart object */ },
      timestamp: '2026-05-29T10:30:00.000Z',
    },
    errorCodes: ['BAD_REQUEST', 'VALIDATION_ERROR', 'NOT_FOUND'],
    successCode: 200,
  },

  {
    id: 'remove-from-cart',
    method: 'DELETE',
    path: '/api/cart/items/:itemId',
    title: 'Remove Item from Cart',
    description: 'Removes a specific item from the cart.',
    category: 'Cart Management',
    requiresAuth: false,
    pathParams: [
      {
        name: 'itemId',
        type: 'string',
        required: true,
        description: 'Cart item ID',
        example: '507f1f77bcf86cd799439013',
      },
    ],
    queryParams: [
      {
        name: 'cartId',
        type: 'string',
        required: false,
        description: 'Optional cart ID',
        example: '507f1f77bcf86cd799439001',
      },
    ],
    exampleResponse: {
      success: true,
      statusCode: 200,
      message: 'Item removed from cart',
      data: { /* cart object */ },
      timestamp: '2026-05-29T10:30:00.000Z',
    },
    errorCodes: ['NOT_FOUND'],
    successCode: 200,
  },

  // ============================================
  // CART UTILITIES
  // ============================================
  {
    id: 'toggle-save-for-later',
    method: 'PATCH',
    path: '/api/cart/items/:itemId/save-for-later',
    title: 'Toggle Save for Later',
    description: 'Toggles the save for later flag on a cart item.',
    category: 'Cart Utilities',
    requiresAuth: false,
    pathParams: [
      {
        name: 'itemId',
        type: 'string',
        required: true,
        description: 'Cart item ID',
        example: '507f1f77bcf86cd799439013',
      },
    ],
    queryParams: [
      {
        name: 'cartId',
        type: 'string',
        required: false,
        description: 'Optional cart ID',
        example: '507f1f77bcf86cd799439001',
      },
    ],
    exampleResponse: {
      success: true,
      statusCode: 200,
      message: 'Item saved for later',
      data: {
        cart: { /* cart object */ },
        saveForLater: true,
      },
      timestamp: '2026-05-29T10:30:00.000Z',
    },
    errorCodes: ['NOT_FOUND'],
    successCode: 200,
  },

  {
    id: 'get-saved-items',
    method: 'GET',
    path: '/api/cart/saved-for-later',
    title: 'Get Saved for Later Items',
    description: 'Retrieves all items that have been saved for later in the cart.',
    category: 'Cart Utilities',
    requiresAuth: false,
    queryParams: [
      {
        name: 'cartId',
        type: 'string',
        required: false,
        description: 'Optional cart ID',
        example: '507f1f77bcf86cd799439001',
      },
    ],
    exampleResponse: {
      success: true,
      statusCode: 200,
      message: 'Saved items retrieved',
      data: [
        {
          _id: '507f1f77bcf86cd799439013',
          productId: '507f1f77bcf86cd799439011',
          name: 'T-Shirt Blue',
          price: 29.99,
          quantity: 1,
          saveForLater: true,
        },
      ],
      timestamp: '2026-05-29T10:30:00.000Z',
    },
    errorCodes: ['NOT_FOUND'],
    successCode: 200,
  },

  {
    id: 'get-cart-count',
    method: 'GET',
    path: '/api/cart/count',
    title: 'Get Cart Items Count',
    description: 'Returns the total number of items currently in the cart.',
    category: 'Cart Utilities',
    requiresAuth: false,
    queryParams: [
      {
        name: 'cartId',
        type: 'string',
        required: false,
        description: 'Optional cart ID',
        example: '507f1f77bcf86cd799439001',
      },
    ],
    exampleResponse: {
      success: true,
      statusCode: 200,
      message: 'Cart count retrieved',
      data: {
        count: 5,
        activeCount: 3,
        savedCount: 2,
        total: 5,
      },
      timestamp: '2026-05-29T10:30:00.000Z',
    },
    errorCodes: [],
    successCode: 200,
  },

  {
    id: 'clear-cart',
    method: 'DELETE',
    path: '/api/cart',
    title: 'Clear Entire Cart',
    description: 'Removes all items from the cart but keeps the cart record.',
    category: 'Cart Utilities',
    requiresAuth: false,
    queryParams: [
      {
        name: 'cartId',
        type: 'string',
        required: false,
        description: 'Optional cart ID',
        example: '507f1f77bcf86cd799439001',
      },
    ],
    exampleResponse: {
      success: true,
      statusCode: 200,
      message: 'Cart cleared successfully',
      data: { /* empty cart object */ },
      timestamp: '2026-05-29T10:30:00.000Z',
    },
    errorCodes: ['NOT_FOUND'],
    successCode: 200,
  },

  {
    id: 'merge-carts',
    method: 'POST',
    path: '/api/cart/merge',
    title: 'Merge Guest Cart to User Cart',
    description: 'Merges a guest\'s cart into the authenticated user\'s cart after login.',
    category: 'Cart Utilities',
    requiresAuth: true,
    requestBody: {
      guestSessionId: {
        type: 'string',
        required: true,
        description: 'Guest session ID',
        example: 'guest-session-uuid-123',
      },
    },
    exampleResponse: {
      success: true,
      statusCode: 200,
      message: 'Carts merged successfully',
      data: {
        cart: { /* cart object */ },
        mergedItems: 3,
      },
      timestamp: '2026-05-29T10:30:00.000Z',
    },
    errorCodes: ['BAD_REQUEST', 'UNAUTHORIZED', 'NOT_FOUND'],
    successCode: 200,
  },
];

// Group endpoints by category
export const getEndpointsByCategory = (endpoints: Endpoint[] = CART_ENDPOINTS) => {
  return endpoints.reduce(
    (acc, endpoint) => {
      if (!acc[endpoint.category]) {
        acc[endpoint.category] = [];
      }
      acc[endpoint.category].push(endpoint);
      return acc;
    },
    {} as Record<string, Endpoint[]>
  );
};

// Get endpoint by ID
export const getEndpointById = (id: string, endpoints: Endpoint[] = CART_ENDPOINTS) => {
  return endpoints.find((ep) => ep.id === id);
};
