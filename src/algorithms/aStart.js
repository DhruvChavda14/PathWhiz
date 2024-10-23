export function aStar(grid, startNode, finishNode) {
    const openSet = [];
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    startNode.heuristic = heuristic(startNode, finishNode);
    openSet.push(startNode);

    while (openSet.length > 0) {
        // Sort openSet to get the node with the lowest f score
        openSet.sort((nodeA, nodeB) => (nodeA.distance + nodeA.heuristic) - (nodeB.distance + nodeB.heuristic));
        const currentNode = openSet.shift();

        // If we've reached the target, return the visited nodes
        if (currentNode === finishNode) {
            return visitedNodesInOrder;
        }

        // Mark node as visited
        if (!currentNode.isWall && !currentNode.isVisited) {
            currentNode.isVisited = true;
            visitedNodesInOrder.push(currentNode);

            // Explore neighbors
            const neighbors = getUnvisitedNeighbors(currentNode, grid);
            for (const neighbor of neighbors) {
                const tempGScore = currentNode.distance + 1; // Assuming all edges have weight 1
                if (tempGScore < neighbor.distance) {
                    neighbor.previousNode = currentNode;
                    neighbor.distance = tempGScore;
                    neighbor.heuristic = heuristic(neighbor, finishNode);
                    openSet.push(neighbor);
                }
            }
        }
    }

    // Return visited nodes even if no path was found
    return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]); // Up
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down
    if (col > 0) neighbors.push(grid[row][col - 1]); // Left
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function heuristic(node, finishNode) {
    // Manhattan distance as heuristic
    const dx = Math.abs(node.row - finishNode.row);
    const dy = Math.abs(node.col - finishNode.col);
    return dx + dy;
}



