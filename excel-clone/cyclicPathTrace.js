
function colorPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    })
}

async function isGraphCylicTracePath(graphComponentMatrix, cycleResponse) {
    let [srcr, srcc] = cycleResponse;
    // store visited trace
    let visited = []; 
    // stack of visited trace
    let dfsVisited = []; 

    for (let i = 0; i < rows; i++) {
        let visitedRow = [];
        let dfsVisitedRow = [];
        for (let j = 0; j < cols; j++) {
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    let response = await dfsCycleDetectionTracePath(graphComponentMatrix, srcr, srcc, visited, dfsVisited);
    if (response === true) return Promise.resolve(true);

    return Promise.resolve(false);
}

// cell coloring
async function dfsCycleDetectionTracePath(graphComponentMatrix, srcr, srcc, visited, dfsVisited) {
    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;

    let cell = document.querySelector(`.cell[rid="${srcr}"][cid="${srcc}"]`);
    cell.style.backgroundColor = "lightblue";
    await colorPromise(); 

    for (let children = 0; children < graphComponentMatrix[srcr][srcc].length; children++) {
        let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];
        if (visited[nbrr][nbrc] === false) {
            let response = await dfsCycleDetectionTracePath(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited);
            if (response === true) {
                cell.style.backgroundColor = "transparent";
                await colorPromise();

                return Promise.resolve(true);
            }
        }
        else if (visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true) {
            let cyclicCell = document.querySelector(`.cell[rid="${nbrr}"][cid="${nbrc}"]`);

            cyclicCell.style.backgroundColor = "lightsalmon";
            await colorPromise();
            cyclicCell.style.backgroundColor = "transparent";

            cell.style.backgroundColor = "transparent";
            await colorPromise();

            return Promise.resolve(true);
        }
    }

    dfsVisited[srcr][srcc] = false;
    return Promise.resolve(false);
}