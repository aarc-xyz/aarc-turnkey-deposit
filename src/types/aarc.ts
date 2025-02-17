import { TransactionSuccessData, TransactionErrorData } from "@aarc-xyz/fundkit-web-sdk";

export interface AarcConfig {
    walletAddress: string;
    customerId?: string;
    onSuccess?: (data: TransactionSuccessData) => void;
    onError?: (data: TransactionErrorData) => void;
    onClose?: () => void;
    onOpen?: () => void;
}