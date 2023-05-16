import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { useMUD } from "../MUDContext";
import { HasValue, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";
import { useTerrain } from "../context/TerrainContext";

export function useCastlePositionByAddress(address: any) {
  const { components } = useMUD();
  const { isCastleSettled } = useTerrain();

  const castleEntity = useEntityQuery([HasValue(components.CastleOwnable, { value: address })]);

  const [castlePosition, setCastlePosition] = useState<any>();
  const value = useObservableValue(components.Position.update$);

  useEffect(() => {
    const castlePosition = getComponentValue(components.Position, [...castleEntity][0]);
    setCastlePosition(castlePosition);
  }, [castleEntity, value]);

  return castlePosition;
}
