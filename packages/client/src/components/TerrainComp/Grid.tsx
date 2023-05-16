import { TerrainType } from "../../terrain-helper/types";
import grassImg from "../../images/grass.png";
import mountainImg from "../../images/mountain.png";
import seaImg from "../../images/sea.png";
import { useTerrain } from "../../context/TerrainContext";
import "../../styles/globals.css";
import CastleSettleModal from "../BootstrapComp/CastleSettleModal";
import { useCastlePositions } from "../../hooks/useCastlePositions";
import { useEffect, useState, useRef } from "react";
import { getBurnerWallet } from "../../mud/getBurnerWallet";
import { useCastlePositionByAddress } from "../../hooks/useCastlePositionByAddress";
import ArmySettleModal from "../BootstrapComp/ArmySettleModal";
import { useArmyPositions } from "../../hooks/useArmyPositions";
import { useUserArmy } from "../../hooks/useUserArmy";
import {
  EntityID,
  getComponentEntities,
  getComponentValue,
} from "@latticexyz/recs";
import { useMUD } from "../../MUDContext";
import AttackModal from "../BootstrapComp/ArmyAttackModal";
import CastleAttackModal from "../BootstrapComp/CastleAttackModal";
import { findIDFromPosition, Coord } from "../../utils/armyID";

export type DataProp = {
  width: number;
  height: number;
  values: Array<Array<TerrainType>>;
  pixelStyles: Array<any>;
  isBorder: boolean;
};

function bgImg(data: any) {
  if (data === 1) {
    return `url(${grassImg})`;
  } else if (data === 2) {
    return `url(${seaImg})`;
  } else {
    return `url(${mountainImg})`;
  }
}

function getDataAtrX(event: any) {
  const id = event.target.dataset.row;
  return id.toString();
}

function getDataAtrY(event: any) {
  const id = event.target.dataset.column;
  return id.toString();
}

function canCastleBeSettle(data: any) {
  if (data !== 1) {
    return false;
  }
  return true;
}

function isMyArmy(position: { x: number; y: number }, myArmyPositions: any[]) {
  if (myArmyPositions) {
    return myArmyPositions.some((data: any) => {
      return (
        data.position.x.toString() === position.x.toString() &&
        data.position.y.toString() === position.y.toString()
      );
    });
  }
  return false;
}

function isEnemyArmy(
  position: any,
  armyPositions: any[],
  myArmyPositions: any[]
) {
  if (armyPositions && myArmyPositions) {
    const filteredArray = armyPositions.filter(
      (element) =>
        !myArmyPositions.some(
          (data: any) =>
            JSON.stringify(data.position) === JSON.stringify(element.position)
        )
    );
    if (filteredArray) {
      return filteredArray.some((data: any) => {
        return (
          data.position.x.toString() === position.x.toString() &&
          data.position.y.toString() === position.y.toString()
        );
      });
    }
  }
  return false;
}

function isEnemyCastle(
  position: any,
  myCastlePosition: any[],
  castlePositions: any[]
) {
  if (myCastlePosition && castlePositions) {
    const filteredArray = castlePositions.filter(
      (element) => myCastlePosition.map((position: any) => {
        !(JSON.stringify(position) === JSON.stringify(element))
      })
    );
    if (filteredArray) {
      return filteredArray.some((data: any) => {
        return (
          data.x.toString() === position.x.toString() &&
          data.y.toString() === position.y.toString()
        );
      });
    }
  }
  return false;
}

function getEnemyArmyConfigByPosition(
  position: { x: any; y: any },
  armyPositions: any[]
) {
  if (armyPositions) {
    const armyConfig = armyPositions.find((data: any) => {
      return (
        position.x.toString() === data.position.x.toString() &&
        position.y.toString() === data.position.y.toString()
      );
    });
    return armyConfig;
  }
}

function getMyArmyConfigByPosition(
  position: { x: any; y: any },
  myArmyPosition: any[]
) {
  if (myArmyPosition) {
    const armyConfig = myArmyPosition.find((data: any) => {
      return (
        position.x.toString() === data.position.x.toString() &&
        position.y.toString() === data.position.y.toString()
      );
    });
    return armyConfig;
  }
}

function canArmyBeSettle(position: { x: number; y: number }) {
  const positions = [
    { x: position.x + 1, y: position.y },
    { x: position.x + 1, y: position.y + 1 },
    { x: position.x + 1, y: position.y + 2 },
    { x: position.x + 1, y: position.y - 1 },
    { x: position.x + 1, y: position.y - 2 },
    { x: position.x + 2, y: position.y },
    { x: position.x + 2, y: position.y + 1 },
    { x: position.x + 2, y: position.y - 1 },
    { x: position.x + 3, y: position.y },
    { x: position.x - 1, y: position.y },
    { x: position.x - 1, y: position.y + 1 },
    { x: position.x - 1, y: position.y + 2 },
    { x: position.x - 1, y: position.y - 2 },
    { x: position.x - 1, y: position.y - 1 },
    { x: position.x - 2, y: position.y },
    { x: position.x - 2, y: position.y + 1 },
    { x: position.x - 2, y: position.y - 1 },
    { x: position.x - 3, y: position.y },
    { x: position.x, y: position.y + 1 },
    { x: position.x, y: position.y + 2 },
    { x: position.x, y: position.y + 3 },
    { x: position.x, y: position.y - 3 },
    { x: position.x, y: position.y - 2 },
    { x: position.x, y: position.y - 1 },
  ];

  return positions;
}

export function Grid(data: DataProp) {
  const width = data.width;
  const height = data.height;
  const values = data.values;
  const rows = Array.from({ length: height }, (v, i) => i);
  const columns = Array.from({ length: width }, (v, i) => i);
  const { components, systems, world } = useMUD();

  const {
    setIsArmyMoveStage,
    isArmyMoveStage,
    fromArmyPosition,
    setFromArmyPosition,
    isCastleSettled,
    setIsCastleSettled,
    setTempCastle,
    isArmyStage,
    setArmyPosition,
    setNumberOfArmy,
    numberOfArmy,
    attackFromArmyPosition,
    setAttackFromArmyPosition,
    attackToArmyPosition,
    setAttackToArmyPosition,
    isAttackStage,
    setIsAttackStage,
    setMyArmyConfig,
    setEnemyArmyConfig,
    abiCoder,
    setIsCastleDeployedBefore
  } = useTerrain();
  const [tempArmyPos, setTempArmyPos] = useState<any>();
  const movingArmyId = useRef<EntityID>("0" as EntityID);
  const toArmyPosition = useRef({ x: -1, y: -1 });
  const fromArmyPositionRef = useRef<Coord>({ x: "-1", y: "-1" });
  const tempMyCastlePositions = useRef<any[]>([]);

  const castlePositions = useCastlePositions();
  const myCastlePosition = useCastlePositionByAddress(
    getBurnerWallet().address.toLocaleLowerCase()
  );
  const armyPositions: any = useArmyPositions()[0];
  const myArmyPosition: any = useUserArmy(
    getBurnerWallet().address.toLocaleLowerCase()
  )[0];
  const myArmyNumber = useUserArmy(
    getBurnerWallet().address.toLocaleLowerCase()
  )[1];

  console.log(myCastlePosition)
  // Handle Clicks
  const handleClick = async (e: any) => {
    if (!isCastleSettled) {
      setTempCastle({ x: getDataAtrX(e), y: getDataAtrY(e) });
    }

    if (isArmyStage) {
      setArmyPosition({ x: getDataAtrX(e), y: getDataAtrY(e) });
    }

    if (
      !fromArmyPosition &&
      isCastleSettled &&
      !isArmyStage &&
      myArmyPosition &&
      isMyArmy({ x: getDataAtrX(e), y: getDataAtrY(e) }, myArmyPosition)
    ) {
      setFromArmyPosition({ x: getDataAtrX(e), y: getDataAtrY(e) });
      setTempArmyPos({ x: getDataAtrX(e), y: getDataAtrY(e) });
      setIsArmyMoveStage(true);
      setIsAttackStage(true);
    } else if (
      fromArmyPosition &&
      canArmyBeSettle({
        x: parseInt(fromArmyPosition.x),
        y: parseInt(fromArmyPosition.y),
      }).some(
        (item) =>
          item.x.toString() === getDataAtrX(e) &&
          item.y.toString() === getDataAtrY(e)
      )
    ) {
      toArmyPosition.current = { x: getDataAtrX(e), y: getDataAtrY(e) };
      fromArmyPositionRef.current = {
        x: fromArmyPosition.x,
        y: fromArmyPosition.y,
      };

      //If user attack to the enemy army
      if (isEnemyArmy(toArmyPosition.current, armyPositions, myArmyPosition)) {
        setAttackFromArmyPosition(fromArmyPositionRef.current);
        setFromArmyPosition(undefined);
        setAttackToArmyPosition(toArmyPosition.current);
        setMyArmyConfig(
          getMyArmyConfigByPosition(
            {
              x: fromArmyPositionRef.current.x,
              y: fromArmyPositionRef.current.y,
            },
            myArmyPosition
          )
        );
        setEnemyArmyConfig(
          getEnemyArmyConfigByPosition(
            { x: toArmyPosition.current.x, y: toArmyPosition.current.y },
            armyPositions
          )
        );
        toArmyPosition.current = { x: -1, y: -1 };
        fromArmyPositionRef.current = { x: "-1", y: "-1" };
        setIsArmyMoveStage(false);
        armyPositions.map((data: any) => {
          if (attackFromArmyPosition) {
            canArmyBeSettle({
              x: attackFromArmyPosition.x,
              y: attackFromArmyPosition.y,
            }) &&
              !isMyArmy(
                { x: data.position.x, y: data.position.y },
                myArmyPosition
              ) &&
              document
                .getElementById(`${data.position.y},${data.position.x}`)!
                .setAttribute("data-bs-toggle", "");
            canArmyBeSettle({
              x: attackFromArmyPosition.x,
              y: attackFromArmyPosition.y,
            }) &&
              !isMyArmy(
                { x: data.position.x, y: data.position.y },
                myArmyPosition
              ) &&
              document
                .getElementById(`${data.position.y},${data.position.x}`)!
                .setAttribute("data-bs-target", "");
          }
        });
      }
      //If user attack to the enemy castle
      else if (
        isEnemyCastle(toArmyPosition.current, myCastlePosition, castlePositions)
      ) {
        setAttackFromArmyPosition(fromArmyPosition);
        setFromArmyPosition(undefined);
        setAttackToArmyPosition(toArmyPosition.current);
        setMyArmyConfig(
          getMyArmyConfigByPosition(
            {
              x: fromArmyPositionRef.current.x,
              y: fromArmyPositionRef.current.y,
            },
            myArmyPosition
          )
        );
        setEnemyArmyConfig(
          getEnemyArmyConfigByPosition(
            { x: toArmyPosition.current.x, y: toArmyPosition.current.y },
            armyPositions
          )
        );
        toArmyPosition.current = { x: -1, y: -1 };
        fromArmyPositionRef.current = { x: "-1", y: "-1" };
        setIsArmyMoveStage(false);
        castlePositions.map((data: any) => {
          if (attackFromArmyPosition) {
            canArmyBeSettle({
              x: attackFromArmyPosition.x,
              y: attackFromArmyPosition.y,
            }) &&
              isEnemyCastle(
                { x: data.x, y: data.y },
                myCastlePosition,
                castlePositions
              ) &&
              document
                .getElementById(`${data.y},${data.x}`)!
                .setAttribute("data-bs-toggle", "");
            canArmyBeSettle({
              x: attackFromArmyPosition.x,
              y: attackFromArmyPosition.y,
            }) &&
              isEnemyCastle(
                { x: data.x, y: data.y },
                myCastlePosition,
                castlePositions
              ) &&
              document
                .getElementById(`${data.y},${data.x}`)!
                .setAttribute("data-bs-target", "");
          }
        });
      } else {
        if (
          canCastleBeSettle(
            values[toArmyPosition.current.x][toArmyPosition.current.y]
          )
        ) {
          // Get the ArmyID from the coordinates
          let movingArmyIdMap = findIDFromPosition(
            fromArmyPositionRef.current,
            components.Position,
            world
          );
          if (movingArmyIdMap !== null) {
            movingArmyId.current = movingArmyIdMap;
          }
          if (toArmyPosition.current && isArmyMoveStage) {
            try {
              const tx = await systems["system.MoveArmy"].execute(
                abiCoder.encode(
                  ["uint256", "uint32", "uint32"],
                  [
                    movingArmyId.current,
                    toArmyPosition?.current.x,
                    toArmyPosition?.current.y,
                  ]
                )
              );
              document.getElementById(
                `${fromArmyPosition.y},${fromArmyPosition.x}`
              )!.innerHTML = "";
              document.getElementById(
                `${fromArmyPosition.y},${fromArmyPosition.x}`
              )!.style.border = "";

              setIsArmyMoveStage(false);
              setFromArmyPosition(undefined);
              toArmyPosition.current = { x: -1, y: -1 };
              const tc = await tx.wait();
            } catch (err: any) {
              const revertData = err.transaction;
            }
          }
        }
      }
    } else {
      setFromArmyPosition(undefined);
      toArmyPosition.current = { x: -1, y: -1 };
      fromArmyPositionRef.current = { x: "-1", y: "-1" }
      setIsArmyMoveStage(false);
      setIsAttackStage(false);
    }
  };

  // Check if castle settled before and deploy castle emojis
  useEffect(() => {
    //Checks that if the user has already settled the castle
    if (myCastlePosition.length > 0) {
      myCastlePosition.map((position: any) => {
        document.getElementById(
          `${position.y},${position.x}`
        )!.style.border = "2px solid rgb(245, 169, 6)";
      })
    }
    setIsCastleDeployedBefore(true)

    if (castlePositions) {
      //Puts the castle emojis to castle positions
      castlePositions.map(
        (data) =>
          (document.getElementById(`${data.y},${data.x}`)!.innerHTML = "🏰")
      );
    }

    return () => {
      myCastlePosition.map((position: any) => {
        document.getElementById(
          `${position.y},${position.x}`
        )!.style.border = "";
      })
    }
  }, [castlePositions, myCastlePosition]);

  useEffect(() => {
    //Makes castle position unClickable to not cause bug during army settlement
    if (castlePositions) {
      castlePositions.map((data) => {
        document
          .getElementById(`${data.y},${data.x}`)!
          .setAttribute("data-bs-toggle", "");
      });
    }
  }, [isArmyStage]);

  // Deploy army emojis to position. Add border for user's army.
  useEffect(() => {
    const clearBoard = () => {
      const boardElements = document.getElementsByClassName("army-emoji");
      Array.from(boardElements).forEach((element: any) => {
        element.innerHTML = "";
        element.style.border = ""; // Clear the border
      });
    };



    if (myArmyPosition) {
      // Clear the board before redeploying army emojis
      clearBoard();

      myArmyPosition.forEach((data: any) => {
        const element = document.getElementById(
          `${data.position.y},${data.position.x}`
        )!;
        element.innerHTML = "⚔️";
        element.style.border = "2px solid rgb(245, 169, 6)";
      });
    }

    setNumberOfArmy(myArmyNumber);

    //Puts the castle emojis to castle positions
    armyPositions.map((data: any) => {
      document.getElementById(
        `${data.position.y},${data.position.x}`
      )!.innerHTML = "⚔️";
      document
        .getElementById(`${data.position.y},${data.position.x}`)
        ?.classList.add("army-emoji");
    });
  }, [armyPositions, myArmyPosition]);

  // Handle Army and Castle Attack OffCanvas
  useEffect(() => {
    armyPositions.map((data: any) => {
      if (isAttackStage && fromArmyPositionRef.current) {
        canArmyBeSettle({ x: parseInt(fromArmyPositionRef.current.x), y: parseInt(fromArmyPositionRef.current.y) }) &&
          !isMyArmy({ x: data.position.x, y: data.position.y }, myArmyPosition) &&
          document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-toggle", "offcanvas");
        canArmyBeSettle({ x: parseInt(fromArmyPositionRef.current.x), y: parseInt(fromArmyPositionRef.current.y) }) &&
          !isMyArmy({ x: data.position.x, y: data.position.y }, myArmyPosition) &&
          document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-target", "#offcanvasBottom");
      } else if (attackFromArmyPosition) {
        canArmyBeSettle({
          x: attackFromArmyPosition.x,
          y: attackFromArmyPosition.y,
        }) &&
          !isMyArmy(
            { x: data.position.x, y: data.position.y },
            myArmyPosition
          ) &&
          document
            .getElementById(`${data.position.y},${data.position.x}`)!
            .setAttribute("data-bs-toggle", "");
        canArmyBeSettle({
          x: attackFromArmyPosition.x,
          y: attackFromArmyPosition.y,
        }) &&
          !isMyArmy(
            { x: data.position.x, y: data.position.y },
            myArmyPosition
          ) &&
          document
            .getElementById(`${data.position.y},${data.position.x}`)!
            .setAttribute("data-bs-target", "");
      }
    });

    castlePositions.map((data: any) => {
      if (isAttackStage && fromArmyPositionRef.current) {
        canArmyBeSettle({
          x: parseInt(fromArmyPositionRef.current.x),
          y: parseInt(fromArmyPositionRef.current.y),
        }) &&
          isEnemyCastle(
            { x: data.x, y: data.y },
            myCastlePosition,
            castlePositions
          ) &&
          document
            .getElementById(`${data.y},${data.x}`)!
            .setAttribute("data-bs-toggle", "offcanvas");
        canArmyBeSettle({
          x: parseInt(fromArmyPositionRef.current.x),
          y: parseInt(fromArmyPositionRef.current.y),
        }) &&
          isEnemyCastle(
            { x: data.x, y: data.y },
            myCastlePosition,
            castlePositions
          ) &&
          document
            .getElementById(`${data.y},${data.x}`)!
            .setAttribute("data-bs-target", "#offcanvasBottomCastle");
      } else if (attackFromArmyPosition) {
        canArmyBeSettle({
          x: attackFromArmyPosition.x,
          y: attackFromArmyPosition.y,
        }) &&
          isEnemyCastle(
            { x: data.x, y: data.y },
            myCastlePosition,
            castlePositions
          ) &&
          document
            .getElementById(`${data.y},${data.x}`)!
            .setAttribute("data-bs-toggle", "");
        canArmyBeSettle({
          x: attackFromArmyPosition.x,
          y: attackFromArmyPosition.y,
        }) &&
          isEnemyCastle(
            { x: data.x, y: data.y },
            myCastlePosition,
            castlePositions
          ) &&
          document
            .getElementById(`${data.y},${data.x}`)!
            .setAttribute("data-bs-target", "");
      }
    });
  }, [isAttackStage]);

  //Blue hover effect when user moves an army
  useEffect(() => {
    if (fromArmyPosition && isArmyMoveStage) {
      canArmyBeSettle({
        x: parseInt(fromArmyPosition.x),
        y: parseInt(fromArmyPosition.y),
      }).map((data: any) => {
        if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
          canCastleBeSettle(values[data.x][data.y]) &&
            document
              .getElementById(`${data.y},${data.x}`)
              ?.classList.add("borderHoverMove");
        }
      });
    } else {
      if (tempArmyPos) {
        canArmyBeSettle({
          x: parseInt(tempArmyPos.x),
          y: parseInt(tempArmyPos.y),
        }).map((data: any) => {
          if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
            canCastleBeSettle(values[data.x][data.y]) &&
              document
                .getElementById(`${data.y},${data.x}`)
                ?.classList.remove("borderHoverMove");
          }
        });
      }
    }
  }, [fromArmyPosition, isArmyMoveStage]);

  //Orange hover effect when user deploys an army
  useEffect(() => {
    if (isArmyStage && myCastlePosition) {
      myCastlePosition.map((position: any) => {
        canArmyBeSettle(position).map(
          (data: any) =>
            canCastleBeSettle(values[data.x][data.y]) &&
            document
              .getElementById(`${data.y},${data.x}`)
              ?.classList.add("borderHoverArmy")
        );
      })
    } else if (!isArmyStage && myCastlePosition) {
      myCastlePosition.map((position: any) => {
        canArmyBeSettle(position).map(
          (data: any) =>
            canCastleBeSettle(values[data.x][data.y]) &&
            document
              .getElementById(`${data.y},${data.x}`)
              ?.classList.remove("borderHoverArmy")
        );
      })
    }
  }, [isArmyStage]);

  return (
    <div className={`inline-grid ${data.isBorder && "border-4 border-black"}`}>
      {rows.map((row) => {
        return columns.map((column) => {
          return (
            <div
              key={`${column},${row}`}
              id={`${column},${row}`}
              data-row={`${row}`}
              data-column={`${column}`}
              style={{
                gridColumn: column + 1,
                gridRow: row + 1,
                width: `${data.pixelStyles[1]}px`,
                height: `${data.pixelStyles[1]}px`,
                backgroundImage: `${bgImg(values[row][column])}`,
                backgroundSize: "cover",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: `${data.isBorder ? "7px" : "20px"}`,
              }}
              onClick={(e) => {
                handleClick(e);
              }}
              className={`
                ${!data.isBorder &&
                canCastleBeSettle(values[row][column]) &&
                "borderHover"
                }`}
              data-bs-toggle={`${canCastleBeSettle(values[row][column]) &&
                !isCastleSettled &&
                !data.isBorder
                ? "modal"
                : ""
                }${canCastleBeSettle(values[row][column]) &&
                  isCastleSettled &&
                  !data.isBorder &&
                  isArmyStage &&
                  numberOfArmy !== 3 &&
                  (myCastlePosition.length > 0) && myCastlePosition.map((position: any) => canArmyBeSettle(position).some(
                    (item) => item.x === row && item.y === column
                  ))
                  ? "modal"
                  : ""
                }`}
              data-bs-target={`${canCastleBeSettle(values[row][column]) &&
                !isCastleSettled &&
                !data.isBorder
                ? "#castleSettleModal"
                : ""
                }${canCastleBeSettle(values[row][column]) &&
                  isCastleSettled &&
                  !data.isBorder &&
                  isArmyStage &&
                  numberOfArmy !== 3 &&
                  (myCastlePosition.length > 0) && myCastlePosition && myCastlePosition.map((position: any) => canArmyBeSettle(position).some(
                    (item) => item.x === row && item.y === column
                  ))
                  ? "#armySettleModal"
                  : ""
                }`}
            ></div>
          );
        });
      })}
      <CastleSettleModal />
      <ArmySettleModal />
      <AttackModal />
      <CastleAttackModal />
    </div>
  );
}
