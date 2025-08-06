export class HUD{
    constructor(scene){
        this.scene = scene;
        this.playScreenTable = document.getElementById("table");
        this.playScreenBottomUI = document.getElementById("playScreenBottom");
        this.table = undefined;
        this.rounds = 0;
    }
    
    createStatus(){

    }
    
    createScoreboard(participants){
        //table
        this.table = document.createElement("table");
        const trHeader = document.createElement("tr");
        this.table.appendChild(trHeader);
        //ROUNDS
        const th = document.createElement("th");
        th.style.width = (100/(participants.length+1))+"%";
        th.innerText = "";
        trHeader.appendChild(th);
        //PLAYER
        for(let i = 0; i < participants.length; ++i){
            const th = document.createElement("th");
            th.style.width = (100/(participants.length+1))+"%";
            th.innerText = participants[i].id;
            trHeader.appendChild(th);
        }
        this.playScreenTable.appendChild(this.table);
        return this.table;
    }
    addRowToScoreboard(scoreboard){
        this.rounds++;
        const tr = document.createElement("tr");
        scoreboard.appendChild(tr);
        tr.innerText = "Score"
        return tr;
    }
    addDataToRow(row, participants){
        const data = [];
        for(let i = 0; i < participants.length; ++i){
            const td = document.createElement("td");
            td.innerHTML = 0;
            td.id = participants[i].id;
            row.appendChild(td);
            data.push(td);
        }
        return data;
    }
}
