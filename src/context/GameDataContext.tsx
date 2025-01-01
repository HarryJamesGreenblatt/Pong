import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the context value
interface GameDataProviderProps {
    children: ReactNode;
}

// Define the shape of the game data
interface GameData {
    volleys: number;
    leftScore: number;
    rightScore: number;
    timeTaken: number;
    endTime: number; 
    scorer: 'Yellow' | 'Blue';
  }
  

// Create the context which will hold the game data
const GameDataContext = createContext<{
    gameData: GameData[];
    setGameData: React.Dispatch<React.SetStateAction<GameData[]>>;
} | null>(null);


// Create the provider component
export const GameDataProvider: React.FC<GameDataProviderProps>  = ({ children }) => {
  
    // State to hold the game data
    const [gameData, setGameData] = useState<any[]>([]);

    // Provide the context value to the children
    return (
        <GameDataContext.Provider value={{ gameData, setGameData }}>
            {children}
        </GameDataContext.Provider>
    );
};


// Create a custom hook to use the context
export const useGameData = () => {

    // Get the context value
    const context = useContext(GameDataContext);

    // Throw an error if the context is not found
    if (!context) {
      throw new Error('useGameData must be used within a GameDataProvider');
    }

    return context;
};