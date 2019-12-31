/**
 * 本类用来在屏幕上显示各种内容
 * 
 */
var show = {
    map : function(showRoom) {
        const visual = new RoomVisual(showRoom);
        for(var roomName in Game.rooms) {
            for(var x = 0; x < 50; x++) {
                for(var y = 0; y < 50; y++){
                    // 显示一个点被走过的次数
                    if(Memory.map[roomName][x][y].passTimes > 1) {
                        visual.text(Memory.map[roomName][x][y].passTimes, x, y + 0.1, {size:0.2,opacity: 0.2});
                    }
                    // 如果建造成功，则不显示期望
                    if(Memory.map[roomName][x][y].type == 'structure') {
                        continue;
                    }
                    // 如果有建造extension的期望的话，显示一个字母e
                    if(Memory.map[roomName][x][y].wish == 'extension') {
                        visual.text('e', x, y + 0.3, {size:1,opacity: 0.3});
                    }
                    // 如果有建造tower的期望的话，显示一个字母e
                    if(Memory.map[roomName][x][y].wish == 'tower') {
                        visual.text('t', x, y + 0.3, {size:1,opacity: 0.3});
                    }
                    // 如果有建造road的期望的话，显示一个字母r
                    if(Memory.map[roomName][x][y].wish == 'road') {
                        visual.text('r', x, y + 0.3, {size:1,opacity: 0.3});
                    }
                    // 如果有建造container的期望的话，显示一个字母c
                    if(Memory.map[roomName][x][y].wish == STRUCTURE_CONTAINER) {
                        visual.text('c', x, y + 0.3, {size:1,opacity: 0.3});
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
        var msg = [];
        msg.push('状态显示');
        msg.push('总能量:' + Game.rooms[roomName].energyAvailable);
		var roomList = "";
		for(var name in Game.rooms) {
			roomList += name + " ";
		}
		msg.push('控制房间:' + roomList)
		// 显示所有creep的数量
		for(var role in Memory.number){
            var create = Memory.number[role];
            var str = role + ' : [now :' + create.now + ', max : '  + create.max+ ']';
            msg.push(str);
        }
        msg.push('工地数量:' + Memory.sites.length);
        msg.push('下一个建造road的最小值:' + Memory.limitPassTimes + "当前队列数量:" + Memory.limitCnt);
        msg.push('当前急需修理的物品数量:' + Memory.needRepair.length);
        msg.push('传送模式:' + Memory.transferMode);
        //for(var name in Memory.needRepair) {
        //    console.log(Memory.needRepair[name].structureType, Memory.needRepair[name].hits / Memory.needRepair[name].hitsMax < 0.3);
        //}

		// 显示所有信息
		for(var i in msg) {
		    visual.text(msg[i], x, y++, {align: 'left', size:0.7,opacity: 0.8});
        }
    }

}
module.exports = show;