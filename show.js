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
    },
    /**
     * 
     * @param {房间名称} roomName 
     * @param {显示位置} pos 
     */
    info : function(roomName, pos) {
        const visual = new RoomVisual(roomName);
        var x = pos.x;
        var y = pos.y;
		visual.text('状态显示', x, y, {align: 'left', size:0.7,opacity: 0.8});
		visual.text('总能量:' + Game.rooms[roomName].energyAvailable, x, y + 1, {align: 'left', size:0.7,opacity: 0.8});
		var roomList = "";
		for(var name in Game.rooms) {
			roomList += name + " ";
		}
		visual.text('控制房间:' + roomList, x, y + 2, {align: 'left', size:0.7,opacity: 0.8});
		visual.text('harvester:' + Memory.number.harvester.now, x, y + 3, {align: 'left', size:0.7,opacity: 0.8});
		visual.text('builder:' + Memory.number.builder.now, x, y + 4, {align: 'left', size:0.7,opacity: 0.8});
		visual.text('upgrader:' + Memory.number.upgrader.now, x, y + 5, {align: 'left', size:0.7,opacity: 0.8});
    }

}
module.exports = show;