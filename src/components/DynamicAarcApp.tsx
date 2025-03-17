import { DynamicWidget, useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { AarcFundKitModal } from "@aarc-xyz/fundkit-web-sdk";
import "./DynamicAarcApp.css";

interface Props {
    isDark: boolean;
    logoLight: string;
    logoDark: string;
    aarcModal: AarcFundKitModal;
    onThemeToggle: () => void;
}

const DynamicAarcApp = ({ isDark, logoLight, logoDark, aarcModal, onThemeToggle }: Props) => {
    const isLoggedIn = useIsLoggedIn();
    const { primaryWallet } = useDynamicContext();

    const handleFundWallet = () => {
        if (primaryWallet?.address) {
            console.log('primaryWallet?.address: ', primaryWallet?.address);
            try {
                aarcModal?.updateDestinationWalletAddress(primaryWallet?.address);
                aarcModal.openModal();
            } catch (error) {
                console.error('Error opening Aarc modal:', error);
            }
        }
    };

    return (
        <div className={`container ${isDark ? 'dark' : 'light'}`}>
            <header className="header">
                <div className="logo-container">
                    <img
                        className="logo"
                        src={isDark ? logoLight : logoDark}
                        alt="Aarc Logo"
                    />
                    <span className="separator">X</span>
                    <img
                        className="logo"
                        src="/dynamicLogo.svg"
                        alt="Dynamic Logo"
                    />
                </div>
                <button className="theme-toggle" onClick={onThemeToggle}>
                    <img src="/dark_mode.svg" alt="Theme toggle" />
                </button>
            </header>

            <main className="modal">
                <div className={`auth-card ${isLoggedIn ? 'logged-in' : 'logged-out'}`}>
                    <DynamicWidget 
                    buttonClassName="fund-wallet-button"
                    />

                    {!isLoggedIn && (
                        <>
                            <div className="powered-by">
                                Powered by <img src={isDark ? logoLight : logoDark} alt="Aarc Logo" />
                            </div>
                            <div className="terms">
                                By using this service, you agree to Aarc terms
                            </div>
                        </>
                    )}
                    {isLoggedIn && primaryWallet && (
                        <>
                            <button
                                onClick={handleFundWallet}
                                className="fund-wallet-button"
                            >
                                Fund Wallet
                            </button>
                            <div className="powered-by">
                                Powered by <img src={isDark ? logoLight : logoDark} alt="Aarc Logo" />
                            </div>
                            <div className="terms">
                                By using this service, you agree to Aarc terms
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DynamicAarcApp;
