import { useMUD } from "../MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useArmyPositions() {
  const { components } = useMUD();

  // Get Army entities
  const armyEntities = useEntityQuery([Has(components.ArmyOwnable)]);
  const value = useObservableValue(components.Position.update$);

  // Transform army positions and store in separate state
  const [armyPositions, setArmyPositions] = useState<any[]>([]);

  useEffect(() => {
    const positions = armyEntities.map((entityIndex) =>
      getComponentValue(components.Position, entityIndex)
    );

    setArmyPositions(positions);
  }, [armyEntities, value]);

  // Return transformed army positions

  return armyPositions;
}
