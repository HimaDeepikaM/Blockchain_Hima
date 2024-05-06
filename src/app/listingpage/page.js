"use client"
import React, { useState, useRef } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { contractABI, contractAddress } from '../../../utils/constants';

const Listingpage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null); // Reference to the file input
    const [transaction, setTransaction]=useState('');

    const onImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const uploadImageToPinata = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'pinata_api_key': '8046f2b8ec648bf2cb6b',
                    'pinata_secret_api_key': 'e7a7c2fcfcc1359b330f0523a2821fad8d93188adadff0b202f804a5a3866565',
                },
            });
            return response.data.IpfsHash;
        } catch (error) {
            console.error('Error uploading image: ', error);
            setErrorMessage('Failed to upload image.');
            return null;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            setErrorMessage('MetaMask is not detected.');
            return;
        }

        setIsLoading(true);
        const ipfsHash = await uploadImageToPinata(image);
        if (!ipfsHash) {
            setIsLoading(false);
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const marketplaceContract = new ethers.Contract(contractAddress, contractABI, signer);
            const transaction = await marketplaceContract.listItem(title, description, ipfsHash, ethers.utils.parseUnits(price, 'ether'));
            await transaction.wait();
            const receipt =await transaction.wait();
            setTransaction(receipt.transactionHash);
            setSuccessMessage('Ice-cream added to the cart');
            setTitle('');
            setDescription('');
            setPrice('');
            setImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Properly clear the file input
            }
            setTimeout(() => { setSuccessMessage(''); }, 3000);
        } catch (error) {
            console.error('Error processing transaction: ', error);
            setErrorMessage('Transaction failed: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex items-center justify-start min-h-screen bg-gradient-to-white from-white via-white to-white pl-20'>

<div className='bg-gradient-to-r from-gray-500 via-gray-400 to-blue-300 rounded-lg shadow-xl p-10 max-w-lg w-full'>

                {successMessage && (
                    <div className="success bg-green-500 text-white p-4 mb-4 text-center font-bold rounded">
                        {successMessage}
                    </div>
                )}
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Deploy Your Delights to the Digital Drive-Thru</h2>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                        <label htmlFor="image-upload" className="block text-gray-800 font-bold mb-2">Upload Ice-cream Image</label>
                        <input type="file" ref={fileInputRef} onChange={onImageChange} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-800 font-bold mb-2" htmlFor="item-title">Name your Ice-cream</label>
                        <input type="text" id="item-title" value={title} onChange={(e) => setTitle(e.target.value)}
                               className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" placeholder="Item Title" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-800 font-bold mb-2" htmlFor="item-description">Describe it's flavours</label>
                        <textarea id="item-description" value={description} onChange={(e) => setDescription(e.target.value)}
                                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" placeholder="Item Description" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-800 font-bold mb-2" htmlFor="item-price">Price(ETH)</label>
                        <input type="text" id="item-price" value={price} onChange={(e) => setPrice(e.target.value)}
                               className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" placeholder="Price in ETH" required />
                    </div>
                    <div className="flex justify-center">
                        <button type="submit"
                                disabled={isLoading}
                                className={`shadow focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded ${isLoading ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-400 text-white'}`}>
                            {isLoading ? 'Submitting' : 'List Item'}
                        </button>
                        { <p className="text-red-500 text-center mt-4">{transaction}</p>}
                    </div>
                    {errorMessage && <p className="error text-red-500 text-center mt-4">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default Listingpage;
