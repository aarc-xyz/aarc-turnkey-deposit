// src/context/AarcProvider.tsx
import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import { AarcFundKitModal } from "@aarc-xyz/fundkit-web-sdk";
import { AarcEthWalletConnector } from "@aarc-xyz/eth-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAarcConfig } from '../config/aarcConfig';

interface AarcContextType {
    openFundingModal: (walletAddress: string) => void;
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false
        }
    }
});

const AarcContext = createContext<AarcContextType | null>(null);

export const useAarc = () => {
    const context = useContext(AarcContext);
    if (!context) {
        throw new Error('useAarc must be used within an AarcProvider');
    }
    return context;
};

export const AarcProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isReady, setIsReady] = useState(false);
    const aarcModalRef = useRef<AarcFundKitModal | null>(null);

    useEffect(() => {
        // Initialize the modal with a default configuration
        const initialConfig = createAarcConfig({ walletAddress: '' });
        aarcModalRef.current = new AarcFundKitModal(initialConfig);
        setIsReady(true);

        // return () => {
        //     if (aarcModalRef.current) {
        //         try {
        //             aarcModalRef.current.destroy?.();
        //         } catch (error) {
        //             console.error('Error cleaning up Aarc modal:', error);
        //         }
        //     }
        // };
    }, []);

    const openFundingModal = (walletAddress: string) => {
        try {
            // Update the configuration with the new wallet address
            const config = createAarcConfig({ walletAddress });
            if (!aarcModalRef.current?.config.destination.walletAddress) {
                aarcModalRef.current = new AarcFundKitModal(config);
                console.log('aarcModalRef.current: ', aarcModalRef.current);
            }
            aarcModalRef.current.openModal();
        } catch (error) {
            console.error('Error opening Aarc modal:', error);
        }
    };

    if (!isReady || !aarcModalRef.current) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <AarcContext.Provider value={{ openFundingModal }}>
                <AarcEthWalletConnector
                    aarcWebClient={aarcModalRef.current}
                >
                    {children}
                </AarcEthWalletConnector>
            </AarcContext.Provider>
        </QueryClientProvider>
    );
};