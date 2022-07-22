import { useAddress, useMetamask, useEditionDrop } from '@thirdweb-dev/react';
import { useState, useEffect } from 'react';

const App = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👋 Address:", address);
  const editionDrop=useEditionDrop("0x19E930057d264Dd061f87461DbE97d090F69398b")
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if(!address) {
      return
    }
    const checkBalance = async () => {
      try{
        const balance=await editionDrop.balanceOf(address,0);
        if(balance.gt(0)){
        setHasClaimedNFT(true);
        console.log("🌟 this user has a membership NFT!");
        }
        else {
        setHasClaimedNFT(false);
        console.log("😭 this user doesn't have a membership NFT.");
      }
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to get balance", error);
    }
  };
  checkBalance();
}, [address, editionDrop]);


const mintNFT=async()=>{
  try{
    setIsClaiming(true);
    await editionDrop.claim("0",1);
    alert(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
    setHasClaimedNFT(true);
  }
  catch(error){
    setHasClaimedNFT(false)
    console.error("Failer to mint NFT",error);
  }
  finally{
    setIsClaiming(false)
  }
}

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <div className="landing">
        <h1 className='h1'>Welcome to phirieDAO</h1>
        <button onClick={connectWithMetamask} className=" btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }
  if (hasClaimedNFT) {
    return (
      <div className="landing">
        <h1 className="h1">🍪DAO Member Page</h1>
        <p className='mt-4 text-xl'>Congratulations 🎉 on being a member</p>
      </div>
    );
  };
  
  // This is the case where we have the user's address
  // which means they've connected their wallet to our site!
  return (
    <div className="landing">
      <h1 className="h1">Mint your free 🍪DAO Membership NFT</h1>
      <button className='btn-hero'
      disabled={isClaiming}
      onClick={mintNFT}>
         {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>);
}

export default App;