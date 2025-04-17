import React, { useRef } from 'react';
import { AarcProvider } from './context/AarcProvider';
import TurnkeyAarcApp from './components/TurnkeyAarcApp';
import "@aarc-xyz/eth-connector/styles.css"
import './index.css';
import { AarcFundKitModal } from '@aarc-xyz/fundkit-web-sdk';
import { aarcConfig } from './config/aarcConfig';
/* @ts-ignore */
import "@turnkey/sdk-react/styles";
import { TurnkeyProvider } from '@turnkey/sdk-react';
import { turnKeyConfig } from './config/turnkeyConfig';

const App = () => {
  const aarcModalRef = useRef(new AarcFundKitModal(aarcConfig));
  const aarcModal = aarcModalRef.current;


  return (
    <React.StrictMode>
      <TurnkeyProvider
        config={turnKeyConfig}
      >
        <AarcProvider aarcModal={aarcModal}>
          <TurnkeyAarcApp
            isDark={true}
            logoLight="/logo.svg"
            logoDark="/logo.svg"
            aarcModal={aarcModal}
            onThemeToggle={() => { }}
          />
        </AarcProvider>
      </TurnkeyProvider >
    </React.StrictMode>
  );
};

export default App;