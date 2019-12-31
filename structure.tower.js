/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('structure.tower');
 * mod.thing == 'a thing'; // true
 */

module.exports.run = function(){
    var targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER);
        }
    });
    for(var i in targets) {
        var tower = targets[i];
        //console.log(tower);
        if(tower) {
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
                Memory.hasAttacker = true;
            } else {
                const target = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: function(object) {
                        return object.hits < object.hitsMax;
                    }
                });
                if(target) {
                    tower.heal(target);
                } else {
                     var closestDamagedStructure = tower.pos.findClosestByRange(Game.time % Memory.speed.tower != 0 ? FIND_MY_STRUCTURES:FIND_STRUCTURES, {
                        filter: (structure) => structure.structureType == "constructedWall" || structure.structureType == "rampart" ? structure.hits < Memory.hits.wall : structure.hits < structure.hitsMax
                    });
                    if(closestDamagedStructure) {
                        tower.repair(closestDamagedStructure);
                    }               
                }
            }
        }    
    }
};