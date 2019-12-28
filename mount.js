const mountCreep = require('./mount.creep')
var oneConfig = function(){
    Memory.speed = {"tower":1, "upgrader":1};
    Memory.hits = {"wall":1000};
    
    //Memory.waitPos = {"builder":Game.flags.Flag1.pos, "transfer":Game.flags.Flag1.pos, "attacker":Game.flags.Flag1.pos};
    if(typeof Memory.spawn == 'undefined') {
        Memory.spawn = {};
    }
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
    // 初始化目前走过最多次数的road
    if(typeof Memory.limitPassTimes == 'undefined') {
        Memory.limitPassTimes = 20;
    }

}

var config = function(){
    Memory.number = {
        "harvester" :{max : 3, need : {WORK:2, CARRY:2, MOVE:2}, now : _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length},
        "repairer" : {max : 0, need : {WORK:2, CARRY:2, MOVE:2}, now : _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer').length},
        "builder" :  {max : 3, need : {WORK:2, CARRY:2, MOVE:2}, now : _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length},
        "upgrader" : {max : 3, need : {WORK:2, CARRY:2, MOVE:2}, now : _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length},
        "transfer" : {max : 0, need : {CARRY:14, MOVE:7}, now : _.filter(Game.creeps, (creep) => creep.memory.role == 'transfer').length},
        "explorer" : {max : 0, need : {TOUGH:2,CARRY:11, MOVE:6, WORK:4,ATTACK:1}, now : _.filter(Game.creeps, (creep) => creep.memory.role == 'explorer').length},
        "attacker" : {max : 0, need : {TOUGH:10, MOVE:4, ATTACK:4}, now : _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker').length},
    };
    // 工地大小
    Memory.sites = _.filter(Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES));
    Memory.sitesMax = 1;
    // 急需修理的物品数量
    Memory.needRepair = _.filter(Game.spawns['Spawn1'].room.find(FIND_STRUCTURES), (structure) => (structure.hits / structure.hitsMax) < 0.5);

    // 自动装配身体
    
    // 如果sites等于0，禁止生产builder
    if(Memory.sites == 0) {
        Memory.number.builder.max = 0;
    } else {
        Memory.number.builder.max = (Memory.sites * 2 <  Memory.number.builder.max ? Memory.sites * 2 : Memory.number.builder.max);
    }

    if(Memory.needRepair.length > 0) {
        Memory.number.repairer.max = 1;
    }
    // 根据Memory.limitCnt 来决定builder的数量
    Memory.number.builder.max = Memory.limitCnt / 5;
    // 排除特殊情况，如果有工地，这个时候必须有一个builder
    if(Memory.number.builder.max > 4) Memory.number.builder.max = 4;
    if(Memory.sites.length > 0 && Memory.number.builder.max == 0)  Memory.number.builder.max = 1;
    
    // 根据每300秒资源的剩余量，来控制harvester的数量
    if(Game.time % 300 == 0) {
        console.log("300");
    }


    // 如果harvester为0，则优先生成
    if (Memory.number.harvester.now == 0) {
        for(var name in Memory.number) {
            if(name != 'harvester') {
                Memory.number[name].max = 0;
            }
        }
    }

    var energy = Game.rooms['W5N8'].energyAvailable;
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
        while(Memory.number.harvester.need.WORK > Memory.number.harvester.need.CARRY) {
            Memory.number.harvester.need.WORK--;
            Memory.number.harvester.need.CARRY += 2;
        }
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

