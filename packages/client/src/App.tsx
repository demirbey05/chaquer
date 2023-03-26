import { SingletonID, TxQueue } from "@latticexyz/network";
import { Type, World } from "@latticexyz/recs";
import { contractComponents } from "./mud/components";
import { useMUD } from "./MUDContext";
import { ethers } from "ethers";
import { useState } from "react";
import { useComponentValue } from "@latticexyz/react";
import Menu from './pages/menu/index';
import Game from './pages/game/index';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

export const App = () => {
  const { components, systems, singletonEntity } = useMUD();
  const map = useComponentValue(components.MapConfig, singletonEntity);
  const handleClick = async (e: any) => {
    e.preventDefault();
    const tx = await systems["system.Init"].execute(
      "0x01010101010101010101010101010101001010"
    );
    const tc = await tx.wait();
    console.log(map?.value);
  };

  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/game">
            <Game />
          </Route>
          <Route path="/">
            <Menu />
          </Route>
        </Switch>
    </Router>
    </>
  );
};
