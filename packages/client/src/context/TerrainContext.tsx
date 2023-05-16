import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  useRef,
} from "react";
import { ethers } from "ethers";

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
  tempCastle: { x: any; y: any };
  isArmySettled: boolean | undefined;
  setIsArmySettled: (value: boolean) => void;
  isArmyStage: boolean | undefined;
  setIsArmyStage: (value: boolean) => void;
  setArmyPosition: (value: { x: number; y: number }) => void;
  armyPosition: { x: any; y: any };
  numberOfArmy: any | undefined;
  setNumberOfArmy: (value: any | undefined) => void;
  fromArmyPosition: { x: any; y: any } | undefined;
  setFromArmyPosition: (value: { x: any; y: any } | undefined) => void;
  isArmyMoveStage: boolean;
  setIsArmyMoveStage: (value: boolean) => void;
  isAttackStage: boolean;
  setIsAttackStage: (value: boolean) => void;
  attackFromArmyPosition: any | undefined;
  setAttackFromArmyPosition: (value: any | undefined) => void;
  attackToArmyPosition: any | undefined;
  setAttackToArmyPosition: (value: any | undefined) => void;
  myArmyConfig: any | undefined;
  setMyArmyConfig: (value: any | undefined) => void;
  enemyArmyConfig: any | undefined;
  setEnemyArmyConfig: (value: any | undefined) => void;
  abiCoder: any;
  isCastleDeployedBefore: boolean;
  setIsCastleDeployedBefore: (value: boolean) => void;
  provider: ethers.providers.BaseProvider;
};

const TerrainContext = createContext<TerrainContextType>({
  values: null,
  setIsLoading: () => {},
  width: 50,
  height: 50,
  setValues: () => {},
  setRefresh: () => {},
  refresh: 0,
  isLoading: false,
  setPermArray: () => {},
  saveTerrain: () => {},
  isCastleSettled: false,
  setIsCastleSettled: () => {},
  setCastle: () => {},
  castle: { x: null, y: null },
  setTempCastle: () => {},
  tempCastle: { x: null, y: null },
  isArmySettled: false,
  setIsArmySettled: () => {},
  isArmyStage: false,
  setIsArmyStage: () => {},
  setArmyPosition: () => {},
  armyPosition: { x: null, y: null },
  numberOfArmy: null,
  setNumberOfArmy: () => {},
  fromArmyPosition: undefined,
  setFromArmyPosition: () => {},
  isArmyMoveStage: false,
  setIsArmyMoveStage: () => {},
  isAttackStage: false,
  setIsAttackStage: () => {},
  attackFromArmyPosition: undefined,
  setAttackFromArmyPosition: () => {},
  attackToArmyPosition: undefined,
  setAttackToArmyPosition: () => {},
  myArmyConfig: undefined,
  setMyArmyConfig: () => {},
  enemyArmyConfig: undefined,
  setEnemyArmyConfig: () => {},
  abiCoder: undefined,
  isCastleDeployedBefore: false,
  setIsCastleDeployedBefore: () => {},
  provider: new ethers.providers.JsonRpcProvider(),
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
  const { current: abiCoder } = useRef(new ethers.utils.AbiCoder());
  const { current: provider } = useRef(new ethers.providers.JsonRpcProvider());

  const [isCastleSettled, setIsCastleSettled] = useState<boolean>();
  const [castle, setCastle] = useState<any>();
  const [tempCastle, setTempCastle] = useState<any>();
  const [isCastleDeployedBefore, setIsCastleDeployedBefore] =
    useState<boolean>(false);

  const [isArmySettled, setIsArmySettled] = useState<boolean>();
  const [isArmyStage, setIsArmyStage] = useState<boolean>();
  const [armyPosition, setArmyPosition] = useState<any>();
  const [numberOfArmy, setNumberOfArmy] = useState<any>();

  const [fromArmyPosition, setFromArmyPosition] = useState<any>();
  const [isArmyMoveStage, setIsArmyMoveStage] = useState<any>();

  const [isAttackStage, setIsAttackStage] = useState<any>();
  const [attackFromArmyPosition, setAttackFromArmyPosition] = useState<any>();
  const [attackToArmyPosition, setAttackToArmyPosition] = useState<any>();
  const [myArmyConfig, setMyArmyConfig] = useState<any>();
  const [enemyArmyConfig, setEnemyArmyConfig] = useState<any>();

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
    isLoading,
    width,
    height,
    setValues,
    setRefresh,
    refresh,
    setPermArray,
    saveTerrain,
    setCastle,
    castle,
    setTempCastle,
    tempCastle,
    setIsCastleSettled,
    isCastleSettled,
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
    isArmyMoveStage,
    setIsArmyMoveStage,
    isAttackStage,
    setIsAttackStage,
    attackFromArmyPosition,
    setAttackFromArmyPosition,
    attackToArmyPosition,
    setAttackToArmyPosition,
    myArmyConfig,
    setMyArmyConfig,
    enemyArmyConfig,
    setEnemyArmyConfig,
    abiCoder,
    isCastleDeployedBefore,
    setIsCastleDeployedBefore,
    provider,
  };

  return (
    <TerrainContext.Provider value={results}>
      {children}
    </TerrainContext.Provider>
  );
};

const useTerrain = () => useContext(TerrainContext);

export { TerrainProvider, useTerrain };
