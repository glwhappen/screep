// 将拓展签入 Creep 原型
module.exports = function () {
    _.assign(Creep.prototype, creepExtension);
    // 修改moveTo的函数原型
    if (!Creep.prototype._moveTo) {
        Creep.prototype._moveTo = Creep.prototype.moveTo;
        Creep.prototype.moveTo = function(...myArgumentsArray) {
            var pos = this.pos;
            var room = this.room;
            if(typeof this.memory.lastPos == 'undefined') {
                this.memory.lastPos = pos;
            }
            // 如果路径变化的话，记录当前的点。
            if(pos.x != this.memory.lastPos.x && pos.y != this.memory.lastPos.y) {
                Memory.map[room.name][pos.x][pos.y].passTimes++;
            }
            this.memory.lastPos = pos;
            let returnValue = this._moveTo.apply(this, myArgumentsArray);
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
    // 检测周围是否有工地
    checkBuild() {
        var target =this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if(target) {
            this.memory.target = target;
            return true;
        }
        return false;
    },
    // 建造
    toBuild() {
        this.say('Build');
        var target = this.memory.target;
        if(this.build(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },
    // 检测周围是否有需要修理的结构
    checkRepair() {
        var target = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: object => (object.hits / object.hitsMax) < 0.9
        });
        if(target) {
            this.memory.target = target;
            return true;
        } else {
            return false;
        }
    },
    // 修理
    toRepair() {
        say('Repair');
        var target = this.memory.target;
        if(this.repair(targets) == ERR_NOT_IN_RANGE) {
            this.moveTo(targets);
        }
    },
    // 检测Spawn中的能量
    checkSpawnEnergy() {
        var target = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if(target) {
            this.memory.target = target;
            return true;
        }
        return false;
    },
    // 填充所有 spawn 和 extension
    fillSpawnEnergy() {
        var target = this.memory.target;
        if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },
    // 检测塔中的能量
    checkTowerEnergy() {
        var target = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) >= (this.store.getUsedCapacity() > 500 ? 500 : this.store.getUsedCapacity());
            }
        });
        if(target) {
            this.memory.target = target;
            return true;
        }
        return false;
    },
    // 向塔中添加能量
    fillTowerEnergy() {
        var target = this.memory.target;
        if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },
    // 检查矿石中的能量
    checkSourceEnergy() {
        var target = this.pos.findClosestByPath(FIND_SOURCES, {
            filter:(source) => {
                return source.energy > 0;
            }
        });
        if(target) {
            this.memory.target = target;
            return true;
        } else {
            this.say("没有矿可以挖了");
            return false;
        }    
    },
    // 从矿石获取能量
    getSourceEnergy() {
        var target = this.memory.target;
        if(this.harvest(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    },

    /**
     * 检查挨着矿物的container中的能量
     * @param {当前是判断能否获取吗，默认为否}} get 
     */
    checkCloseSourceContainerEnergy(get) {
        get = get ? get : false;
        var room = this.room.name;
        var target = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter : (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER && 
                Memory.container[room][structure.id].closeSource &&
                (get ? structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0 : 
                structure.store.getFreeCapacity(RESOURCE_ENERGY) >= (this.store.getUsedCapacity() > 500 ? 500 : this.store.getUsedCapacity()) );
            }
        });
        if(target) {
            this.memory.target = target;
            return true;
        }
        return false;
    },
    // 
    /**
     * 检查挨着controller的container中的能量
     * @param {当前是判断能否获取吗，默认为否}} get 
     */
    checkCloseControllerContainerEnergy(get) {
        get = get ? get : false;
        var room = this.room.name;
        var target = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter : (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER && 
                Memory.container[room][structure.id].closeController &&
                (get ? structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0 : 
                structure.store.getFreeCapacity(RESOURCE_ENERGY) >= (this.store.getUsedCapacity() > 500 ? 500 : this.store.getUsedCapacity()));
            }
        });
        if(target) {
            this.memory.target = target;
            return true;
        }
        return false;
    },
    // 填充container
    fillContainerEnergy() {
        var target = this.memory.target;
        if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },
    // 从container中获取能量
    getContainerEnergy() {
        var target = this.memory.target;
        if(this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
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
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) >= (this.store.getUsedCapacity() > 500 ? 500 : this.store.getUsedCapacity());
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