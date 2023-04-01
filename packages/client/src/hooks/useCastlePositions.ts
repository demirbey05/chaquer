import { useMUD } from "../MUDContext";
import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useCastlePositions() {
  const { components } = useMUD();

  // Get Castle entities
  const castleEntities = useEntityQuery([Has(components.CastleOwnable)]);
  console.log(castleEntities);

  // Transform castle positions and store in separate state
  const [castlePositions, setCastlePositions] = useState<any[]>([]);
  useEffect(() => {
    const positions = castleEntities.map((entityIndex) =>
      getComponentValue(components.Position, entityIndex)
    );
    setCastlePositions(positions);
  }, [castleEntities]);

  // Return transformed castle positions
  return castlePositions;
}
