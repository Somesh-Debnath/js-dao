import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";
const editionDrop = sdk.getEditionDrop("0x19E930057d264Dd061f87461DbE97d090F69398b");
(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "MIlestone",
        description: "This NFT will give you access to phirieDAO!",
        image: readFileSync("scripts/assets/phiriedao.jpg"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();