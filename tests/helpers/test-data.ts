/**
 * Test data fixtures for Playwright tests
 * Provides sample data for users, posts, messages, and other test scenarios
 */

export const testUsers = {
    standard: {
        email: 'testuser@ojea.test',
        password: 'TestPassword123!',
        username: 'testuser_standard',
    },
    premium: {
        email: 'premium@ojea.test',
        password: 'PremiumPass123!',
        username: 'premium_user',
    },
    creator: {
        email: 'creator@ojea.test',
        password: 'CreatorPass123!',
        username: 'testcreator',
    },
    admin: {
        email: 'admin@ojea.test',
        password: 'AdminPass123!',
        username: 'testadmin',
    },
};

export const testPosts = {
    text: {
        content: 'Ceci est un test post pour Ojea! 🎉',
        visibility: 'public',
    },
    withHashtag: {
        content: 'Testing hashtags #Mexico #CDMX #Test',
        visibility: 'public',
    },
    long: {
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10),
        visibility: 'public',
    },
    withMention: {
        content: 'Hey @testuser check this out!',
        visibility: 'public',
    },
};

export const testMessages = {
    simple: 'Salut! Comment ça va?',
    long: 'Ceci est un message beaucoup plus long pour tester le système de messagerie. '.repeat(5),
    withEmoji: 'Bonjour! 👋 Comment allez-vous aujourd\'hui? 😊',
    withLink: 'Check out this link: https://ojea.app',
};

export const testAIPrompts = {
    imageGeneration: 'Generate a beautiful landscape of Mexico in winter',
    simpleTask: 'Create a simple test image',
    complexTask: 'Generate an artistic portrait with vibrant colors and modern style',
};

export const stripeTestCards = {
    success: {
        number: '4242424242424242',
        expiry: '12/34',
        cvc: '123',
        zip: 'H1A 1A1',
    },
    decline: {
        number: '4000000000000002',
        expiry: '12/34',
        cvc: '123',
        zip: 'H1A 1A1',
    },
    requiresAuth: {
        number: '4000002500003155',
        expiry: '12/34',
        cvc: '123',
        zip: 'H1A 1A1',
    },
};

export const virtualGifts = [
    { name: 'Rose', price: 1 },
    { name: 'Coeur', price: 5 },
    { name: 'Étoile', price: 10 },
    { name: 'Couronne', price: 50 },
];

export const searchQueries = {
    users: ['test', 'creator', 'admin'],
    hashtags: ['#Mexico', '#CDMX', '#Test'],
    content: ['salut', 'bonjour', 'test'],
};

/**
 * Generate random test data
 */
export function generateRandomUser() {
    const timestamp = Date.now();
    return {
        email: `test${timestamp}@ojea.test`,
        password: 'TestPassword123!',
        username: `user_${timestamp}`,
    };
}

export function generateRandomPost() {
    const timestamp = Date.now();
    return {
        content: `Test post created at ${new Date(timestamp).toLocaleString('es-MX')}`,
        visibility: 'public',
    };
}

/**
 * Test viewport sizes for responsive testing
 */
export const viewports = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 },
    largeDesktop: { width: 2560, height: 1440 },
};

/**
 * Common French UI text strings
 */
export const uiText = {
    login: 'Connexion',
    signup: 'Inscription',
    logout: 'Déconnexion',
    feed: 'Fil d\'actualité',
    profile: 'Profil',
    settings: 'Paramètres',
    messages: 'Messages',
    notifications: 'Notifications',
    explore: 'Explorer',
    guestMode: 'Continuer en tant qu\'invité',
};
