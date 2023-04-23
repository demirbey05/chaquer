import { useMUD } from "../MUDContext";
import { useEntityQuery } from "@latticexyz/react";
import { getComponentValue, HasValue, Type } from "@latticexyz/recs";
import { useState, useEffect, useRef } from "react";

export function useUserArmy(address: any) {
  const { components } = useMUD();

  // Get Army entities
  const armyEntities = useEntityQuery([
    HasValue(components.ArmyOwnable, { value: address }),
  ]);

  // Transform army positions and store in separate state
  const [armyPositions, setArmyPositions] = useState<any[]>([]);
  const [userArmyNumber, setUserArmyNumber] = useState<number>(0);
  const [armyConfigs, setArmyConfigs] = useState<any[]>([]);

  useEffect(() => {
    const positions = armyEntities.map((entityIndex) =>
      getComponentValue(components.Position, entityIndex)
    );

    const configs = armyEntities.map((entityIndex) =>
      getComponentValue(components.ArmyConfig, entityIndex)
    );

    setArmyPositions(positions);
    setUserArmyNumber(positions.length);
    setArmyConfigs(configs);
  }, [armyEntities]);

  // Return transformed army positions
  return [armyPositions, userArmyNumber, armyConfigs];
}
