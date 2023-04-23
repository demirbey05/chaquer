import { useEffect } from 'react'
import "../../styles/globals.css";
import { useTerrain } from '../../context/TerrainContext';

function ArmyProgressComp() {
    const { numberOfArmy } = useTerrain();

    useEffect(() => {
        if (numberOfArmy === 1) {
            document.getElementById('army1')!.style.backgroundColor = "green";
        }
        else if (numberOfArmy === 2) {
            document.getElementById('army1')!.style.backgroundColor = "green";
            document.getElementById('army2')!.style.backgroundColor = "green";
        }
        else if (numberOfArmy === 3) {
            document.getElementById('army1')!.style.backgroundColor = "green";
            document.getElementById('army2')!.style.backgroundColor = "green";
            document.getElementById('army3')!.style.backgroundColor = "green";
        }
    }, [numberOfArmy])

    return (
        <div className="progress-bar">
            <div id="army1" className="progress progress-text">⚔️</div>
            <div id="army2" className="progress progress-text">⚔️</div>
            <div id="army3" className="progress progress-text">⚔️</div>
        </div>
    )
}

export default ArmyProgressComp
