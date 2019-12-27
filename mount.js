const mountCreep = require('./mount.creep')
var oneConfig = function(){
    Memory.speed = {"tower":1, "upgrader":1};
    Memory.hits = {"wall":1000};
    //Memory.waitPos = {"builder":Game.flags.Flag1.pos, "transfer":Game.flags.Flag1.pos, "attacker":Game.flags.Flag1.pos};
    Memory.spawn = {"home":Game.spawns['Spawn1'].room.name};
    //Memory.container = {"upgrader":"a9753353a448f49"};
    
    //Memory.behavior = {"havester":{"fillSpawnEngry":{"findRepair":{"fillContainer":"null"}}}};
    //for(var num in Memory.number) {
    //    if(!Memory[num + "Id"]) {
    //        Memory[num + "Id"] = 1;
    //    }
    //}
    Memory.explorer = [{"room":"W5N9","pos":{x:46,y:6}},{"room":"W4N9","pos":{x:14,y:41}},{"room":"W6N8","pos":{x:32,y:13}}];
    //Memory.repairer = [{"room":"W5N9","pos":{x:46,y:6}}];
}

var config = function(){
    Memory.number = {
        "harvester" :{max : 3, need : {WORK:2, CARRY:2, MOVE:2}, now : _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length},
        "upgrader" : {max : 6, need : {WORK:2, CARRY:2, MOVE:2}, now : _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length},
        "builder" :  {max : 6, need : {WORK:2, CARRY:2, MOVE:2}, now : _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length},
        "transfer" : {max : 0, need : {CARRY:14, MOVE:7}, now : _.filter(Game.creeps, (creep) => creep.memory.role == 'transfer').length},
        "repairer" : {max : 0, need : {WORK:2, CARRY:2, MOVE:2}, now : _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer').length},
        "explorer" : {max : 0, need : {TOUGH:2,CARRY:11, MOVE:6, WORK:4,ATTACK:1}, now : _.filter(Game.creeps, (creep) => creep.memory.role == 'explorer').length},
        "attacker" : {max : 0, need : {TOUGH:10, MOVE:4, ATTACK:4}, now : _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker').length},
    };
    // 自动装配身体

    var energy = Game.rooms[Memory.spawn.home].energyAvailable;
    // builder
    if(energy - 200 >= 100) {
        Memory.number.builder.need = {WORK:parseInt((energy - 200) / 100), CARRY:2, MOVE:2};
    }
    // upgrader
    if(energy - 200 >= 100) {
        Memory.number.upgrader.need = {WORK:parseInt((energy - 200) / 100), CARRY:2, MOVE:2};
    }
    // harvester
    if(energy - 200 >= 100) {
        Memory.number.harvester.need = {WORK:parseInt((energy - 200) / 100), CARRY:2, MOVE:2};
    }
    
    
}

// 挂载所有的额外属性和方法
module.exports = function () {
    config();
    // console.log(global.hasExtension);
    if (!global.hasExtension) {
        console.log('[mount] 重新挂载拓展')
        global.hasExtension = true
        oneConfig();
        mountCreep()
    }
}

