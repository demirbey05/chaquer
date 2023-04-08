import { useMUD } from "../MUDContext";
import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useBurnerWallets() {
  const { components } = useMUD();

  const castleEntities = useEntityQuery([Has(components.CastleOwnable)]);
  const [burnerWallets, setBurnerWallets] = useState<any[]>([]);

  useEffect(() => {
    const burnerWallet = castleEntities.map((entityIndex) =>
      getComponentValue(components.CastleOwnable, entityIndex)
    );
    setBurnerWallets(burnerWallet);
  }, [castleEntities]);
  
  return burnerWallets;
}
