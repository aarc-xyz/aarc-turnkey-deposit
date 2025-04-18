import { AarcFundKitModal } from "@aarc-xyz/fundkit-web-sdk";
import "../index.css";
import "../styles/auth.css";
import '../styles/otp.css';
import { Auth, useTurnkey } from "@turnkey/sdk-react";
import { auth } from "../config/turnkeyConfig";
import { useEffect, useState } from "react";
import { CopyIcon } from "../icons/CopyIcon";
import { CheckIcon } from "../icons/CheckIcon";

interface Props {
    isDark: boolean;
    logoLight: string;
    logoDark: string;
    aarcModal: AarcFundKitModal;
    onThemeToggle: () => void;
}

const formatAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const TurnkeyAarcApp = ({ isDark, logoLight, logoDark, aarcModal }: Props) => {
    const { turnkey, getActiveClient } = useTurnkey();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [copied, setCopied] = useState(false);
    const [userAddress, setUserAddress] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const user = await turnkey?.getCurrentUser();
                const isUserLoggedIn = !!user?.organization.organizationId;
                setIsLoggedIn(isUserLoggedIn);

                if (isUserLoggedIn) {
                    const client = await getActiveClient();
                    const organizationId = user?.organization.organizationId;
                    
                    if (organizationId) {
                        const wallets = await client?.getWallets({
                            organizationId,
                        });
                        
                        if (wallets?.wallets && wallets.wallets.length > 0) {
                            const walletId = wallets.wallets[0].walletId;
                            const accounts = await client?.getWalletAccounts({
                                organizationId,
                                walletId,
                            });
                            
                            const ethAddress = accounts?.accounts.find(
                                account => account.addressFormat === "ADDRESS_FORMAT_ETHEREUM"
                            )?.address;
                            
                            if (isMounted && ethAddress) {
                                setUserAddress(ethAddress);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchUserData();

        return () => {
            isMounted = false;
        };
    }, [turnkey, getActiveClient, isLoggedIn]);
    
    const handleDisconnect = () => {
        localStorage.removeItem('@turnkey/session/v2');
        localStorage.removeItem('@turnkey/client');
        window.location.reload();
    };

    const handleCopyAddress = async () => {
        if (userAddress) {
            await navigator.clipboard.writeText(userAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        }
    };

    const handleFundWallet = async () => {
    
        if (userAddress) {
            try {
                aarcModal?.updateDestinationWalletAddress(userAddress);
                aarcModal.openModal();
            } catch (error) {
                console.error('Error opening Aarc modal:', error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-aarc-bg grid-background">
            <header className="fixed top-0 left-0 right-0 z-50 bg-aarc-bg/80 backdrop-blur-sm border-b border-[#ffffff0d]">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <img
                            className="h-6 w-auto"
                            src={isDark ? logoLight : logoDark}
                            alt="Aarc Logo"
                        />
                        <img
                            src="/cross-icon.svg"
                            alt="Cross"
                            className="w-6 h-6"
                        />
                        <img
                            className="h-6 w-auto"
                            src="/turnkeyLogo.svg"
                            alt="Turnkey Logo"
                        />
                    </div>
                    {isLoggedIn && (
                        <div className="w-[158px] h-[40px]">
                                    <button
                                    onClick={handleDisconnect}
                                    className="w-full h-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-aarc-primary border border-[#0033000D] hover:opacity-90 transition-opacity"
                                >
                                    <div className="flex items-center rounded-xl justify-center gap-2 w-full">
                                        <span className="text-aarc-button-text font-semibold whitespace-nowrap">Logout</span>
                                        <svg width="16" height="16" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                                            <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" fill="#003300" />
                                        </svg>
                                    </div>
                                </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="pt-24 pb-8 px-4 mx-auto max-w-md">
                <div className="gradient-border">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aarc-primary"></div>
                        </div>
                    ) : !isLoggedIn ? (
                        <Auth 
                            {...auth}
                            onAuthSuccess={() => {
                                setIsLoggedIn(true);
                                return Promise.resolve();
                            }}
                        />
                    ) : (
                        <>
                            <div className="box-border flex w-full items-center px-2 py-3 gap-2.5 border border-[#424242] rounded-2xl flex-grow-0 z-[5]">
                                <img src="/turnkeyFavicon.ico" alt="Ethereum" className="w-6 h-6" />
                                <div className="flex flex-col items-start center gap-2">
                                    <div className="text-[#C3C3C3] text-xs font-medium">EVM Address</div>
                                    <div className="text-white text-sm font-semibold">{formatAddress(userAddress)}</div>
                                </div>
                                <button
                                    onClick={handleCopyAddress}
                                    className="ml-auto hover:opacity-80 transition-opacity"
                                    title={copied ? "Copied!" : "Copy address"}
                                >
                                    {copied ? <CheckIcon /> : <CopyIcon />}
                                </button>
                            </div>

                            <button
                                onClick={handleFundWallet}
                                className="w-full mt-4 py-3 px-4 bg-aarc-primary text-aarc-button-text font-medium rounded-[42px] hover:bg-opacity-90 transition-colors"
                            >
                                Fund Wallet
                            </button>
                        </>
                    )}
                       <div className="mt-4 flex items-center justify-center space-x-0.5 text-aarc-text">
                                <span className="font-semibold text-[10.94px] leading-none">Powered by</span>
                                <img
                                    src={isDark ? logoLight : logoDark}
                                    alt="Aarc Logo"
                                    className="w-[56.11px] h-[14.90px]"
                                />
                            </div>
                            <div className="text-center text-[10px] leading-none text-aarc-text">
                                By using this service, you agree to Aarc <span className="underline">terms</span>
                            </div>
                </div>
            </main>
        </div>
    );
};

export default TurnkeyAarcApp;
