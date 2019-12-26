var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var init = require('init');
var show = require('show');
var auto = require('auto');


module.exports.loop = function () {
    // 初始化整张地图
    var thisRoomName = 'sim'
    const visual = new RoomVisual(thisRoomName);
    init.map();
    init.structure();
    show.map(thisRoomName);
    auto.flagToWish();

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