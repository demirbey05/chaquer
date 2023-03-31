import { useMUD } from "../MUDContext";
import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useCastlePositions() {
  const { components } = useMUD();

  // Get Castle
  const castleEntities = useEntityQuery([Has(components.CastleOwnable)]);
  const [castlePositions, setCastlePositions] = useState<any[]>([]);

  useEffect(() => {
    castleEntities.forEach((entityIndex) => {
      setCastlePositions([
        ...castlePositions,
        getComponentValue(components.Position, entityIndex),
      ]);
    });
  }, [castleEntities]);

  return castlePositions;
}
