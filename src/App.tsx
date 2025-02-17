import React from 'react';
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { AarcProvider } from './context/AarcProvider';
import DynamicAarcApp from './components/DynamicAarcApp';
import './App.css';


const App = () => {
  return (
    <React.StrictMode>
      <DynamicContextProvider
      theme="auto"
        settings={{
          environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID,
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <AarcProvider>
          <DynamicAarcApp
            isDark={true}
            logoLight="/logo.png"
            logoDark="/logo.png"
          />
        </AarcProvider>
      </DynamicContextProvider>
    </React.StrictMode>
  );
};

export default App;