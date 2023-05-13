import { Button } from "@chakra-ui/react";
import { useTerrain } from "../../context/TerrainContext";
import { useRef } from "react";
import { EntityID } from "@latticexyz/recs";
import offcanvasImg from '../../images/offcanvas-bg.png';
import offcanvasImg2 from '../../images/offcanvas-bg2.png';

function ArmyAttackModal() {
    const { setMyArmyConfig, setEnemyArmyConfig, myArmyConfig, enemyArmyConfig, setIsAttackStage, attackFromArmyPosition, attackToArmyPosition, setAttackToArmyPosition, setAttackFromArmyPosition } = useTerrain();
    const attackFromArmyId = useRef<EntityID>("0" as EntityID);
    const attackToArmyId = useRef<EntityID>("0" as EntityID);
    const handleAttackLater = () => {
        setIsAttackStage(false);
        setMyArmyConfig(undefined)
        setEnemyArmyConfig(undefined)
    }

    const handleAttack = async () => {
        setIsAttackStage(false);
        setMyArmyConfig(undefined)
        setEnemyArmyConfig(undefined)
    }

    return (
        <div className="offcanvas offcanvas-bottom rounded-4 font-bold text-white"
            data-bs-keyboard="false"
            data-bs-backdrop="false"
            style={{
                width: "500px",
                left: "0",
                right: "0",
                margin: "auto",
                bottom: "25px",
                padding: "10px",
                backgroundImage: `url(${offcanvasImg2})`,
                backgroundSize: "cover"
            }}
            tabIndex={-1}
            id="offcanvasBottom"
            aria-labelledby="offcanvasBottomLabel">
            <h5 className="offcanvas-title text-center border-bottom border-dark text-dark" id="offcanvasBottomLabel">War-Army Information</h5>
            <div className="offcanvas-body small">
                <div className="row">
                    <div className="col-6">
                        <h1 className="text-center border-bottom border-success text-dark">My Army</h1>
                        <div className="row">
                            <div className="row justify-content-center text-center mt-2">
                                <p>Swordsman: {myArmyConfig && myArmyConfig.armyConfig.numSwordsman}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="row justify-content-center text-center mt-2">
                                <p>Archer: {myArmyConfig && myArmyConfig.armyConfig.numArcher}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="row justify-content-center text-center mt-2">
                                <p>Cavalry: {myArmyConfig && myArmyConfig.armyConfig.numCavalry}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <h1 className="text-center border-bottom border-danger text-dark">Enemy Army</h1>
                        <div className="row">
                            <div className="row justify-content-center text-center mt-2">
                                <p>Swordsman: {enemyArmyConfig && enemyArmyConfig.armyConfig.numSwordsman}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="row justify-content-center text-center mt-2">
                                <p>Archer: {enemyArmyConfig && enemyArmyConfig.armyConfig.numArcher}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="row justify-content-center text-center mt-2">
                                <p>Cavalry: {enemyArmyConfig && enemyArmyConfig.armyConfig.numCavalry}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <div className="flex-column align-items-center">
                    <Button
                        colorScheme="whatsapp"
                        border="solid"
                        textColor="dark"
                        data-bs-dismiss="offcanvas"
                        onClick={handleAttack}
                        className="mr-2"
                    >
                        Attack to the Enemy
                    </Button>
                    <Button
                        colorScheme="red"
                        border="solid"
                        textColor="dark"
                        data-bs-dismiss="offcanvas"
                        onClick={handleAttackLater}
                        className="ml-2"
                    >
                        Wait and Attack Later
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ArmyAttackModal
