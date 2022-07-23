import sdk from "./1-initialize-sdk.js";

// This is the address to our ERC-1155 membership NFT contract.
const editionDrop = sdk.getEditionDrop("0x19E930057d264Dd061f87461DbE97d090F69398b");

// This is the address to our ERC-20 token contract.
const token = sdk.getToken("0x4Cc8223Ddb1bcfBb2bC7ECC314ADE4395bdb4592");


async function main (){
    try{
        const walletAddresses=await editionDrop.history.getAllClaimerAddresses(0);
        if (walletAddresses.length === 0) {
            console.log(
              "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!",
            );
            process.exit(0);
          }
          const airdropTargets=walletAddresses.map(address=>{
            const randomAmount=Math.floor(Math.random()*(1000-100+1)+1000);
            console.log("✅ Going to airdrop", randomAmount, "tokens to", address);

      // Set up the target.
      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      };

      return airdropTarget;
    });
         

console.log("🌈 Starting airdrop...");
    await token.transferBatch(airdropTargets);
    console.log("✅ Successfully airdropped tokens to all the holders of the NFT!");
  } catch (err) {
    console.error("Failed to airdrop tokens", err);
 }
}

main()