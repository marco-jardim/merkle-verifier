// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Verifier {

    mapping (address => bytes32) roots;

    constructor() {
        
    }

    function verify(bytes32 _leaf, bytes32[] calldata _merkleProof) public view returns (bool) {
        return MerkleProof.verify(_merkleProof, roots[msg.sender], _leaf);
    }

    function setRoot(bytes32 _root) public {
        roots[msg.sender] = _root;
    }

    function getRoot(address _address) public view returns (bytes32) {
        return roots[_address];
    }

    function getMyRoot() public view returns (bytes32) {
        return getRoot(msg.sender);
    }
}