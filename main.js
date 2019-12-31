var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleTransfer = require('role.transfer');
var structureTower = require('structure.tower');
var init = require('init');
var show = require('show');
var auto = require('auto');
var mount = require('mount');
var fun = require('fun');
var update = require('update');


var Lock = /** @class */ (function () {
    function Lock() {
    }
    Lock.config = true;
    return Lock;
}());

module.exports.loop = function () {
        if (Lock.config) {
        console.log("初始化一次");
        Lock.config = false;
    }
    
    mount();
    var thisRoomName = 'W5N8'
    const visual = new RoomVisual(thisRoomName);
    
    if(Game.time % 1000 == 0) {
        init.map();
        init.structure();
        init.source();
        init.container();   
    }
    
    if(Game.time % 100 == 0) {
        update.map();
    }
    
    
    // show.map(thisRoomName);
     // show.info(thisRoomName, {x:30, y:5});
    
    auto.flagToWish();
    
    structureTower.run();
    
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
            //Memory.map[room.name][pos.x][pos.y].passTimes++;
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
    
    // var roadsites = Game.spawns['Spawns1'].find(FIND_CONSTRUCTION_SITES, {
    //     filter: (structure) => {
    //         return (structure.structureType == STRUCTURE_ROAD);
    //     }
    // });
    // console.log(roadsites.length);


    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }


    for(var role in Memory.number){
        var create = Memory.number[role];
        if(create.now < create.max) {
            // console.log(create["max"] + " " + role);
            var ret = fun.createCreep(create.need, {"role":role});
            // console.log(ret);
            if(ret == 0) {
                // 如果这一次可以建造了，那么先跳过
                break;
            }
        }
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
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if(creep.memory.role == 'transfer') {
            roleTransfer.run(creep);
        }
    }
}