const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("====================================================");
  console.log("DEPLOYING NEW ARGL STAKING VAULT");
  console.log("====================================================");
  console.log("Deployer Address:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer Balance:", hre.ethers.formatEther(balance), "ETH");

  const stakingTokenAddress = "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168"; // Official USDG
  const rewardTokenAddress = "0x072cbbe76b64851af9b527abdbf1ce0039b1f09d";  // Earlier reward token (pre-ARGL)

  console.log("\nStaking Token (USDG):", stakingTokenAddress);
  console.log("Reward Token ($ARGL):", rewardTokenAddress);

  // Initial reward rate: 0.0005 tokens per second (~43.2 ARGL/day)
  const initialRewardRate = hre.ethers.parseUnits("0.0005", 18);

  console.log("\nDeploying Layer5Staking contract...");
  const Layer5Staking = await hre.ethers.getContractFactory("Layer5Staking");
  const stakingContract = await Layer5Staking.deploy(
    stakingTokenAddress,
    rewardTokenAddress,
    initialRewardRate
  );

  await stakingContract.waitForDeployment();
  const stakingContractAddress = await stakingContract.getAddress();

  console.log("\n>>> SUCCESS! New Staking Vault deployed at:", stakingContractAddress);
  console.log("Vault Owner:", await stakingContract.owner());

  // Update .env
  console.log("\nUpdating .env file...");
  const envPath = path.resolve(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf-8");
    envContent = envContent.replace(
      /NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=.*/,
      `NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS="${stakingContractAddress}"`
    );
    envContent = envContent.replace(
      /STAKING_CONTRACT_ADDRESS=.*/,
      `STAKING_CONTRACT_ADDRESS="${stakingContractAddress}"`
    );
    envContent = envContent.replace(
      /NEXT_PUBLIC_REWARD_TOKEN_ADDRESS=.*/,
      `NEXT_PUBLIC_REWARD_TOKEN_ADDRESS="${rewardTokenAddress}"`
    );
    envContent = envContent.replace(
      /REWARD_TOKEN_ADDRESS=.*/,
      `REWARD_TOKEN_ADDRESS="${rewardTokenAddress}"`
    );
    fs.writeFileSync(envPath, envContent, "utf-8");
    console.log(">>> SUCCESS! .env updated.");
  }

  // Update .env.example
  console.log("Updating .env.example file...");
  const envExamplePath = path.resolve(__dirname, "../.env.example");
  if (fs.existsSync(envExamplePath)) {
    let envExampleContent = fs.readFileSync(envExamplePath, "utf-8");
    envExampleContent = envExampleContent.replace(
      /NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=.*/,
      `NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS="${stakingContractAddress}"`
    );
    envExampleContent = envExampleContent.replace(
      /STAKING_CONTRACT_ADDRESS=.*/,
      `STAKING_CONTRACT_ADDRESS="${stakingContractAddress}"`
    );
    envExampleContent = envExampleContent.replace(
      /NEXT_PUBLIC_REWARD_TOKEN_ADDRESS=.*/,
      `NEXT_PUBLIC_REWARD_TOKEN_ADDRESS="${rewardTokenAddress}"`
    );
    envExampleContent = envExampleContent.replace(
      /REWARD_TOKEN_ADDRESS=.*/,
      `REWARD_TOKEN_ADDRESS="${rewardTokenAddress}"`
    );
    fs.writeFileSync(envExamplePath, envExampleContent, "utf-8");
    console.log(">>> SUCCESS! .env.example updated.");
  }

  console.log("\n====================================================");
  console.log("CONFIGURATION COMPLETE!");
  console.log("====================================================");
  console.log("Staking Vault CA:", stakingContractAddress);
  console.log("Reward Token ($ARGL) CA:", rewardTokenAddress);
  console.log("Staking Asset (USDG) CA:", stakingTokenAddress);
  console.log("====================================================");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Deployment failed:", err);
    process.exit(1);
  });
