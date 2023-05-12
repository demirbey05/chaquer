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
import { useBurnerWallets } from "../../hooks/useBurnerWallets";
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
import { utils } from "ethers";

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
  const { current: abiCoder } = useRef(new utils.AbiCoder());

  const {
    setIsArmyMoveStage,
    isArmyMoveStage,
    fromArmyPosition,
    setFromArmyPosition,
    isCastleSettled,
    setTempCastle,
    setIsCastleSettled,
    isArmyStage,
    setArmyPosition,
    setNumberOfArmy,
    numberOfArmy,
  } = useTerrain();
  const [tempArmyPos, setTempArmyPos] = useState<any>();
  const movingArmyId = useRef<EntityID>("0" as EntityID);
  const toArmyPosition = useRef({ x: -1, y: -1 });

  const castlePositions = useCastlePositions();
  const burnerWallets = useBurnerWallets();
  const myCastlePosition = useCastlePositionByAddress(
    getBurnerWallet().address.toLocaleLowerCase()
  );
  const armyPositions: any = useArmyPositions();
  const myArmyPosition: any = useUserArmy(
    getBurnerWallet().address.toLocaleLowerCase()
  )[0];
  const myArmyNumber = useUserArmy(
    getBurnerWallet().address.toLocaleLowerCase()
  )[1];

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
      if (
        canCastleBeSettle(
          values[toArmyPosition.current.x][toArmyPosition.current.y]
        )
      ) {
        for (const entity of getComponentEntities(components.Position)) {
          const val: any = getComponentValue(components.Position, entity);
          if (val.x == fromArmyPosition.x && val.y == fromArmyPosition.y) {
            world.entityToIndex.forEach((value, key) => {
              if (value == entity) {
                movingArmyId.current = key;
              }
            });
          }
        }

        if (isArmyMoveStage) {
          try {
            await systems["system.MoveArmy"].execute(
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
          } catch (err) {
            console.log(err);
          }
        }
      }
    } else {
      setFromArmyPosition(undefined);
      toArmyPosition.current = { x: -1, y: -1 };
      setIsArmyMoveStage(false);
    }
  };

  // Check if castle settled before and deploy castle emojis
  useEffect(() => {
    //Checks that if the user has already settled the castle
    if (castlePositions) {
      burnerWallets.map((wallet) => {
        if (
          wallet.value.toLocaleLowerCase() ===
          getBurnerWallet().address.toLocaleLowerCase()
        ) {
          if (myCastlePosition) {
            document.getElementById(
              `${myCastlePosition.y},${myCastlePosition.x}`
            )!.style.border = "2px solid rgb(245, 169, 6)";
          }
          setIsCastleSettled(true);
        }
      });

      //Puts the castle emojis to castle positions
      castlePositions.map(
        (data) =>
          (document.getElementById(`${data.y},${data.x}`)!.innerHTML = "🏰")
      );
    }
  }, [castlePositions]);

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
    if (myArmyPosition) {
      myArmyPosition.map((data: any) => {
        const element = document.getElementById(
          `${data.position.y},${data.position.x}`
        )!;
        element.style.border = "2px solid rgb(245, 169, 6)";
      });
    }

    if (myArmyNumber) {
      setNumberOfArmy(myArmyNumber);
    }

    //Puts the castle emojis to castle positions
    armyPositions.map((data: any) => {
      document.getElementById(`${data.y},${data.x}`)!.innerHTML = "⚔️";
    });
  }, [armyPositions]);

  //Blue hover effect when user moves an army
  useEffect(() => {
    if (fromArmyPosition && isArmyMoveStage) {
      canArmyBeSettle({
        x: parseInt(fromArmyPosition.x),
        y: parseInt(fromArmyPosition.y),
      }).map((data: any) => {
        console.log(data);
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
      canArmyBeSettle(myCastlePosition).map((data: any) =>
        document
          .getElementById(`${data.y},${data.x}`)
          ?.classList.add("borderHoverArmy")
      );
    } else if (!isArmyStage && myCastlePosition) {
      canArmyBeSettle(myCastlePosition).map((data: any) =>
        document
          .getElementById(`${data.y},${data.x}`)
          ?.classList.remove("borderHoverArmy")
      );
    }
  }, [isArmyStage]);

  console.log(fromArmyPosition);
  console.log(toArmyPosition);

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
                fontSize: `${data.isBorder ? "3.5px" : "20px"}`,
              }}
              onClick={(e) => {
                handleClick(e);
              }}
              className={`
                ${
                  !data.isBorder &&
                  canCastleBeSettle(values[row][column]) &&
                  "borderHover"
                }`}
              data-bs-toggle={`${
                canCastleBeSettle(values[row][column]) &&
                !isCastleSettled &&
                !data.isBorder
                  ? "modal"
                  : ""
              }${
                canCastleBeSettle(values[row][column]) &&
                isCastleSettled &&
                !data.isBorder &&
                isArmyStage &&
                numberOfArmy !== 3 &&
                canArmyBeSettle(myCastlePosition).some(
                  (item) => item.x === row && item.y === column
                )
                  ? "modal"
                  : ""
              }`}
              data-bs-target={`${
                canCastleBeSettle(values[row][column]) &&
                !isCastleSettled &&
                !data.isBorder
                  ? "#castleSettleModal"
                  : ""
              }${
                canCastleBeSettle(values[row][column]) &&
                isCastleSettled &&
                !data.isBorder &&
                isArmyStage &&
                numberOfArmy !== 3 &&
                canArmyBeSettle(myCastlePosition).some(
                  (item) => item.x === row && item.y === column
                )
                  ? "#armySettleModal"
                  : ""
              }`}
            ></div>
          );
        });
      })}
      <CastleSettleModal></CastleSettleModal>
      <ArmySettleModal></ArmySettleModal>
    </div>
  );
}
