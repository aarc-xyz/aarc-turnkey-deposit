import { AarcFundKitModal } from "@aarc-xyz/fundkit-web-sdk";

let isSetupInitiated = false;

export const setupAarcButtonOverride = (aarcModal: AarcFundKitModal, dynamicAddress: string, options = { debug: false }) => {
    // Stop if it already ran
    if (isSetupInitiated) {
        return;
    }

    // Set our flag to say the function has initiated
    isSetupInitiated = true;

    const { debug = false } = options;

    // Function to find elements in shadow DOM
    const findButtonInShadowDOM = (root: Document | ShadowRoot): { button: HTMLElement | null; backdrop: HTMLElement | null } => {
        let foundButton: HTMLElement | null = null;
        let foundBackdrop: HTMLElement | null = null;

        const shadows = root.querySelectorAll('*');
        for (const element of shadows) {
            if (element.shadowRoot) {
                // Look for the deposit button and backdrop
                const button = element.shadowRoot.querySelector('[data-testid="buy-crypto-button"]');
                const backdrop = element.shadowRoot.querySelector('[data-testid="portal-backdrop"]');

                if (button) {
                    foundButton = button as HTMLElement;
                }
                if (backdrop) {
                    foundBackdrop = backdrop as HTMLElement;
                }

                if (foundButton && foundBackdrop) {
                    return { button: foundButton, backdrop: foundBackdrop };
                }

                const deepResult = findButtonInShadowDOM(element.shadowRoot);
                if (deepResult.button) foundButton = deepResult.button;
                if (deepResult.backdrop) foundBackdrop = deepResult.backdrop;

                if (foundButton && foundBackdrop) {
                    return { button: foundButton, backdrop: foundBackdrop };
                }
            }
        }
        return { button: foundButton, backdrop: foundBackdrop };
    };

    // Function to setup the button override
    const setupOverride = () => {
        const { button, backdrop } = findButtonInShadowDOM(document);

        if (button && aarcModal) {
            if (debug) console.log('Found deposit button and Aarc modal ready');

            // Remove disabled state if present
            button.classList.remove('disabled');
            button.removeAttribute('disabled');

            // Remove all existing click handlers
            const newButton = button.cloneNode(true) as HTMLElement;
            button.parentNode?.replaceChild(newButton, button);

            // Add our new click handler
            newButton.addEventListener('click', (event: MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();

                if (debug) console.log('Opening Aarc modal');
                // First close the Dynamic widget using the backdrop
                if (backdrop) {
                    backdrop.click();
                }
                aarcModal?.updateDestinationWalletAddress(dynamicAddress);
                // Small delay to ensure the Dynamic modal is closed
                setTimeout(() => {
                    aarcModal.openModal();
                }, 100);
            });

            return true;
        }

        return false;
    };

    // Poll for the button
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
        if (setupOverride() || Date.now() - startTime > 30000) {
            clearInterval(checkInterval);
            if (Date.now() - startTime > 30000) {
                if (debug) console.warn('Timeout reached while setting up Aarc button override');
            }
        }
    }, 500);

    // Return cleanup function
    return () => {
        clearInterval(checkInterval);
        isSetupInitiated = false;
    };
}; 