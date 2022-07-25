import { useAddress, useMetamask,useNetwork, useEditionDrop,useVote, useToken} from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import { ChainId } from '@thirdweb-dev/sdk'
import { AddressZero } from "@ethersproject/constants";
import "./index.css"


const App = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  const network=useNetwork();
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const connectWithMetamask = useMetamask();
  console.log("👋 Address:", address);
  const editionDrop=useEditionDrop("0x19E930057d264Dd061f87461DbE97d090F69398b")
  const [isClaiming, setIsClaiming] = useState(false);
  const token=useToken("0x4Cc8223Ddb1bcfBb2bC7ECC314ADE4395bdb4592")
  const [memberTokenAmounts,setMemberTokenAmounts]=useState([])
  const [memberAddresses,setMemberAddresses]=useState([])
  const vote=useVote("0xAbf626b74a31031aB1c20343b84779a77BBCbab5")
  const [proposals,setProposals]=useState([])
  const [isVoting,setIsVoting]=useState(false)
  const [hasVoted,setHasVoted]=useState(false)
  
  const shortenAddress=(str)=>{
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  }

  useEffect(()=>{
      if(!hasClaimedNFT){
        return
      }

      const getAllProposals=async()=>{
        try{
          const proposals=await vote.getAll();
          setProposals(proposals);
          console.log("🌈 Proposals:", proposals);
    } catch (error) {
      console.log("failed to get proposals", error);
    }
  };
  getAllProposals();
}, [hasClaimedNFT, vote]);

useEffect(()=>{
  if(!hasClaimedNFT){
    return
  }
    if(!proposals.length){
      return
    }
    const checkIfUserHasVoted=async()=>{
      try{
        const hasVoted=await vote.hasVoted(proposals[0].proposalId,address);
        setHasVoted(hasVoted)
        if (hasVoted) {
          console.log("🥵 User has already voted");
        } else {
          console.log("🙂 User has not voted yet");
        }
      } catch (error) {
        console.error("Failed to check if wallet has voted", error);
      }
    };
    checkIfUserHasVoted();
  
  }, [hasClaimedNFT, proposals, address, vote]);

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
        <p >A DAO for Miles' (a Bengali Rock Band) fans</p>
        <button onClick={connectWithMetamask} className="px-28 btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  if (network?.[0].data.chain.id !== ChainId.Rinkeby) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks
          in your connected wallet.
        </p>
      </div>
    );
  }
  // If the user has already claimed their NFT we want to display the interal DAO page to them
  // only DAO members will see this. Render all the members + token amounts.
  if (hasClaimedNFT) {
    return (
      <div className="member-page ">
        <h1>🍪DAO Member Page</h1>
        <p >A DAO for Miles' (a Bengali Rock Band) fans</p>
        <p>Congratulations on being a member</p>
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
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);

                // lets get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // first we need to make sure the user delegates their token to vote
                try {
                  //we'll check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await token.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await token.delegateTo(address);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await vote.get(proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return vote.vote(proposalId, _vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      })
                    );
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await vote.get(proposalId);

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      // and log out a success message
                      console.log("successfully voted");
                    } catch (err) {
                      console.error("failed to execute votes", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  }
                } catch (err) {
                  console.error("failed to delegate tokens");
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                          //default the "abstain" vote to checked
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
              </button>
              {!hasVoted && (
                <small >
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
            </form>
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
    </div>
    );
}

export default App;