import { useState, useEffect, useContext, createContext, FC, ReactNode } from 'react';

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
};

const TerrainContext = createContext<TerrainContextType>({
  values: null,
  setIsLoading: () => {},
  width: 100,
  height: 100,
  setValues: () => {},
  setRefresh: () => {},
  refresh: 0,
  isLoading: false,
  setPermArray: () => {},
  saveTerrain: () => {},
});

const TerrainProvider: React.FC<{ children: ReactNode }> = ({ children } : { children: ReactNode }) => {
  const width = 100;
  const height = 100;
  const [values, setValues] = useState<any>(null);
  const [permArray, setPermArray] = useState<any>(null);
  const [refresh, setRefresh] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    saveTerrain();
    setIsLoading(false);
  }, [values]);

  useEffect(() => {
    const terrain = window.localStorage.getItem('terrain');
    if (terrain) {
        setValues(JSON.parse(terrain));
    }
  }, []);

  const saveTerrain = () => {
    window.localStorage.setItem('terrain', JSON.stringify(values));
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
  };

  return (
    <TerrainContext.Provider value={results}>
      {children}
    </TerrainContext.Provider>
  );
};

const useTerrain = () => useContext(TerrainContext);

export { TerrainProvider, useTerrain };
