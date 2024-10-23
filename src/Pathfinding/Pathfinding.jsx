import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { aStar } from '../algorithms/aStart';
import { getInitialGrid, getNewGridWithWallToggled } from '../helpers/helper';
import './Pathfinding.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            isSettingStart: false,
            isSettingFinish: false,
            isAddingWalls: false,
            startNode: { row: START_NODE_ROW, col: START_NODE_COL },
            finishNode: { row: FINISH_NODE_ROW, col: FINISH_NODE_COL },
            isVisualizing: false,
        };

    }

    componentDidMount() {
        const grid = getInitialGrid(this.state.startNode, this.state.finishNode);
        this.setState({ grid });
    }

    getInitialGrid() {
        return getInitialGrid(this.state.startNode, this.state.finishNode);
    }

    handleMouseDown(row, col) {
        const { isSettingStart, isSettingFinish, isAddingWalls } = this.state;


        if (isSettingStart) {
            this.setState({ startNode: { row, col }, isSettingStart: false }, () => {
                const newGrid = getInitialGrid(this.state.startNode, this.state.finishNode);
                this.setState({ grid: newGrid });
            });
            return;
        }

        if (isSettingFinish) {
            this.setState({ finishNode: { row, col }, isSettingFinish: false }, () => {
                const newGrid = getInitialGrid(this.state.startNode, this.state.finishNode);
                this.setState({ grid: newGrid });
            });
            return;
        }
        if (isAddingWalls) {
            const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            this.setState({ grid: newGrid, mouseIsPressed: true });
        }

    }

    handleMouseEnter(row, col) {
        const { isAddingWalls, mouseIsPressed } = this.state;

        // Prevent wall placement during visualization
        if (!mouseIsPressed || !isAddingWalls) return;

        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid });
    }

    toggleAddWalls() {
        this.setState({ isAddingWalls: !this.state.isAddingWalls });
    }

    handleMouseUp() {
        this.setState({ mouseIsPressed: false });
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                    this.setState({ isVisualizing: false });
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            }, 10 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i);
        }
    }

    visualizeDijkstra() {
        if (this.state.isVisualizing) return;
        this.setState({ isVisualizing: true });
        const { grid, startNode, finishNode } = this.state;
        const start = grid[startNode.row][startNode.col];
        const finish = grid[finishNode.row][finishNode.col];
        const visitedNodesInOrder = dijkstra(grid, start, finish);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);

    }


    animateAStar(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                    this.setState({ isVisualizing: false });
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                // Add a check to see if we're getting the correct node
                console.log(`Visiting Node at [${node.row}, ${node.col}]`);
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            }, 10 * i);
        }
    }

    visualizeAStar() {
        if (this.state.isVisualizing) return;
        this.setState({ isVisualizing: true });
        const { grid, startNode, finishNode } = this.state;
        const start = grid[startNode.row][startNode.col];
        const finish = grid[finishNode.row][finishNode.col];
        const visitedNodesInOrder = aStar(grid, start, finish);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);

        // Check if visited nodes are being returned correctly
        console.log('Visited Nodes:', visitedNodesInOrder);

        this.animateAStar(visitedNodesInOrder, nodesInShortestPathOrder);
        this.setState({ isVisualizing: false });
    }


    setStartNode() {
        this.setState({ isSettingStart: true });
    }

    setFinishNode() {
        this.setState({ isSettingFinish: true });
    }

    resetGrid() {
        const grid = getInitialGrid(this.state.startNode, this.state.finishNode);
        this.setState({ grid });

        // Reset any visual effects by removing the class names, except for start and finish nodes
        const nodes = document.querySelectorAll('.node');
        nodes.forEach(node => {
            const [_, row, col] = node.id.split('-'); // Get row and col from node's id (node-row-col)
            const { startNode, finishNode } = this.state;

            if (Number(row) === startNode.row && Number(col) === startNode.col) {
                node.className = 'node node-start'; // Reapply start node class
            } else if (Number(row) === finishNode.row && Number(col) === finishNode.col) {
                node.className = 'node node-finish'; // Reapply finish node class
            } else {
                node.className = 'node'; // Reset other nodes
            }
        });
    }


    render() {
        const { grid, mouseIsPressed, isAddingWalls } = this.state;

        return (
            <>

                <nav className="navbar">
                    <div className="navbar-title">PathWhiz</div>
                    <div className="navbar-options">
                        <button className="nav-button" onClick={() => this.visualizeDijkstra()}>
                            Dijkstra's Algorithm
                        </button>
                        <button className="nav-button" onClick={() => this.visualizeAStar()}>
                            A* Algorithm
                        </button>
                        <button className="nav-button" onClick={() => this.setStartNode()}>
                            Set Start Node
                        </button>
                        <button className="nav-button" onClick={() => this.setFinishNode()}>
                            Set Finish Node
                        </button>
                        <button className="nav-button" onClick={() => this.toggleAddWalls()}>
                            {isAddingWalls ? 'Adding Walls' : 'Add Walls'}
                        </button>
                        <button className="nav-button reset" onClick={() => this.resetGrid()}>
                            Reset Grid
                        </button>
                    </div>
                </nav>

                {/* Grid Visualization */}
                <div className="grid">
                    {grid.map((row, rowIdx) => (
                        <div key={rowIdx}>
                            {row.map((node, nodeIdx) => {
                                const { row, col, isFinish, isStart, isWall } = node;
                                return (
                                    <Node
                                        key={nodeIdx}
                                        col={col}
                                        isFinish={isFinish}
                                        isStart={isStart}
                                        isWall={isWall}
                                        mouseIsPressed={mouseIsPressed}
                                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                        onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                        onMouseUp={() => this.handleMouseUp()}
                                        row={row}></Node>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </>
        );
    }
}