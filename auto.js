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
                }
                // 建造塔
                if(flag.name == 'tower' || flag.name == 't') {
                    Memory.map[roomName][flag.pos.x][flag.pos.y].wish = STRUCTURE_TOWER;
                }
                //建造道路
                if(flag.name == 'road' || flag.name == 'r') {
                    Memory.map[roomName][flag.pos.x][flag.pos.y].wish = STRUCTURE_ROAD;
                }
                // 建造Container
                // console.log("sdf" + flag.name = 'container' || flag.name == 'c');
                if(flag.name == 'container' || flag.name == 'c') {
                    Memory.map[roomName][flag.pos.x][flag.pos.y].wish = STRUCTURE_CONTAINER;
                }
                if(flag.name == 'clear') {
                     Memory.map[roomName][flag.pos.x][flag.pos.y].wish = "";
                }
                
            }
        }
    }
}

module.exports = auto;