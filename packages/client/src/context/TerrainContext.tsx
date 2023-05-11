import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";

type TerrainContextType = {
  values: any;
  setIsLoading: (value: boolean) => void;
  width: number;
  height: number;
  setValues: (value: any) => void;
  setRefresh: (value: number) => void;
  refresh: number;
  isLoading: boolean;
  setPermArray: (value: any) => void;
  saveTerrain: () => void;
  isCastleSettled: boolean | undefined;
  setIsCastleSettled: (value: boolean) => void;
  setCastle: (value: { x: number; y: number }) => void;
  castle: { x: any; y: any };
  setTempCastle: (value: { x: number; y: number }) => void;
  tempCastle: { x: any, y: any };
  isArmySettled: boolean | undefined;
  setIsArmySettled: (value: boolean) => void;
  isArmyStage: boolean | undefined;
  setIsArmyStage: (value: boolean) => void;
  setArmyPosition: (value: { x: number; y: number }) => void;
  armyPosition: { x: any; y: any };
  numberOfArmy: any;
  setNumberOfArmy: (value: any) => void;
  fromArmyPosition: { x: any; y: any } | undefined;
  setFromArmyPosition: (value: { x: any; y: any } | undefined) => void;
  toArmyPosition: { x: any; y: any } | undefined;
  setToArmyPosition: (value: { x: any; y: any } | undefined) => void;
  movingArmyId: any;
  setMovingArmyId: (value: any) => void;
  isArmyMoveStage: boolean;
  setIsArmyMoveStage: (value: boolean) => void;
};

const TerrainContext = createContext<TerrainContextType>({
  values: null,
  setIsLoading: () => { },
  width: 100,
  height: 100,
  setValues: () => { },
  setRefresh: () => { },
  refresh: 0,
  isLoading: false,
  setPermArray: () => { },
  saveTerrain: () => { },
  isCastleSettled: false,
  setIsCastleSettled: () => { },
  setCastle: () => { },
  castle: { x: null, y: null },
  setTempCastle: () => { },
  tempCastle: { x: null, y: null },
  isArmySettled: false,
  setIsArmySettled: () => { },
  isArmyStage: false,
  setIsArmyStage: () => { },
  setArmyPosition: () => { },
  armyPosition: { x: null, y: null },
  numberOfArmy: null,
  setNumberOfArmy: () => { },
  fromArmyPosition: { x: null, y: null },
  setFromArmyPosition: () => { },
  toArmyPosition: { x: null, y: null },
  setToArmyPosition: () => { },
  movingArmyId: null,
  setMovingArmyId: () => { },
  isArmyMoveStage: false,
  setIsArmyMoveStage: () => { }
});

const TerrainProvider: React.FC<{ children: ReactNode }> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const width = 50;
  const height = 50;
  const [values, setValues] = useState<any>(null);
  const [permArray, setPermArray] = useState<any>(null);
  const [refresh, setRefresh] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isCastleSettled, setIsCastleSettled] = useState<boolean>();
  const [castle, setCastle] = useState<any>();
  const [tempCastle, setTempCastle] = useState<any>();

  const [isArmySettled, setIsArmySettled] = useState<boolean>();
  const [isArmyStage, setIsArmyStage] = useState<boolean>();
  const [armyPosition, setArmyPosition] = useState<any>();
  const [numberOfArmy, setNumberOfArmy] = useState<any>();

  const [fromArmyPosition, setFromArmyPosition] = useState<any>();
  const [toArmyPosition, setToArmyPosition] = useState<any>();
  const [movingArmyId, setMovingArmyId] = useState<any>();
  const [isArmyMoveStage, setIsArmyMoveStage] = useState<any>();

  useEffect(() => {
    saveTerrain();
    setIsLoading(false);
  }, [values]);

  useEffect(() => {
    const terrain = window.localStorage.getItem("terrain");
    if (terrain) {
      setValues(JSON.parse(terrain));
    }
  }, []);

  const saveTerrain = () => {
    window.localStorage.setItem("terrain", JSON.stringify(values));
  };

  const results: TerrainContextType = {
    values,
    setIsLoading,
    width,
    height,
    setValues,
    setRefresh,
    refresh,
    isLoading,
    setPermArray,
    saveTerrain,
    isCastleSettled,
    setCastle,
    castle,
    setTempCastle,
    tempCastle,
    setIsCastleSettled,
    isArmySettled,
    setIsArmySettled,
    isArmyStage,
    setIsArmyStage,
    armyPosition,
    setArmyPosition,
    numberOfArmy,
    setNumberOfArmy,
    fromArmyPosition,
    setFromArmyPosition,
    toArmyPosition,
    setToArmyPosition,
    movingArmyId,
    setMovingArmyId,
    isArmyMoveStage,
    setIsArmyMoveStage
  };

  return (
    <TerrainContext.Provider value={results}>
      {children}
    </TerrainContext.Provider>
  );
};

const useTerrain = () => useContext(TerrainContext);

export { TerrainProvider, useTerrain };
