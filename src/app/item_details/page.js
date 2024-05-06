"use client"
import React, { useState, Suspense } from 'react';
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../../../utils/constants";
import { useSearchParams } from "next/navigation";

const ItemDetails = () => {
    const [isBuying, setIsBuying] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [transactionHash, setTransactionHash]=useState('');
    const [buttonText, setButtonText] = useState('Buy Item');

  
    const buyItem = async (id, price) => {
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            setErrorMessage('Please install MetaMask to perform the transaction.');
            return;
        }

        setIsBuying(true);
        setButtonText('Processing...');

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const new_price = ethers.utils.parseUnits(price.toString(), "ether");

            const transaction = await contract.buyItem(id, {value:new_price});
            const receipt =await transaction.wait();
            setTransactionHash(receipt.transactionHash);

            setIsBuying(true);
            setTimeout(() => window.location.href = '/buying', 3000);  // Redirect after success message
        } catch (error) {
            console.error('Transaction failed:', error);
            setErrorMessage('Transaction failed. Please try again.');
            setIsBuying(false);
            setButtonText('Buy Item');
        }
    };
    const SearchParamsComponent =() =>{
        const searchParams = useSearchParams();
    
        const title = searchParams.get('title');
        const description = searchParams.get('description');
        const price = searchParams.get('price');
        const imageHash = searchParams.get('imageHash');
        const id = searchParams.get('id');
    
    return (
        <React.Fragment>
        <h1 className="max-w-lg w-full bg-white rounded-lg shadow-lg p-4"></h1>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
            <img src={`https://gateway.pinata.cloud/ipfs/${imageHash}`} alt={title} className="rounded w-full object-cover h-64 mb-2" />
            <p className="text-gray-600 mb-2">{description}</p>
            <p className="text-xl text-gray-900 mb-4">{price} ETH</p>
            <button 
                className={`w-full py-2 px-4 text-white font-bold rounded ${isBuying ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-400'}`}
                onClick={()=>buyItem(id,)} 
                disabled={isBuying}>
                {buttonText}
            </button>
            {transactionHash && <p className="text-red-500 text-center mt-2">Success{transactionHash}</p>}
        </React.Fragment>
    );
};
return (
    <div className="flex items-center justify-center min-h-screen" style={{ position: "relative", zIndex: 1 }}>
        <div style={{
                zIndex: -1,
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh"
            }}>
          
        </div>
        <div className='bg-stone-50 rounded-lg shadow-4xl p-10 max-w-2xl w-full' style={{ borderRadius: '30px', boxShadow: '0 10px 90px rgba(0, 0, 0, 0.7)' }}>
            <Suspense fallback={<p>Loading details...</p>}>
                <SearchParamsComponent />   
            </Suspense>
            {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>}
        </div>
</div>)
};

export default ItemDetails;
