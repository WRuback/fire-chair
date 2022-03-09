module.exports = {
    generateRoomCode: ()=>{
        const letterbase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let output = "";
        for(let i=0; i<4; i++){
            output = output + letterbase[Math.floor(Math.random()*letterbase.length)];
        }
        return output;
    }
}