import {
    FKConfig,
    ThemeName,
    TransactionSuccessData,
    TransactionErrorData,
    SourceConnectorName
} from "@aarc-xyz/fundkit-web-sdk";
import { AarcConfig } from '../types/aarc';

export const createAarcConfig = ({
    walletAddress,
    customerId,
    onSuccess,
    onError,
    onClose,
    onOpen
}: AarcConfig): FKConfig => ({
    appName: "Dynamic x Aarc",
    module: {
        exchange: {
            enabled: true,
        },
        onRamp: {
            enabled: true,
            onRampConfig: {
                customerId: customerId || "anonymous",
            },
        },
        bridgeAndSwap: {
            enabled: true,
            fetchOnlyDestinationBalance: false,
            routeType: "Value",
            connectors: [SourceConnectorName.ETHEREUM],
        },
    },
    destination: {
        walletAddress,
    },
    appearance: {
        roundness: 42,
        theme: ThemeName.DARK,
    },
    apiKeys: {
        aarcSDK: import.meta.env.VITE_AARC_API_KEY,
    },
    events: {
        onTransactionSuccess: (data: TransactionSuccessData) => {
            console.log("Transaction successful:", data);
            onSuccess?.(data);
        },
        onTransactionError: (data: TransactionErrorData) => {
            console.error("Transaction failed:", data);
            onError?.(data);
        },
        onWidgetClose: () => {
            console.log("Widget closed");
            onClose?.();
        },
        onWidgetOpen: () => {
            console.log("Widget opened");
            onOpen?.();
        },
    },
    origin: window.location.origin,
});