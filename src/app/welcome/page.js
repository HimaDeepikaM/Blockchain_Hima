
"use client"
import React, { useState } from 'react';
import { ethers } from "ethers";
import { contractABI, contractAddress } from '../../../utils/address';
import Link from 'next/link';

const Startingpage = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Checking Wallet Connection');

    const connectWalletHandler = async () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setDefaultAccount(accounts[0]);
                setConnButtonText('Wallet Connected');
            } catch (error) {
                setErrorMessage(error.message);
            }
        } else {
            setErrorMessage('Please install MetaMask.');
        }
    };
    return (
        <div className='flex items-center justify-start min-h-screen bg-gradient-to-white from-white via-white to-white pl-20'>
        <div className='bg-gradient-to-r from-gray-500 via-gray-400 to-blue-300 rounded-lg shadow-xl p-10 max-w-lg w-full'>
            <h2 className="text-4xl font-bold text-center mb-2 text-black">Find Your Chill on Frosty Finds!</h2>
            <div className="grid grid-rows-3 gap-4 grid-flow-row-dense">
                    <button onClick={connectWalletHandler}
                            className={`font-bold py-2 px-4 rounded ${defaultAccount ? 'bg-blue-0 hover:bg-blue-0' : 'bg-blue-0 hover:bg-blue-0'} text-black shadow-lg focus:shadow-outline focus:outline-none transition duration-150 ease-in-out`}>
                                Connect to your wallet.  
                    </button>
                    <Link href="/listingpage" passHref className="bg-blue-0 hover:bg-blue-0 text-black font-bold py-2 px-4 transition duration-150 ease-in-out text-center">
                    List Icecream
                        </Link>
                        <Link href="/buying" passHref className="bg-blue-0 hover:bg-blue-0 text-black font-bold py-2 px-4 rounded shadow-lg transition duration-150 ease-in-out text-center">
                            Buy Icecream
                        </Link>
                </div>
                {defaultAccount && <p className="text-blue-800 mt-4 text-center">Connected: {defaultAccount}</p>}
                {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
            </div>
        </div>
    );
}
export default Startingpage;

