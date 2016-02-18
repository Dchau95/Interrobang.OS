/*
 * DISCLAIMER:
 * The following code was found at http://mcc.id.au/2004/10/dijkstra.js
 * dijkstra.js
 *
 * Dijkstra's single source shortest path algorithm in JavaScript.
 *
 * Cameron McCormack <cam (at) mcc.id.au>
 *
 * Permission is hereby granted to use, copy, modify and distribute this
 * code for any purpose, without fee.
 *
 * Initial version: October 21, 2004
 */

function shortestPath(aryEdges, iNumVertices, startVertex) {
    var aryDone = new Array(iNumVertices);
    aryDone[startVertex] = true;
    var aryPathLengths = new Array(iNumVertices);
    var aryPredecessors = new Array(iNumVertices);
    for (var i = 0; i < iNumVertices; i++) {
        aryPathLengths[i] = aryEdges[startVertex][i];
        if (aryEdges[startVertex][i] != Infinity) {
            aryPredecessors[i] = startVertex;
        }
    }
    aryPathLengths[startVertex] = 0;
    for (var i = 0; i < iNumVertices - 1; i++) {
        var closest = -1;
        var closestDistance = Infinity;
        for (var j = 0; j < iNumVertices; j++) {
            if (!aryDone[j] && aryPathLengths[j] < closestDistance) {
                closestDistance = aryPathLengths[j];
                closest = j;
            }
        }
        aryDone[closest] = true;
        for (var j = 0; j < iNumVertices; j++) {
            if (!aryDone[j]) {
                var possiblyCloserDistance = aryPathLengths[closest] + aryEdges[closest][j];
                if (possiblyCloserDistance < aryPathLengths[j]) {
                    aryPathLengths[j] = possiblyCloserDistance;
                    aryPredecessors[j] = closest;
                }
            }
        }
    }
    return { "startVertex": startVertex,
        "aryPathLengths": aryPathLengths,
        "predecessors": aryPredecessors };
}

function constructPath(shortestPathInfo, endVertex) {
    var path = [];
    while (endVertex != shortestPathInfo.startVertex) {
        path.unshift(endVertex);
        endVertex = shortestPathInfo.aryPredecessors[endVertex];
    }
    return path;
}

// Example //////////////////////////////////////////////////////////////////

// The adjacency matrix defining the graph.
var _ = Infinity;
var e = [
    [ _, _, _, _, _, _, _, _, 4, 2, 3 ],
    [ _, _, 5, 2, 2, _, _, _, _, _, _ ],
    [ _, 5, _, _, _, 1, 4, _, _, _, _ ],
    [ _, 2, _, _, 3, 6, _, 3, _, _, _ ],
    [ _, 2, _, 3, _, _, _, 4, 3, _, _ ],
    [ _, _, 1, 6, _, _, 2, 5, _, _, _ ],
    [ _, _, 4, _, _, 2, _, 5, _, _, 3 ],
    [ _, _, _, 3, 4, 5, 5, _, 3, 2, 4 ],
    [ 4, _, _, _, 3, _, _, 3, _, 3, _ ],
    [ 2, _, _, _, _, _, _, 2, 3, _, 3 ],
    [ 3, _, _, _, _, _, 3, 4, _, 3, _ ]
];

// Compute the shortest paths from vertex number 1 to each other vertex
// in the graph.
var shortestPathInfo = shortestPath(e, 11, 1);

// Get the shortest path from vertex 1 to vertex 6.
var path1to6 = constructPath(shortestPathInfo, 6);/**
 * Created by thomas on 2/18/16.
 */
