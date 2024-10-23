
export const getInitialGrid = (startNode, finishNode) => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
            currentRow.push(createNode(col, row, startNode, finishNode));
        }
        grid.push(currentRow);
    }
    return grid;
};

export const createNode = (col, row, startNode, finishNode) => {
    return {
        col,
        row,
        isStart: row === startNode.row && col === startNode.col,
        isFinish: row === finishNode.row && col === finishNode.col,
        distance: Infinity,
        isVisited: false,
        heuristic: Infinity,
        isWall: false,
        previousNode: null,
    };
};

export const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};
