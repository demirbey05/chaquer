import { SingletonID, TxQueue } from "@latticexyz/network";
import { Type, World } from "@latticexyz/recs";
import { SystemTypes } from "contracts/types/SystemTypes";
import { contractComponents } from "./mud/components";
import { useMUD } from "./MUDContext";
import { ethers } from "ethers";
import { useState } from "react";
import { useComponentValue } from "@latticexyz/react";

type Props = {
  world?: World;
  systems: TxQueue<SystemTypes>;
  components: typeof contractComponents;
};

export const App = () => {
  const { components, systems, singletonEntity } = useMUD();
  const map = useComponentValue(components.MapConfig, singletonEntity);
  const handleClick = async (e: any) => {
    e.preventDefault();
    const tx = await systems["system.Init"].execute(
      "0x01010101010101010101010101010101001010"
    );
    const tc = await tx.wait();
    console.log(map?.value);
  };

  return (
    <>
      <h1>Hello</h1>
      <button onClick={handleClick}>Send tx </button>
    </>
  );
};
