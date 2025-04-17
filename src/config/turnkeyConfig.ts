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
        googleEnabled: true,
        walletEnabled: false,
    },
    configOrder: ["email", "google"],
    onError: (error: any) => {
        console.error('Auth error:', error);
    },
};
