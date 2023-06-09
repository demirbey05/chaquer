import "../../styles/globals.css";
import { useEffect, useState, useRef } from "react";
import { TerrainType } from "../../terrain-helper/types";
import { useTerrain } from "../../context/TerrainContext";
import { useCastle } from "../../context/CastleContext";
import CastleSettleModal from "../CastleComp/CastleSettleModal";
import ArmySettleModal from "../ArmyComp/ArmySettleModal";
import AttackModal from "../ArmyComp/ArmyAttackModal";
import CastleAttackModal from "../CastleComp/CastleAttackModal";
import { useCastlePositions } from "../../hooks/useCastlePositions";
import { getBurnerWallet } from "../../mud/getBurnerWallet";
import { useCastlePositionByAddress } from "../../hooks/useCastlePositionByAddress";
import { useArmyPositions } from "../../hooks/useArmyPositions";
import { useMyArmy } from "../../hooks/useMyArmy";
import { EntityID } from "@latticexyz/recs";
import { useMUD } from "../../MUDContext";
import { findIDFromPosition, Coord } from "../../utils/armyID";
import { getTerrainAsset } from '../../utils/getTerrainAsset';
import { getDataAtrY, getDataAtrX } from "../../utils/getIdDataAtr";
import { canCastleBeSettle } from "../../utils/canCastleBeSettle";
import { isMyArmy } from "../../utils/isMyArmy";
import { isEnemyArmy } from "../../utils/isEnemyArmy";
import { getMyArmyConfigByPosition, getEnemyArmyConfigByPosition } from "../../utils/getArmyConfigByPosition";
import { getManhattanPositions } from "../../utils/getManhattanPositions";
import { isEnemyCastle } from "../../utils/isEnemyCastle";
import { useArmy } from "../../context/ArmyContext";
import { useAttack } from "../../context/AttackContext";

export type DataProp = {
  width: number;
  height: number;
  values: Array<Array<TerrainType>>;
  pixelStyles: Array<any>;
  isBorder: boolean;
};

export function Grid(data: DataProp) {
  const width = data.width;
  const height = data.height;
  const values = data.values;
  const rows = Array.from({ length: height }, (v, i) => i);
  const columns = Array.from({ length: width }, (v, i) => i);

  const { components, systems, world } = useMUD();
  const { abiCoder } = useTerrain();
  const { setAttackFromArmyPosition,
    setAttackToArmyPosition,
    isAttackStage,
    setIsAttackStage,
    setMyArmyConfig,
    setEnemyArmyConfig } = useAttack();
  const { setIsArmyMoveStage,
    isArmyMoveStage,
    fromArmyPosition,
    setFromArmyPosition,
    isArmyStage,
    setArmyPosition,
    setNumberOfArmy,
    numberOfArmy, setIsArmyStage } = useArmy();
  const { isCastleSettled, setIsCastleSettled, setTempCastle } = useCastle();

  const [tempArmyPos, setTempArmyPos] = useState<any>();
  const movingArmyId = useRef<EntityID>("0" as EntityID);
  const toArmyPosition = useRef({ x: -1, y: -1 });
  const fromArmyPositionRef = useRef<Coord>({ x: "-1", y: "-1" });

  const castlePositions = useCastlePositions();
  const myCastlePosition = useCastlePositionByAddress(getBurnerWallet().address.toLocaleLowerCase());
  const armyPositions: any = useArmyPositions()[0];
  const myArmyPosition: any = useMyArmy(getBurnerWallet().address.toLocaleLowerCase())[0];
  const myArmyNumber = useMyArmy(getBurnerWallet().address.toLocaleLowerCase())[1];

  // Handle Clicks
  const handleClick = async (e: any) => {
    // For Putting army Grid with clicking castle
    if (!isArmyMoveStage && myCastlePosition.find((element: { x: number; y: number }) => {
      return (
        element.x == parseInt(getDataAtrX(e)) &&
        element.y == parseInt(getDataAtrY(e))
      );
    })
    ) {
      if (isArmyStage) {
        setIsArmyStage(false);
      } else if (!isArmyStage && numberOfArmy < 3) {
        setIsArmyStage(true);
      }
    }
    if (!isCastleSettled) {
      setTempCastle({ x: getDataAtrX(e), y: getDataAtrY(e) });
    }

    if (isArmyStage) {
      setArmyPosition({ x: getDataAtrX(e), y: getDataAtrY(e) });
    }

    if (!fromArmyPosition && isCastleSettled && !isArmyStage && myArmyPosition && isMyArmy({ x: getDataAtrX(e), y: getDataAtrY(e) }, myArmyPosition)) {
      setFromArmyPosition({ x: getDataAtrX(e), y: getDataAtrY(e) });
      setTempArmyPos({ x: getDataAtrX(e), y: getDataAtrY(e) });
      setIsArmyMoveStage(true);
      setIsAttackStage(true);
    }
    else if (fromArmyPosition && getManhattanPositions({ x: parseInt(fromArmyPosition.x), y: parseInt(fromArmyPosition.y), }).some((item) =>
      item.x.toString() === getDataAtrX(e) &&
      item.y.toString() === getDataAtrY(e)
    )) {
      toArmyPosition.current = { x: getDataAtrX(e), y: getDataAtrY(e) };
      fromArmyPositionRef.current = { x: fromArmyPosition.x, y: fromArmyPosition.y, };

      //If user attack to the enemy army
      if (isEnemyArmy(toArmyPosition.current, armyPositions, myArmyPosition)) {
        setIsArmyMoveStage(false);
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
      }
      //If user attack to the enemy castle
      else if (isEnemyCastle(toArmyPosition.current, myCastlePosition, castlePositions)) {
        setIsArmyMoveStage(false)
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
        toArmyPosition.current = { x: -1, y: -1 };
        fromArmyPositionRef.current = { x: "-1", y: "-1" };
      }
      else {
        if (canCastleBeSettle(values[toArmyPosition.current.x][toArmyPosition.current.y])) {
          setIsAttackStage(false)
          // Get the ArmyID from the coordinates
          const movingArmyIdMap = findIDFromPosition(
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
              document.getElementById(`${fromArmyPosition.y},${fromArmyPosition.x}`)!.innerHTML = "";
              document.getElementById(`${fromArmyPosition.y},${fromArmyPosition.x}`)!.style.border = "";

              setIsArmyMoveStage(false);
              setIsAttackStage(false);
              setFromArmyPosition(undefined);
              toArmyPosition.current = { x: -1, y: -1 };
              fromArmyPositionRef.current = { x: "-1", y: "-1" };
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
      fromArmyPositionRef.current = { x: "-1", y: "-1" };
      setIsArmyMoveStage(false);
      setIsAttackStage(false);
    }
  };

  // Check if castle settled before and deploy castle emojis
  useEffect(() => {
    //Checks that if the user has already settled the castle
    if (myCastlePosition && myCastlePosition.length > 0) {
      myCastlePosition.map((position: any) => {
        document.getElementById(`${position.y},${position.x}`)!.style.border = "2px solid rgb(245, 169, 6)";
      });
      setIsCastleSettled(true);
    }

    if (castlePositions) {
      //Puts the castle emojis to castle positions
      castlePositions.map(
        (data) =>
          (document.getElementById(`${data.y},${data.x}`)!.innerHTML = "🏰")
      );
    }

    return () => {
      if (myCastlePosition && myCastlePosition.length > 0) {
        myCastlePosition.map((position: any) => {
          document.getElementById(`${position.y},${position.x}`)!.style.border = "";
        });
      }
    };
  }, [castlePositions, myCastlePosition]);

  //Makes castle position unClickable to not cause bug during army settlement
  useEffect(() => {
    if (castlePositions) {
      castlePositions.map((data) => {
        document
          .getElementById(`${data.y},${data.x}`)!
          .setAttribute("data-bs-toggle", "");
      });
    }
  }, [isArmyStage, castlePositions]);

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
      if (isAttackStage && fromArmyPosition) {
        // Set data-bs-toggle for army
        getManhattanPositions({ x: parseInt(fromArmyPosition.x), y: parseInt(fromArmyPosition.y) }).some((position: any) => {
          return (position.x === parseInt(data.position.x) && position.y === parseInt(data.position.y))
        }) &&
          !isMyArmy({ x: data.position.x, y: data.position.y }, myArmyPosition) &&
          document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-toggle", "offcanvas");
        // Set data-bs-target for army
        getManhattanPositions({ x: parseInt(fromArmyPosition.x), y: parseInt(fromArmyPosition.y) }).some((position: any) => {
          return (position.x === parseInt(data.position.x) && position.y === parseInt(data.position.y))
        }) &&
          !isMyArmy({ x: data.position.x, y: data.position.y }, myArmyPosition) &&
          document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-target", "#offcanvasBottom");
      }
    });

    castlePositions.map((data: any) => {
      if (isAttackStage && fromArmyPosition) {
        // Set data-bs-toggle for army
        getManhattanPositions({ x: parseInt(fromArmyPosition.x), y: parseInt(fromArmyPosition.y) }).some((position: any) => {
          return (position.x === parseInt(data.x) && position.y === parseInt(data.y))
        }) &&
          isEnemyCastle({ x: data.x, y: data.y }, myCastlePosition, castlePositions) &&
          document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-toggle", "offcanvas");
        // Set data-bs-target for army
        getManhattanPositions({ x: parseInt(fromArmyPosition.x), y: parseInt(fromArmyPosition.y) }).some((position: any) => {
          return (position.x === parseInt(data.x) && position.y === parseInt(data.y))
        }) &&
          isEnemyCastle({ x: data.x, y: data.y }, myCastlePosition, castlePositions) &&
          document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-target", "#offcanvasBottomCastle");
      }
    });

    return () => {
      castlePositions.map((data: any) => {
        document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-toggle", "");
        document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-target", "");
      });

      armyPositions.map((data: any) => {
        document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-toggle", "");
        document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-target", "");
      })
    }
  }, [isAttackStage]);

  //Blue hover effect when user moves an army
  useEffect(() => {
    if (fromArmyPosition && isArmyMoveStage) {
      getManhattanPositions({
        x: parseInt(fromArmyPosition.x),
        y: parseInt(fromArmyPosition.y),
      }).map((data) => {
        if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
          canCastleBeSettle(values[data.x][data.y]) &&
            document
              .getElementById(`${data.y},${data.x}`)
              ?.classList.add("borderHoverMove");
        }
      });
    } else {
      if (tempArmyPos) {
        getManhattanPositions({
          x: parseInt(tempArmyPos.x),
          y: parseInt(tempArmyPos.y),
        }).map((data) => {
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
        getManhattanPositions(position).map(
          (data) => {
            if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
              canCastleBeSettle(values[data.x][data.y]) && document.getElementById(`${data.y},${data.x}`)?.classList.add("borderHoverArmy")
            }
          }
        );
      });
    } else if (!isArmyStage && myCastlePosition) {
      myCastlePosition.map((position: any) => {
        getManhattanPositions(position).map(
          (data) => {
            if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
              canCastleBeSettle(values[data.x][data.y]) && document.getElementById(`${data.y},${data.x}`)?.classList.remove("borderHoverArmy")
            }
          }
        );
      });
    }
  }, [isArmyStage, myCastlePosition, values]);

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
                backgroundImage: `${getTerrainAsset(values[row][column])}`,
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
                  myCastlePosition.length > 0 &&
                  myCastlePosition &&
                  myCastlePosition.some((position: any) => {
                    return getManhattanPositions(position).some(
                      (item) => item.x === row && item.y === column
                    );
                  })
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
                  myCastlePosition.length > 0 &&
                  myCastlePosition &&
                  myCastlePosition.some((position: any) => {
                    return getManhattanPositions(position).some(
                      (item) => item.x === row && item.y === column
                    );
                  })
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
    </div >
  );
}
