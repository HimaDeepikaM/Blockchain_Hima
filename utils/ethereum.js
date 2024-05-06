import { ethers } from 'ethers';

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.JsonRpcProvider(); 
            const signer = provider.getSigner();
            console.log("Connected Account:", await signer.getAddress());
            return signer;
        } catch (error) {
            console.error("Could not connect to MetaMask", error);
            throw error;
        }
    } else {
        console.log('Please install MetaMask!');
        alert('Install MetaMask');
    }
};
