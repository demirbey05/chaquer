import {
    useState,
    useEffect,
    useContext,
    createContext,
    ReactNode,
  } from "react";
  
type PlayerContextType = {

};

const PlayerContext = createContext<PlayerContextType>({

});

const PlayerProvider: React.FC<{ children: ReactNode }> = ({children,}: {children: ReactNode;}) => {

const results: PlayerContextType = {
    
};

return (
    <PlayerContext.Provider value={results}>
    {children}
    </PlayerContext.Provider>
);
};
  
const usePlayer = () => useContext(PlayerContext);

export { PlayerProvider, usePlayer };
  