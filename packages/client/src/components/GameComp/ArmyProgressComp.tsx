import { useEffect } from 'react'
import "../../styles/globals.css";
import { useTerrain } from '../../context/TerrainContext';
import { getBurnerWallet } from "../../mud/getBurnerWallet";
import { useUserArmy } from '../../hooks/useUserArmy';

function ArmyProgressComp() {
    const { numberOfArmy } = useTerrain();
    const myArmyPosition: any = useUserArmy(getBurnerWallet().address.toLocaleLowerCase())[0];

    useEffect(() => {
        if (numberOfArmy === 1) {
            document.getElementById('army1')!.style.backgroundColor = "green";
            document.getElementById('army2')!.style.backgroundColor = "lightgray";
            document.getElementById('army3')!.style.backgroundColor = "lightgray";
        }
        else if (numberOfArmy === 2) {
            document.getElementById('army1')!.style.backgroundColor = "green";
            document.getElementById('army2')!.style.backgroundColor = "green";
            document.getElementById('army3')!.style.backgroundColor = "lightgray";
        }
        else if (numberOfArmy === 3) {
            document.getElementById('army1')!.style.backgroundColor = "green";
            document.getElementById('army2')!.style.backgroundColor = "green";
            document.getElementById('army3')!.style.backgroundColor = "green";
        }
        else {
            document.getElementById('army1')!.style.backgroundColor = "lightgray";
            document.getElementById('army2')!.style.backgroundColor = "lightgray";
            document.getElementById('army3')!.style.backgroundColor = "lightgray";
        }
    }, [numberOfArmy, myArmyPosition])

    return (
        <div className="progress-bar">
            <div id="army1" className="progress progress-text">⚔️</div>
            <div id="army2" className="progress progress-text">⚔️</div>
            <div id="army3" className="progress progress-text">⚔️</div>
        </div>
    )
}

export default ArmyProgressComp
