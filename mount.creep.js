// 将拓展签入 Creep 原型
module.exports = function () {
    _.assign(Creep.prototype, creepExtension);

    if (!Creep.prototype._moveTo) {
        Creep.prototype._moveTo = Creep.prototype.moveTo;
        Creep.prototype.moveTo = function(...myArgumentsArray) {
            //console.log(`My moveTo using rest parameters!`);
            //console.log(this.pos.x);
            //let startCpu = Game.cpu.getUsed();
            var pos = this.pos;
            var room = this.room;
            if(typeof this.memory.lastPos == 'undefined') {
                this.memory.lastPos = pos;
            }
            if(pos.x != this.memory.lastPos.x && pos.y != this.memory.lastPos.y) {
                Memory.map[room.name][pos.x][pos.y].passTimes++;
            }
            this.memory.lastPos = pos;
            //console.log(this.lastPos);
            let returnValue = this._moveTo.apply(this, myArgumentsArray);
            //let endCpu = Game.cpu.getUsed();
       
            //let used = endCpu - startCpu;
       
            //if (!this.memory.moveToCPU) this.memory.moveToCPU = 0;
       
            //this.memory.moveToCPU += used;
       
            return returnValue;
        };
       }



}

// 自定义的 Creep 的拓展
const creepExtension = {
    // 自定义敌人检测
    checkEnemy() { 
        // 代码实现...
    },
    checkBuild() {
        this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    },
    checkRepair() {
        var targets = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: object => (object.hits / object.hitsMax) < 0.9
        });
        //console.log("checkRepair:",targets);

        if(targets) {
            return true;
        } else {
            return false;
        }
    }
    ,
    // 填充所有 spawn 和 extension
    fillSpawnEngry() { 
        this.say("填充Spawn和extension");
        var roomName = Memory.spawn.home;
        
        const room = Game.rooms[roomName];
        if(!room) {
            creep.moveTo(new RoomPosition(25, 25, roomName));
        }
        var targets = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if(targets) {
            if(this.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true;
        } else {
            return false;
        }

    },
    // 填充所有 tower
    fillTower() {
        this.say("填充Tower");
        var roomName = Memory.spawn.home;
        const room = Game.rooms[roomName];
        if(!room) {
            creep.moveTo(new RoomPosition(25, 25, roomName));
        }
        var targets = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) >= this.store.getUsedCapacity();
            }
        });
        if(targets) {
            if(this.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true;
        } else {
            return false;
        }
    },
    
    fillStructureById(id) {
        this.say("填充升级罐子");
        var roomName = Memory.spawn.home;
        const room = Game.rooms[roomName];
        if(!room) {
            creep.moveTo(new RoomPosition(25, 25, roomName));
        }
        var targets = Game.getObjectById(id);
        if(targets && targets.store.getFreeCapacity(RESOURCE_ENERGY) >= this.store.getUsedCapacity()) {
            if(this.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true;
        } else {
            return false;
        }
    },
    // 填充所有 container
    fillContainer(except) {
        // console.log(except);
        this.say("填充containers");
        var roomName = Memory.spawn.home;
        // console.log(roomName);
        // const room = Game.rooms[roomName];
        //console.log(room);
        if(this.room.name != roomName) {
            this.moveTo(new RoomPosition(25, 25, roomName));
        }

        var targets = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                // 储存
                 //Creep.prototype.target_id

                return (structure.structureType == STRUCTURE_CONTAINER && structure.id != except) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) >= this.store.getUsedCapacity();
            }
        });

        if(targets) {
            if(this.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true;
        } else {
            return false;
        }
    },
    // 填充所有 storage
    fillStorages() {
        this.say("填充storage");
        var roomName = Memory.spawn.home;
        const room = Game.rooms[roomName];
        if(!room) {
            creep.moveTo(new RoomPosition(25, 25, roomName));
        }
        var targets = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                // 储存
                return (structure.structureType == STRUCTURE_STORAGE) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) >= this.store.getUsedCapacity();
            }
        });

        if(targets) {
            if(this.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true;
        } else {
            return false;
        }
    },
    // 从Souorce中获取能量
    getEnergyFromSource() {
        var sources = this.pos.findClosestByPath(FIND_SOURCES, {
            filter:(source) => {
                return source.energy > 0;
            }
        });
        if(sources) {
            if(this.harvest(sources) == ERR_NOT_IN_RANGE) {
                this.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return true;
        } else {
            this.say("没有矿可以挖了");
            return false;
        }
    },
    // 从container获取能量
    getEnergyFromContainer(except) {
        this.say("能量container");
        var targets = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER && structure.id != except) 
                && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if(targets) {
            //this.say("成功获取能量");
            if(this.withdraw(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(targets, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return true;
        } else {
            return false;
        }
    },
    getEnergyFromStorages() {
        this.say("能量Storages");
        var targets = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE  && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0);
            }
        });
        if(targets) {
            //this.say("成功获取能量");
            if(this.withdraw(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(targets, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return true;
        } else {
            return false;
        }
    },
    getEnergyFromDrop(){
        this.say("drop");
        var targets = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        if(targets) {
            if(this.pickup(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(targets, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            //creep.moveTo(targets[0]);
            //creep.pickup(targets[0]);
            return true;
        }
        return false;
    },
    wait(){
        var role = this.memory.role;
        //this.say("前往等候区");
        //this.say(Memory.waitPos[role]);
        //console.log(Memory.waitPos[role].x);

        this.moveTo(Memory.waitPos[role]);
    },
    findRepair(){
        
        // pos.findClosestByPath   .room.find
        const targets = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });
        
        //targets.sort((a,b) => a.hits - b.hits);
        if(targets) {
            if(this.repair(targets) == ERR_NOT_IN_RANGE) {
                this.moveTo(targets);
            }
            this.say("repair");
            return true;
        }
        return false;
    },
    findRepairInRange(){
        
        // pos.findClosestByPath   .room.find
        const targets = this.pos.findInRange(FIND_STRUCTURES,1, {
            filter: object => object.hits < object.hitsMax
        });
        //console.log(this.name + targets);
        //targets.sort((a,b) => a.hits - b.hits);
        if(targets.length > 0) {
            if(this.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                this.moveTo(targets[0]);
            }
            this.say("repairInRange");
            return true;
        }
        return false;
    },
    findBuild(){
        var targets = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if(targets) {
            this.say("build");
            if(this.build(targets) == ERR_NOT_IN_RANGE) {
                this.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true;
        }
        return false;
    },
    findUpgrade(){
        this.say("upgrade");
        if(this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
            this.moveTo(this.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            return true;
        }
        return false;
    },
    findAttack(){
        this.say("attacker");
        const target = this.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if(target) {
            if(this.attack(target) == ERR_NOT_IN_RANGE) {
                this.moveTo(target);
            }
            return true;
        }
        return false;
    }

};