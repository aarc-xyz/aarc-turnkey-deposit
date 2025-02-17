import { DynamicWidget, useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { useAarc } from '../context/AarcProvider';

interface Props {
    isDark: boolean;
    logoLight: string;
    logoDark: string;
}

const DynamicAarcApp = ({ isDark, logoLight, logoDark } : Props) => {
    const isLoggedIn = useIsLoggedIn();
    const { primaryWallet } = useDynamicContext();
    const { openFundingModal } = useAarc();

    const handleFundWallet = () => {
        if (primaryWallet?.address) {
            console.log('primaryWallet?.address: ', primaryWallet?.address);
            openFundingModal(primaryWallet.address);
        }
    };

    return (
        <div className={`container ${isDark ? 'dark' : 'light'}`}>
            <header className="header">
                <img
                    className="logo"
                    src={isDark ? logoLight : logoDark}
                    alt="Logo"
                />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="big-text"> X </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <img
                  className="logo"
                    src="/dynamicLogo.svg"
                    alt="Dynamic Logo"

                />
            </header>

            <main className="modal">
                <DynamicWidget />
                {isLoggedIn && primaryWallet && (
                    <button
                        onClick={handleFundWallet}
                        className="fund-wallet-button"
                    >
                        Fund Wallet
                    </button>
                )}
            </main>
        </div>
    );
};

export default DynamicAarcApp;
