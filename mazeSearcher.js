// import Stack from './models/Stack
// import Queue from './models/Queue

export var MazeSearcher = {
  grid: null,
  startTime: null,
  endTime: null,
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  nodeArr: [],

  search: function (grid, searchMethod) {
    MazeSearcher.grid = grid;

    for (var y = 0; y < grid.length; y++) {
      for (var x = 0; x < grid[0].length; x++) {
        if (MazeSearcher.grid[y][x] === "s") {
          MazeSearcher.startX = x;
          MazeSearcher.startY = y;
        }
        else if (MazeSearcher.grid[y][x] === "g") {
          MazeSearcher.endX = x;
          MazeSearcher.endY = y;
        }
      }
    }
    MazeSearcher.createNodeArray();

    if (searchMethod === "Recursive Search") {
      //MazeSearcher.recursiveSearch();
    }
    if (searchMethod === "DFS") {
      MazeSearcher.startTime = performance.now();
      MazeSearcher.depthFirstSearch();
      MazeSearcher.endTime = performance.now();
      console.log('Elapsed time:', (MazeSearcher.endTime - MazeSearcher.startTime));
    }
    if (searchMethod === "BFS") {
      MazeSearcher.startTime = performance.now();
      MazeSearcher.breadthFirstSearch();
      MazeSearcher.endTime = performance.now();
      console.log('Elapsed time:', (MazeSearcher.endTime - MazeSearcher.startTime));
    }
    if (searchMethod === "A*") {
      MazeSearcher.startTime = performance.now();
      MazeSearcher.astarSearch();
      MazeSearcher.endTime = performance.now();
      console.log('Elapsed time:', (MazeSearcher.endTime - MazeSearcher.startTime));
    }
    if (searchMethod === "gBFS") {
      MazeSearcher.startTime = performance.now();
      MazeSearcher.greedyBestFirstSearch();
      MazeSearcher.endTime = performance.now();
      console.log('Elapsed time:', (MazeSearcher.endTime - MazeSearcher.startTime));
    }
    console.log("startX", MazeSearcher.startX);
    console.log("startY", MazeSearcher.startY);
    console.log("endX", MazeSearcher.endX);
    console.log("yendY", MazeSearcher.endY);
    console.log("MazeSearcher grid");
    console.log(grid);
  },

  createNodeArray: function () {
    let node;

    for (var y = 0; y < MazeSearcher.grid.length; y++) {
      for (var x = 0; x < MazeSearcher.grid[0].length; x++) {
        node = {
          xCoord: x,
          yCoord: y,
          value: MazeSearcher.grid[y][x],
          isVisited: false,
          previousNode: null,
        };
        MazeSearcher.nodeArr.push(node);
      }
    }
    console.log("MazeSearcher nodeArr");
    console.log(MazeSearcher.nodeArr);
  },

  recursiveSearch: function () {
    console.log("run simple search");
    MazeSearcher.traverse(MazeSearcher.startX, MazeSearcher.startY);
  },

  traverse: function (column, row) {
    if (this.grid[column][row] === "g") {
      console.log("You solved at maze: " + column + ", " + row);
    } else if (this.grid[column][row] === 5) {
      console.log("You are on a valid position");
      this.grid[column][row] = 9;
      if (column < this.grid.length - 1) {
        MazeSearcher.traverse(column + 1, row);
      }
      if (row < this.grid[column].length - 1) {
        MazeSearcher.traverse(column, row + 1);
      }
      if (column > 0) {
        MazeSearcher.traverse(column - 1, row);
      }
      if (row > 0) {
        MazeSearcher.traverse(column, row - 1);
      }
    }
  },

  depthFirstSearch: function () {
    let width = MazeSearcher.grid[0].length;

    let startNode =
      MazeSearcher.nodeArr[width * MazeSearcher.startY + MazeSearcher.startX];
    let unvisitedNodes = [];
    let visitedNodes = [];

    unvisitedNodes.push(startNode);
    let closestNode;

    while (unvisitedNodes.length !== 0) {
      closestNode = unvisitedNodes.shift();
      if (closestNode.value === "g") {
        console.log("dfs goal found");
        console.log(closestNode);
        return visitedNodes;
      }
      visitedNodes.push(closestNode);
      closestNode.isVisited = true;
      let unvisitedNeighbours = MazeSearcher.getUnvisitedNeighbours(closestNode);
      for (let unvisitedNeighbour of unvisitedNeighbours) {
        unvisitedNeighbour.previousNode = closestNode;
        unvisitedNodes.unshift(unvisitedNeighbour);
      }
    }
    console.log("run depth first search");
    //return visitedNodes;
  },

  breadthFirstSearch: function () {
    let width = MazeSearcher.grid[0].length;

    let startNode =
      MazeSearcher.nodeArr[width * MazeSearcher.startY + MazeSearcher.startX];

    let unvisitedNodes = [];
    let visitedNodes = [];
    unvisitedNodes.push(startNode);
    let closestNode;
    let unvisitedNeighbours;
    while (unvisitedNodes.length !== 0) {
      closestNode = unvisitedNodes.shift();
      if (closestNode.value === "g") {
        console.log("bfs found goal");
        console.log(closestNode);
        return visitedNodes;
      }
      visitedNodes.push(closestNode);
      closestNode.isVisited = true;
      unvisitedNeighbours = MazeSearcher.getUnvisitedNeighbours(closestNode);
      for (let unvisitedNeighbour of unvisitedNeighbours) {
        unvisitedNeighbour.previousNode = closestNode;
        if (
          MazeSearcher.neighbourNotInUnvisitedNodes(
            unvisitedNeighbour,
            unvisitedNodes
          )
        ) {
          unvisitedNodes.push(unvisitedNeighbour);
        }
      }
    }
    console.log("run breadth first search");
    return visitedNodes;
  },

  /*aStarSearch: function () {
    let width = MazeSearcher.grid[0].length;

    let startNode =
      MazeSearcher.nodeArr[width * MazeSearcher.startY + MazeSearcher.startX];

    let finishNode =
      MazeSearcher.nodeArr[width * MazeSearcher.endY + MazeSearcher.endX];

    let unvisitedNodes = [];
    let visitedNodes = [];

    unvisitedNodes.push(startNode);
    let neighbours;
    startNode.distance = 0;

    while (unvisitedNodes.length !== 0) {
      unvisitedNodes.sort((a, b) => a.totalDistance - b.totalDistance);
      let closestNode = unvisitedNodes.shift();
      if (closestNode === finishNode) return visitedNodes;

      closestNode.isVisited = true;
      visitedNodes.push(closestNode);

      neighbours = MazeSearcher.getNeighbours(closestNode, MazeSearcher.grid);
      for (let neighbour of neighbours) {
        let distance = closestNode.distance + 1;
        //f(n) = g(n) + h(n)
        if (MazeSearcher.neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes)) {
          unvisitedNodes.unshift(neighbour);
          neighbour.distance = distance;
          neighbour.totalDistance =
            distance + MazeSearcher.manhattenDistance(neighbour, finishNode);
          neighbour.previousNode = closestNode;
        } else if (distance < neighbour.distance) {
          neighbour.distance = distance;
          neighbour.totalDistance =
            distance + MazeSearcher.manhattenDistance(neighbour, finishNode);
          neighbour.previousNode = closestNode;
        }
      }
    }
    console.log("run astar search");
    return visitedNodes;
  },

  /*greedyBestFirstSearch: function () {
    let width = MazeSearcher.grid[0].length;

    let startNode =
      MazeSearcher.nodeArr[width * MazeSearcher.startY + MazeSearcher.startX];

    let finishNode =
      MazeSearcher.nodeArr[width * MazeSearcher.endY + MazeSearcher.endX];

    let unvisitedNodes = [];
    let visitedNodes = [];

    startNode.distance = 0;
    unvisitedNodes.push(startNode);
    let closestNode;
    let neighbours;

    while (unvisitedNodes.length !== 0) {
      unvisitedNodes.sort((a, b) => a.totalDistance - b.totalDistance);
      closestNode = unvisitedNodes.shift();
      if (closestNode.value === "g") {
        console.log("gbfs found goal");
        console.log(closestNode);
        return visitedNodes;
      }
      visitedNodes.push(closestNode);
      closestNode.isVisited = true;
      neighbours = MazeSearcher.getNeighbours(closestNode);
      for (let neighbour of neighbours) {
        let distance = closestNode.distance + 1;
        //f(n) = h(n)
        if (MazeSearcher.neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes)) {
          unvisitedNodes.unshift(neighbour);
          neighbour.distance = distance;
          neighbour.totalDistance = MazeSearcher.manhattenDistance(neighbour, finishNode);
          neighbour.previousNode = closestNode;
        } else if (distance < neighbour.distance) {
          neighbour.distance = distance;
          neighbour.totalDistance = MazeSearcher.manhattenDistance(neighbour, finishNode);
          neighbour.previousNode = closestNode;
        }
      }
    }
    console.log("breadth first search");
    return visitedNodes;
  },*/

  getNeighbours: function (node) {
    let width = MazeSearcher.grid[0].length;
    let heigth = MazeSearcher.grid.length;
    let neighbours = [];

    //right neighbour
    if (
      node.xCoord + 1 < width &&
      MazeSearcher.grid[node.yCoord][node.xCoord + 1] !== "w"
    ) {
      neighbours.push(
        MazeSearcher.nodeArr[width * node.yCoord + (node.xCoord + 1)]
      );
    }
    //left neighbour
    if (
      0 < node.xCoord - 1 &&
      MazeSearcher.grid[node.yCoord][node.xCoord - 1] !== "w"
    ) {
      neighbours.push(
        MazeSearcher.nodeArr[width * node.yCoord + (node.xCoord - 1)]
      );
    }
    //up neighbour
    if (
      0 < node.yCoord - 1 &&
      MazeSearcher.grid[node.yCoord - 1][node.xCoord] !== "w"
    ) {
      neighbours.push(
        MazeSearcher.nodeArr[width * (node.yCoord - 1) + node.xCoord]
      );
    }
    //down neighbour
    if (
      node.yCoord + 1 < heigth &&
      MazeSearcher.grid[node.yCoord + 1][node.xCoord] !== "w"
    ) {
      neighbours.push(
        MazeSearcher.nodeArr[width * (node.yCoord + 1) + node.xCoord]
      );
    }
    console.log("neighbours");
    console.log(neighbours);

    return neighbours;
  },

  getUnvisitedNeighbours: function (node) {
    let width = MazeSearcher.grid[0].length;
    let heigth = MazeSearcher.grid.length;
    let neighbours = [];

    //right neighbour
    if (
      node.xCoord + 1 < width &&
      MazeSearcher.grid[node.yCoord][node.xCoord + 1] !== "w"
    ) {
      if (
        MazeSearcher.nodeArr[width * node.yCoord + (node.xCoord + 1)]
          .isVisited === false
      ) {
        neighbours.push(
          MazeSearcher.nodeArr[width * node.yCoord + (node.xCoord + 1)]
        );
      }
    }
    //left neighbour
    if (
      0 < node.xCoord - 1 &&
      MazeSearcher.grid[node.yCoord][node.xCoord - 1] !== "w"
    ) {
      if (
        MazeSearcher.nodeArr[width * node.yCoord + (node.xCoord - 1)]
          .isVisited === false
      ) {
        neighbours.push(
          MazeSearcher.nodeArr[width * node.yCoord + (node.xCoord - 1)]
        );
      }
    }
    //up neighbour
    if (
      0 < node.yCoord - 1 &&
      MazeSearcher.grid[node.yCoord - 1][node.xCoord] !== "w"
    ) {
      if (
        MazeSearcher.nodeArr[width * (node.yCoord - 1) + node.xCoord]
          .isVisited === false
      ) {
        neighbours.push(
          MazeSearcher.nodeArr[width * (node.yCoord - 1) + node.xCoord]
        );
      }
    }
    //down neighbour
    if (
      node.yCoord + 1 < heigth &&
      MazeSearcher.grid[node.yCoord + 1][node.xCoord] !== "w"
    ) {
      if (
        MazeSearcher.nodeArr[width * (node.yCoord + 1) + node.xCoord]
          .isVisited === false
      ) {
        neighbours.push(
          MazeSearcher.nodeArr[width * (node.yCoord + 1) + node.xCoord]
        );
      }
    }
    console.log("unvisited neighbours");
    console.log(neighbours);

    return neighbours;
  },

  neighbourNotInUnvisitedNodes: function (neighbour, unvisitedNodes) {
    for (let node of unvisitedNodes) {
      if (
        node.yCoord === neighbour.yCoord &&
        node.xCoord === neighbour.xCoord
      ) {
        return false;
      }
    }
    return true;
  },
  manhattenDistance: function (node, finishNode) {
    let x = Math.abs(node.row - finishNode.row);
    let y = Math.abs(node.col - finishNode.col);
    return x + y;
  }
};
