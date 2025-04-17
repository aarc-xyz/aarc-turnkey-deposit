export const turnKeyConfig = {
    apiBaseUrl: "https://api.turnkey.com",
    defaultOrganizationId: import.meta.env.VITE_ORGANIZATION_ID
}

export const auth = {
    authConfig: {
        emailEnabled: true,
        passkeyEnabled: false,
        phoneEnabled: false,
        appleEnabled: false,
        facebookEnabled: false,
        googleEnabled: false,
        walletEnabled: false,
    },
    configOrder: ["email"],
    onAuthSuccess: async () => {
        console.log('Auth successful');
        return Promise.resolve();
    },
    onError: (error: any) => {
        console.error('Auth error:', error);
    },
};
