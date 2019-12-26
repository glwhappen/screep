var auto = {
    flagToWish : function() {
        for(var roomName in Game.rooms) {
            var flags = Game.rooms[roomName].find(FIND_FLAGS);
            for (var i in flags) {
                var flag = flags[i];
                if(flag.name == 'extension') {
                    Memory.map[roomName][flag.pos.x][flag.pos.y].wish = STRUCTURE_EXTENSION;
                    console.log(flag.name);
                }
                // 建造塔
                if(flag.name == 'tower') {
                    Memory.map[roomName][flag.pos.x][flag.pos.y].wish = STRUCTURE_TOWER;
                    console.log(flag.name);
                }
            }
        }
    }
}

module.exports = auto;