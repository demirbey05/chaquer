import { Wallet } from "ethers";

export const getBurnerWallet = () => {
  const privateKey = localStorage.getItem("naka:burnerWallet");
  if (privateKey) return new Wallet(privateKey);

  const burnerWallet = Wallet.createRandom();
  localStorage.setItem("naka:burnerWallet", burnerWallet.privateKey);
  return burnerWallet;
};
