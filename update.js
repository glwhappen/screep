/**
 * 用来进行全图的更新
 * 
 */
var update = {
    map : function() {
        for(var roomName in Game.rooms) {
            var maxPassTimes = 0; // 寻找经过次数最多的点的通过次数
            var maxPos = {}; // 记录经过最多次数的点的坐标
            Memory.limitCnt = 0; // 记录超过limitMaxTimes的点的个数，如果这个点的数量过多，说明builder不足
            var sitesAdd = 0;
            for(var x = 0; x < 50; x++) {
                for(var y = 0; y < 50; y++){
                    // 显示一个点被走过的次数
                    if(Memory.map[roomName][x][y].passTimes > Memory.limitPassTimes) {
                        if(typeof Memory.map[roomName][x][y].type == 'undefined' && Memory.map[roomName][x][y].passTimes > maxPassTimes) {
                            Memory.limitCnt++;
                            maxPassTimes = Memory.map[roomName][x][y].passTimes;
                            maxPos.x = x;
                            maxPos.y = y;
                        }
                    }
                    // 根据wish建造extension工地
                    if(Memory.map[roomName][x][y].wish == 'extension') {
                        if(Memory.sites.length + sitesAdd < Memory.sitesMax) {
                            ret = Game.spawns['Spawn1'].room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
                            if(ret == 0) sitesAdd++;
                        }
                    }
                    // 根据wish建造tower工地
                    if(Memory.map[roomName][x][y].wish == 'tower') {
                        if(Memory.sites.length + sitesAdd < Memory.sitesMax) {
                            ret = Game.spawns['Spawn1'].room.createConstructionSite(x, y, STRUCTURE_TOWER);
                            if(ret == 0) sitesAdd++;
                        }
                    }
                    // 根据wish建造road工地
                    if(Memory.map[roomName][x][y].wish == 'road') {
                        if(Memory.sites.length + sitesAdd < Memory.sitesMax) {
                            var ret = Game.spawns['Spawn1'].room.createConstructionSite(x, y, STRUCTURE_ROAD);
                            if(ret == 0) sitesAdd++;
                        }
                    }
                    // 根据wish建造container
                    if(Memory.map[roomName][x][y].wish == STRUCTURE_CONTAINER) {
                        if(Memory.sites.length + sitesAdd < Memory.sitesMax) {
                            var ret = Game.spawns['Spawn1'].room.createConstructionSite(x, y, STRUCTURE_CONTAINER);
                            if(ret == 0) sitesAdd++;
                        }
                    }
                }
            }
            //console.log(sitesAdd);
    
            // 自动根据走过次数最多的road建造road工地
            // console.log(maxPassTimes > Memory.limitPassTimes);
            if(Memory.sites.length + sitesAdd < Memory.sitesMax && maxPassTimes > Memory.limitPassTimes) {
                Memory.limitPassTimes = maxPassTimes;
                ret = Game.spawns['Spawn1'].room.createConstructionSite(maxPos.x, maxPos.y, STRUCTURE_ROAD);
                // console.log(ret);
                if(ret == 0) sitesAdd++;
            }

        }
    }
}
module.exports = update;