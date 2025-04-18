export const turnKeyConfig = {
    apiBaseUrl: "https://api.turnkey.com",
    defaultOrganizationId: import.meta.env.VITE_ORGANIZATION_ID
}

export const auth = {
    authConfig: {
        emailEnabled: true,
        passkeyEnabled: false,
        phoneEnabled: true,
        appleEnabled: false,
        facebookEnabled: false,
        googleEnabled: false,
        walletEnabled: false,
    },
    configOrder: ["email", "phone"],
    onError: (error: any) => {
        console.error('Auth error:', error);
    },
};
