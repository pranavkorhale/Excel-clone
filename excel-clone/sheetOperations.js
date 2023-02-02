/*
providing functionality to sheet-add ,remove
*/ 


let activeSheetColor  ="#ced6e0";
let sheetsFolderCont = document.querySelector(".sheets-folder-cont");
let addSheetBtn = document.querySelector(".sheet-add-icon");

addSheetBtn.addEventListener("click", (e) => {
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");

    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id", allSheetFolders.length);  //giving unique id to sheet
    //id is based on zero based indexing 
    sheet.innerHTML = `
        <div class="sheet-content">Sheet ${allSheetFolders.length + 1}</div>  
    `;

    sheetsFolderCont.appendChild(sheet);
    sheet.scrollIntoView();

    
    //our data is present in 2 d matrix , so when we switch the sheet at that 
    //time only value in matrix will change only
    //each sheet have its own matrix so we will save all matrix in array 


    createSheetDB();  //create sheet matrix for one sheet
    createGraphComponentMatrix(); //create graph component matrix (ralation matrix)
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
})

function handleSheetRemoval(sheet) {
    sheet.addEventListener("mousedown", (e) => {
        // event 0 left click ,1: scroll click ,2:right click
        if (e.button !== 2) return;

        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if (allSheetFolders.length === 1) {
            alert("A minimum of one sheet is required.");
            return;
        }

        let response = confirm("Delete sheet permanently OK to proceed?");
        if (response === false) return;

        let sheetIdx = Number(sheet.getAttribute("id")); //with the help of id we will track value from container
        // removing sheet data as well as graph relation matrix from array
        collectedSheetDB.splice(sheetIdx, 1);
        collectedGraphComponent.splice(sheetIdx, 1);
        // removing from UI
        handleSheetUIRemoval(sheet)

        // Assign default matrix value to sheet
        sheetDB = collectedSheetDB[0];
        graphComponentMatrix = collectedGraphComponent[0];
        handleSheetProperties();
    })
}

function handleSheetUIRemoval(sheet) {
    sheet.remove();
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0;i < allSheetFolders.length;i++) {
        allSheetFolders[i].setAttribute("id", i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }

    allSheetFolders[0].style.backgroundColor = activeSheetColor;
}

function handleSheetDB(sheetIdx) {
    sheetDB = collectedSheetDB[sheetIdx];
    graphComponentMatrix = collectedGraphComponent[sheetIdx];
}

function handleSheetProperties() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }
    // By default click on first cell via DOM
    let firstCell = document.querySelector(".cell");
    firstCell.click();
}

function handleSheetUI(sheet) {
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = activeSheetColor;
}

function handleSheetActiveness(sheet) {
    sheet.addEventListener("click", (e) => {
        let sheetIdx = Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);
        handleSheetProperties();
        handleSheetUI(sheet);
        console.log(sheetDB);
    })
}


//create sheet matrix
function createSheetDB() {
    let sheetDB = [];
    for (let i = 0; i < rows; i++) {
        let sheetRow = [];
        for (let j = 0; j < cols; j++) {
            let cellProp = {
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                fontFamily: "monospace",
                fontSize: "14",
                fontColor: "#000000",
                BGcolor: "#000000",  // Just for indication purpose,
                value: "",
                formula: "",
                children: [],
            }
            sheetRow.push(cellProp);
        }
        sheetDB.push(sheetRow);
    }
    collectedSheetDB.push(sheetDB); //inserting in array which contains all sheets data
}
//creating graph reltaion matrix
function createGraphComponentMatrix() {
    let graphComponentMatrix = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            // Why array -> More than 1 child relation(dependency)
            row.push([]);
        }
        graphComponentMatrix.push(row);
    }
    collectedGraphComponent.push(graphComponentMatrix);  //inserting in array
}