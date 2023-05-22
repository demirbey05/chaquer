import { Button } from "@chakra-ui/react";
import archerImg from "../../images/archer.png";
import cavalryImg from "../../images/cavalry.png";
import swordsmanImg from "../../images/swordsman.png";
import { getBurnerWallet } from "../../mud/getBurnerWallet";
import { useMyArmy } from "../../hooks/useMyArmy";
import React from "react";

const scrollToDiv = (targetId: any) => {
    const targetDiv = document.getElementById(targetId);
    const scrollOptions: any = {
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
    };

    if (targetDiv) {
        targetDiv.scrollIntoView(scrollOptions);
    }
};


function ArmyInfoModal() {
    const myArmyPosition: any = useMyArmy(getBurnerWallet().address.toLocaleLowerCase())[0];

    const handleClick = (targetId: any) => {
        scrollToDiv(targetId);

        var myDiv = document.getElementById(targetId);
        myDiv?.classList.add("animate-border");

        setTimeout(function () {
            myDiv?.classList.remove("animate-border");
        }, 6000);
    };

    return (
        <>
            <Button style={{
                zIndex: 1,
                height: "60px",
                width: "60px",
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                marginTop: "25px",
                fontSize: "30px"
            }} type="button" colorScheme="yellow" data-bs-toggle="offcanvas" data-bs-target="#armyInfoModal" aria-controls="staticBackdrop">
                ⚔️
            </Button>

            <div style={{ height: "625px", marginTop: "25px", padding: "10px" }} className="offcanvas offcanvas-end" data-bs-keyboard="false" data-bs-backdrop="false" id="armyInfoModal" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="staticBackdropLabel">My Army Details</h5>
                    <button type="button" data-bs-dismiss="offcanvas" aria-label="Close">&#10008;</button>
                </div>
                <hr></hr>
                <div className="offcanvas-body">
                    {myArmyPosition.length === 0 ? (<p>You have no army!</p>) :
                        (
                            <>
                                {
                                    myArmyPosition.map((army: any, index: number) => {
                                        return (<React.Fragment key={index}>
                                            <div className="row mt-2">
                                                <div className="col align-items-center">
                                                    <div className="row justify-content-center">
                                                        <img
                                                            src={swordsmanImg}
                                                            style={{ height: "75px", width: "65px" }}
                                                        />
                                                    </div>
                                                    <div className="row justify-content-center text-center border-1 mt-2">
                                                        <p style={{ fontSize: "12px" }}>Swordsman: {army.armyConfig.numSwordsman}</p>
                                                    </div>
                                                </div>
                                                <div className="col align-items-center">
                                                    <div className="row justify-content-center">
                                                        <img
                                                            src={archerImg}
                                                            style={{ height: "75px", width: "65px" }}
                                                        />
                                                    </div>
                                                    <div className="row justify-content-center text-center border-1 mt-2">
                                                        <p style={{ fontSize: "12px" }}>Archer: {army.armyConfig.numArcher}</p>
                                                    </div>
                                                </div>
                                                <div className="col align-items-center">
                                                    <div className="row justify-content-center">
                                                        <img
                                                            src={cavalryImg}
                                                            style={{ height: "75px", width: "75px" }}
                                                        />
                                                    </div>
                                                    <div className="row justify-content-center text-center border-1 mt-2">
                                                        <p style={{ fontSize: "12px" }}>Cavalry: {army.armyConfig.numCavalry}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-2 align-items-center justify-content-center">
                                                <Button
                                                    colorScheme="linkedin"
                                                    style={{ width: "100px", marginBottom: "5px" }}
                                                    data-bs-toggle="offcanvas"
                                                    data-bs-target="#armyInfoModal"
                                                    onClick={() => handleClick(`${army.position.y},${army.position.x}`)}
                                                >
                                                    Find on Map
                                                </Button>
                                            </div>
                                            <hr></hr>
                                        </React.Fragment>)
                                    })
                                }
                            </>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default ArmyInfoModal
