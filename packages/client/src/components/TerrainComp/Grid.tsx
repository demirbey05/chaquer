import { TerrainType } from "../../terrain-helper/types";
import grassImg from '../../images/grass.png';
import mountainImg from '../../images/mountain.png';
import seaImg from '../../images/sea.png';

export type DataProp = {
  width: number;
  height: number;
  values: Array<Array<TerrainType>>;
  pixelStyles: Array<any>;
  isBorder: boolean;
};

function bgImg(data:any)
{
  if(data === 1)
  {
    return `url(${grassImg})`
  }
  else if(data === 2)
  {
    return `url(${seaImg})`
  }
  else
  {
    return `url(${mountainImg})`
  }
}

export function Grid(data: DataProp) {
  const width = data.width;
  const height = data.height;
  const values = data.values;
  const rows = Array.from({ length: height }, (v, i) => i);
  const columns = Array.from({ length: width }, (v, i) => i);

  return (
    <div className={`inline-grid ${data.isBorder && "border-4"} border-black`} >
      {rows.map((row) => {
        return columns.map((column) => {
          return (
            <div
              key={`${column},${row}`}
              style={{
                gridColumn: column + 1 ,
                gridRow: row + 1,
                width:`${data.pixelStyles[1]}px`,
                height:`${data.pixelStyles[1]}px`,
                backgroundImage:bgImg(values[row][column])
              }}
            ></div>
          );
        });
      })}
    </div>
  );
}
