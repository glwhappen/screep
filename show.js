/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('show');
 * mod.thing == 'a thing'; // true
 */
var show = {
    map : function(showRoom) {
        const visual = new RoomVisual(showRoom);
        for(var roomName in Game.rooms) {
            for(var x = 0; x < 50; x++) {
                for(var y = 0; y < 50; y++){
                    if(Memory.map[roomName][x][y].passTimes > 10) {
                        visual.text(Memory.map[roomName][x][y].passTimes, x, y + 0.1, {size:0.2,opacity: 0.2});
                    }
                    // 如果有建造extension的期望的话，显示一个字母e
                    if(Memory.map[roomName][x][y].wish == 'extension') {
                        visual.text('e', x, y + 0.3, {size:1,opacity: 0.3});
                        Game.spawns['Spawn1'].room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
                    }
                    // 如果有建造tower的期望的话，显示一个字母e
                    if(Memory.map[roomName][x][y].wish == 'tower') {
                        visual.text('t', x, y + 0.3, {size:1,opacity: 0.3});
                        Game.spawns['Spawn1'].room.createConstructionSite(x, y, STRUCTURE_TOWER);
    
                    }
                    // 如果建造成功，清楚期望
                    if(Memory.map[roomName][x][y].type == 'structure') {
                        Memory.map[roomName][x][y].wish = '';
                    }
                    
                }
            }
        }
    }
}
module.exports = show;