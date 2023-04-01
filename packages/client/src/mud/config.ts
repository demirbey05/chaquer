import { SetupContractConfig } from "@latticexyz/std-client";
import { getBurnerWallet } from "./getBurnerWallet";

const params = new URLSearchParams(window.location.search);

export const config: SetupContractConfig & { faucetServiceUrl?: string } = {
  clock: {
    period: 1000,
    initialTime: 0,
    syncInterval: 5000,
  },
  provider: {
    jsonRpcUrl:
      params.get("test") === "true"
        ? "https://follower.testnet-chain.linfra.xyz"
        : "http://localhost:8545",
    wsRpcUrl:
      params.get("test") === "true"
        ? "wss://follower.testnet-chain.linfra.xyz"
        : "ws://localhost:8545",
    chainId: params.get("test") === "true" ? 4242 : 31337,
  },
  privateKey: getBurnerWallet().privateKey,
  chainId: params.get("test") === "true" ? 4242 : 31337,
  snapshotServiceUrl: params.get("snapshot") ?? undefined,
  faucetServiceUrl:
    params.get("test") === "true"
      ? "https://faucet.testnet-mud-services.linfra.xyz"
      : undefined,
  initialBlockNumber: Number(params.get("initialBlockNumber")) || 0,
  worldAddress: params.get("worldAddress")!,
  devMode: params.get("dev") === "true",
};
