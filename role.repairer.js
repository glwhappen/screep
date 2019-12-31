var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var tr = Creep.prototype.transferOpen;
        if(creep.memory.Repairering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.Repairering = false;
        }
        if(!creep.memory.Repairering && creep.store.getFreeCapacity() == 0) {
            creep.memory.Repairering = true;
        }
        
        if(!creep.memory.Repairering) {
			// 获取能量
			if(creep.checkCloseSourceContainerEnergy(true)) { // 检查container
				creep.getContainerEnergy();
			} else {
				if(creep.checkSourceEnergy()) { // 直接挖矿
					creep.getSourceEnergy();
				}
			}
        }
        else {
            if(creep.checkRepair()) {
                creep.findRepair();
            } else {
                creep.findUpgrade();
            }
        }
    }
};
module.exports = roleRepairer;
