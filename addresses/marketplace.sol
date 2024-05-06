// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct Item {
        uint id;
        address payable seller;
        address payable owner;
        string title;
        string description;
        string imageHash; // IPFS hash of the image
        uint price;
        bool sold;
    }

    Item[] public items;
    uint public itemCount = 0;

    event ItemListed(uint itemId, address indexed seller, address indexed owner, string title, string imageHash, uint price);
    event ItemSold(uint itemId, address indexed oldOwner, address indexed newOwner, uint price);
    event PaymentSent(address indexed from, address indexed to, uint256 amount);

    function listItem(string memory _title, string memory _description, string memory _imageHash, uint _price) public {
        require(_price > 0, "Price must be greater than zero");
        
        items.push(Item({
            id: itemCount,
            seller: payable(msg.sender),
            owner: payable(msg.sender), // Owner set as the seller initially
            title: _title,
            description: _description,
            imageHash: _imageHash,
            price: _price,
            sold: false
        }));
        
        emit ItemListed(itemCount, msg.sender, msg.sender, _title, _imageHash, _price);
        itemCount++;
    }

    function buyItem(uint _id) public payable {
        require(_id < itemCount, "Item ID does not exist");
        Item storage item = items[_id];
        require(msg.value == item.price, "Please submit the asking price in order to complete the purchase");
        require(!item.sold, "This item has already been sold");
        require(msg.sender != item.owner, "Owner cannot buy their own item");

        // Safer method to transfer funds using call
        (bool success, ) = item.owner.call{value: msg.value}("");
        require(success, "Failed to send Ether");

        address prevOwner = item.owner; // Track previous owner for event
        item.owner = payable(msg.sender); // Update owner to the new buyer
        item.sold = true;

        emit PaymentSent(msg.sender, prevOwner, msg.value);
        emit ItemSold(_id, prevOwner, msg.sender, item.price);
    }

    function getAllItems() public view returns (Item[] memory) {
        return items;
    }

    function getItemById(uint _id) public view returns (Item memory) {
        require(_id < itemCount, "Item ID does not exist");
        return items[_id];}
}