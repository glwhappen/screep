/**
 * 一些更好的控制代码
 */
var auto = {
    /**
     * 插旗提前标记建筑建造地址
     * 1. 建造扩展
     * 2. 建造塔
     * 3. 建造道路
     */
    flagToWish : function() {
        for(var roomName in Game.rooms) {
            var flags = Game.rooms[roomName].find(FIND_FLAGS);
            for (var i in flags) {
                var flag = flags[i];
                // 建造扩展
                if(flag.name == 'extension' || flag.name == 'e') {
                    Memory.map[roomName][flag.pos.x][flag.pos.y].wish = STRUCTURE_EXTENSION;
                    console.log(flag.name);
                }
                // 建造塔
                if(flag.name == 'tower' || flag.name == 't') {
                    Memory.map[roomName][flag.pos.x][flag.pos.y].wish = STRUCTURE_TOWER;
                    console.log(flag.name);
                }
                //建造道路
                if(flag.name == 'road' || flag.name == 'r') {
                    Memory.map[roomName][flag.pos.x][flag.pos.y].wish = STRUCTURE_ROAD;
                    consolg.log(flag.name);
                }
            }
        }
    }
}

module.exports = auto;