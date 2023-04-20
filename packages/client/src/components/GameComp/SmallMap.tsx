import { useTerrain } from "../../context/TerrainContext";
import { Grid } from '../TerrainComp/Grid'
import map from '../../../map.json';

function SmallMap() {
    const { width, height } = useTerrain();
    const values = map;
    const smallMap = [1,2];
    return (
        <div style={{position:"absolute", margin: "12.5px auto", zIndex:"1", bottom:"0", left:"0", right:"0"}}>
            <Grid width={width} height={height} values={values} pixelStyles={smallMap} isBorder={true}/>
        </div>
    )
}

export default SmallMap
