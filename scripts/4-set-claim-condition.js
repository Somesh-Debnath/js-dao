import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0x19E930057d264Dd061f87461DbE97d090F69398b");

(async ()=>{
    try{
        const claimConditions=[{
            startTime:new Date(),
            price:0,
            max_Quantity:50000,
            qunatityLimitPerTransaction:1,
            waitINSeconds:MaxUint256

        }]
        await editionDrop.claimConditions.set("0", claimConditions);
       console.log("✅ Successfully set claim condition!");
    } catch (error) {
      console.error("Failed to set claim condition", error);
    }
  })();