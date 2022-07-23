import { useAddress, useMetamask, useEditionDrop, useToken} from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import "./index.css"
const App = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const connectWithMetamask = useMetamask();
  console.log("👋 Address:", address);
  const editionDrop=useEditionDrop("0x19E930057d264Dd061f87461DbE97d090F69398b")
  const [isClaiming, setIsClaiming] = useState(false);
  const token=useToken("0x4Cc8223Ddb1bcfBb2bC7ECC314ADE4395bdb4592")
  const [memberTokenAmounts,setMemberTokenAmounts]=useState([])
  const [memberAddresses,setMemberAddresses]=useState([])

  const shortenAddress=(str)=>{
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  }
useEffect(()=>{
  if(!hasClaimedNFT){
    return
  }

  const getAllAddresses=async()=>{
    try{
      const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
      setMemberAddresses(memberAddresses);
    }catch(error){
      console.error("Failed to get member list:" , error);
    }
  };
  getAllAddresses();
},[hasClaimedNFT , editionDrop.history])

useEffect(()=>{
  if(!hasClaimedNFT)
  {
    return;
  }

  const getAllBalances = async () => {
    try {
      const amounts = await token.history.getAllHolderBalances();
      setMemberTokenAmounts(amounts);
      console.log("👜 Amounts", amounts);
    } catch (error) {
      console.error("failed to get member balances", error);
    }
  };
  getAllBalances();
}, [hasClaimedNFT, token.history]);

const memberList=useMemo(()=>{
  return memberAddresses.map(address=>{
    // We're checking if we are finding the address in the memberTokenAmounts array.
    // If we are, we'll return the amount of token the user has.
    // Otherwise, return 0.
    const member = memberTokenAmounts?.find(({ holder }) => holder === address);

    return {
      address,
      tokenAmount: member?.balance.displayValue || "0",
    }
  });
}, [memberAddresses, memberTokenAmounts]);


 
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
        <button onClick={connectWithMetamask} className="px-28 btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1 className="h1">🍪DAO Member Page</h1>
        <p className='mt-12 text-xl'>Congratulations 🎉 on being a member</p>
        <div>
        <div>
          <h2>Member List</h2>
          <table className="card">
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    );
  };
  
  // This is the case where we have the user's address
  // which means they've connected their wallet to our site!
  return (
    <div className="mint-nft">
      <h1 className="h1">Mint your free 🍪DAO Membership NFT</h1>
      <button className='btn-hero'
      disabled={isClaiming}
      onClick={mintNFT}>
         {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>);
}

export default App;