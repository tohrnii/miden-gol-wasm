import init, { WasmProgram } from "miden-wasm"

import React, { useState, useCallback, useRef, useEffect } from "react";

const numRows = 4;
const numCols = 4;

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  
  return rows;
};

const generateRandomGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(
      Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
    );
  }
  return rows;
}

const convert2dGridTo1d = (matrix: number[][]) => {
  let arr = [];
  for (let row of matrix) for (let v of row) arr.push(BigInt(v));
  return new BigUint64Array(arr);
}

const convert1dGridTo2d = (state: BigUint64Array, rows: number, cols: number) => {
  const result = new Array(rows);
  for (let row = 0; row < rows; row++) {
    result[row] = new Array(cols);
  }
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      result[row][col] = state[row * cols + col];
    }
  }
  return result;
}

const App: React.FC = () => {
  const [grid, setGrid] = useState({
    grid: generateEmptyGrid()
  });

  const [running, setRunning] = useState(false);
  const [programStateAvailable, setProgramStateAvailable] = useState(false);
  const [programState, setProgramState] = useState({
    wasmProgram: null
  });

  useEffect(() => {
    const initProgramState = async () => {
        await init();
        let programState = new WasmProgram(convert2dGridTo1d(generateEmptyGrid()));
        setProgramStateAvailable(true)
    };

    // call the async function.
    initProgramState();
  }, [programState, programStateAvailable]);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    // @ts-ignore: Object is possibly 'null'.
    let next_step = programState.wasmProgram.next_step()
    setGrid({
      grid: convert1dGridTo2d(next_step, numRows, numCols)
    });
    setTimeout(runSimulation, 10000);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>
      <button
        onClick={() => {
          let input = generateRandomGrid();
          setGrid({grid: input})
          // @ts-ignore: Object is possibly 'null'.
          programState.wasmProgram.set_input(convert2dGridTo1d(input))
        }}
      >
        random
      </button>
      <button
        onClick={() => {
          let input = generateEmptyGrid();
          setGrid({grid: input})
          // @ts-ignore: Object is possibly 'null'.
          programState.wasmProgram.set_input(convert2dGridTo1d(input))
        }}
      >
        clear
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 100px)`
        }}
      >
      </div>
    </>
  );
};

export default App;
