// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol"; //utils for string
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import { Base64 } from "./libraries/Base64.sol";


// We inherit the contract from ERC721 (NFT standard) to have access to the inherited contract's methods.
contract MyEpicNFT is ERC721URIStorage {

  // use"Counter" method from OpenZeppelin to help us keep track of tokenIds.
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><defs><filter id='MyFilter' filterUnits='userSpaceOnUse' x='0' y='0' width='200' height='120'><feGaussianBlur in='SourceAlpha' stdDeviation='4' result='blur' /><feOffset in='blur' dx='4' dy='4' result='offsetBlur' /><feSpecularLighting in='blur' surfaceScale='5' specularConstant='.75' specularExponent='20' lighting-color='#bbbbbb' result='specOut'><fePointLight x='-5000' y='-10000' z='20000' /></feSpecularLighting><feComposite in='specOut' in2='SourceAlpha' operator='in' result='specOut' /><feComposite in='SourceGraphic' in2='specOut' operator='arithmetic' k1='0' k2='1' k3='1' k4='0' result='litPaint' /><feMerge><feMergeNode in='offsetBlur' /><feMergeNode in='litPaint' /></feMerge></filter></defs><rect x='1' y='1' width='198' height='118' fill='#cccccc' /><g filter='url(#MyFilter)'><path fill='none' stroke='#D90000' stroke-width='10' d='M50,90 C0,90 0,30 50,30 L150,30 C200,30 200,90 150,90 z' /><text fill='#FFFFFF' stroke='black' font-size='15' font-family='Verdana' text-anchor='middle' x='95' y='65'>";

  // Arrays of some random words
  string[] firstWords = [" ACE ", " EGO ", " FOX ", " ICE ", " SAG ", " SAD "];
  string[] secondWords = [" BOO ", " FAN ", " FUN ", " OLD ", " SEA ", " WRY "];
  string[] thirdWords = [" BIS ", " FAT ", " GEM ", " OOH ", " WOW ", " WEE "];

  // We need to pass the name of our NFTs token and it's symbol.
  constructor() ERC721 ("MyNFT", "TLC") {
    console.log("This is my NFT contract. Built by TLC");
  }

  // To randomise the strings
  function random(string memory input) internal pure returns (uint256) {
      return uint256(keccak256(abi.encodePacked(input)));
  }

  // Randomly pick a word from each array.
  function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) {
    // I seed the random generator. More on this in the lesson. 
    uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
    // Squash the # between 0 and the length of the array to avoid going out of bounds.
    rand = rand % firstWords.length;
    return firstWords[rand];
  }

  function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
    rand = rand % secondWords.length;
    return secondWords[rand];
  }

  function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
    rand = rand % thirdWords.length;
    return thirdWords[rand];
  }

  // A function our user will hit to get their NFT.
  function makeAnNFT() public {

     // Get the current tokenId, this starts at 0.
    uint256 newItemId = _tokenIds.current();
    //_tokenIds is state ⇑ variable which means if we change it, the value is stored on the contract directly.

    // Randomly grab one word from each of the three arrays.
    string memory first = pickRandomFirstWord(newItemId);
    string memory second = pickRandomSecondWord(newItemId);
    string memory third = pickRandomThirdWord(newItemId);
    string memory combinedWord = string(abi.encodePacked(first, second, third));

    // I concatenate it all together, and then close the <text> and <svg> tags.
    string memory finalSvg = string(abi.encodePacked(baseSvg, combinedWord, "</text></g></svg>"))
    console.log("\n*********************");
    console.log(finalSvg);
    console.log("*********************\n");


    // Get all the JSON metadata in place and base64 encode it.So, all that JSON will live on the contract itself.
    string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "',
                    // We set the title of our NFT as the generated word.
                    combinedWord,
                    '", "description": "A highly acclaimed collection of SIGNS.", "image": "data:image/svg+xml;base64,',
                    // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                    Base64.encode(bytes(finalSvg)),
                    '"}'
                )
            )
        )
    );
     // Just like before, we prepend data:application/json;base64, to our data.
    string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );

    console.log("\n--------------------");
    console.log(finalTokenUri);
    console.log("--------------------\n");

    
    // Actually mint the NFT to the sender using msg.sender.
    _safeMint(msg.sender, newItemId);
    // A secure ⇑ way to get the user's public address "You can't call a contract anonymously, you need to have your wallet credentials connected."
    
    // Update your URI!!!
    _setTokenURI(newItemId, finalTokenUri);
  
    _tokenIds.increment();
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
  }
}
