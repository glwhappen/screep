var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');


module.exports.loop = function () {
    // 初始化整张地图
    var thisRoomName = 'sim'
    const visual = new RoomVisual(thisRoomName);
    if(typeof Memory.map == 'undefined') {
        Memory.map = {};
    }
    for(var roomName in Game.rooms) {
        if(typeof Memory.map[roomName] == 'undefined') {
            Memory.map[roomName] = {};
        }
        for(var x = 0; x < 50; x++) {
            if(Memory.map[roomName] == null) Memory.map[roomName] = {};

            if(Memory.map[roomName][x] == null) {
                Memory.map[roomName][x] = {};
            }
            for(var y = 0; y < 50; y++){
                if(Memory.map[roomName][x][y] == null) {
                     Memory.map[roomName][x][y] = {'passTimes':0};
                }
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
        var structures = Game.rooms[roomName].find(FIND_STRUCTURES);
        for (var i in structures) {
            var structure = structures[i];
            Memory.map[roomName][structure.pos.x][structure.pos.y].type = 'structure';
            Memory.map[roomName][structure.pos.x][structure.pos.y].subType = structure.structureType;
        }
        var flags = Game.rooms[roomName].find(FIND_FLAGS);
        for (var i in flags) {
            var flag = flags[i];
            //console.log(flag.name);
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

    //         if(typeof Memory.map == 'undefined') Memory.map = [];
    //         if(typeof Memory.map[i] == 'undefined' || Memory.map[i] == null) {
    //             Memory.map[i] = [];
    //         }
    //         for(var j = 0; j < 50; j++) {
    //             if(Memory.map[i][j] == null) {
    //                 Memory.map[i][j] = {};
    //             }
    //             var x = i;
    //             var y = j;
    //             if(Memory.map[x][y] > 50) {
    //                 visual.text('*', x, y, {size:0.2,opacity: 0.8});
    //             }
    //             if(Memory.map[x][y] > 100) {
                    
                    
    //                 visual.text('*', x, y, {size:1,opacity: 0.8});
    //                 Game.spawns['Spawn1'].room.createConstructionSite(x, y, STRUCTURE_ROAD);
    //             }
    //         }
    //     }        
    // }
    



    

    // 遍历每一个creep
    for(var name in Memory.creeps) {
        var creep = Game.creeps[name];
        if(!creep) {
            // 如果这个creep不存在了，直接销毁
            delete Memory.creeps[name];
            console.log('清理没有使用的 creep memory:', name);
        } else {
            // 如果creep存在，进行一些其他操作
            var pos = Game.creeps[name].pos;
            var room = Game.creeps[name].room;
            //console.log(pos, room);
            //console.log(Memory.map[pos.x][pos.y][room.name]);
            if(typeof Memory.map[room.name][pos.x][pos.y] == 'undefined') {
                console.log(`由${creep.name}初始化map `,pos);
                Memory.map[room.name][pos.x][pos.y] = {};
            }
            Memory.map[room.name][pos.x][pos.y].passTimes++;
        }
    }

    
    if(!Creep.prototype._suicide) {
        Creep.prototype._suicide = Creep.prototype.suicide;
        Creep.prototype.suicide = function() {
            console.log(`May ${this.name} rest in peace.`);
            return this._suicide();
        }
    }
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    // console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        //console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'harvester'}});
    }
    if(builders.length < 3) {
        var newName = 'builder' + Game.time;
        //console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory : {role: 'builder'}});
    }
    if(upgraders.length < 2) {
        var newName = 'builder' + Game.time;
        //console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory : {role: 'upgrader'}});
    }
    
	{
		var roomName = 'sim'
		const visual = new RoomVisual(roomName);
		visual.text('状态显示', 15, 14, {align: 'left', size:0.7,opacity: 0.8});
		visual.text('总能量:' + Game.rooms[roomName].energyAvailable, 15, 15, {align: 'left', size:0.7,opacity: 0.8});
		var roomList = "";
		for(var name in Game.rooms) {
			roomList += name + " ";
		}
		visual.text('控制房间:' + roomList, 15, 17, {align: 'left', size:0.7,opacity: 0.8});
		visual.text('harvester:' + harvesters.length, 15, 18, {align: 'left', size:0.7,opacity: 0.8});
		visual.text('builder:' + builders.length, 15, 19, {align: 'left', size:0.7,opacity: 0.8});
		visual.text('upgrader:' + upgraders.length, 15, 20, {align: 'left', size:0.7,opacity: 0.8});
	}

    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}