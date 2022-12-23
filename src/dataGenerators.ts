const nrOfNodes = 10;

export const generateNodes = () => {
  return new Array(nrOfNodes).fill(0).map((v, i) => ({
    data: { id: `a${i}` },
  }));
};

// a -> b -> c
// const generateLineairEdges = (): any => {
//   const f = new Array(nrOfNodes - 1).fill(0).map((v, i) => ({
//     data: { id: `ab${i}`, source: `a${i}`, target: `a${i + 1}` },
//   }));
//   return f;
// };

// c <- a -> b
export const generateHierachicalEdges = (): any => {
  const firstHalf = nrOfNodes / 2;

  const f = new Array(firstHalf - 1).fill(0).map((v, i) => ({
    data: { id: `ab${i}`, source: `a${i}`, target: `a${i + 1}` },
  }));

  const f2 = new Array(firstHalf).fill(0).map((v, i) => ({
    data: { id: `ba${i}`, source: `a0`, target: `a${i + firstHalf}` },
  }));

  const f3 = f.concat(f2);
  // console.log(f3);
  return f3;
};
