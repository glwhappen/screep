var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

		
	    if(creep.memory.building) {
			// 工作
			if(creep.checkBuild()) {
				creep.toBuild();
				creep.memory.notBuild = false;
			} else {
				if(creep.checkRepair()) {
					creep.toRepair();
					creep.memory.notBuild = false;
				} else {
				    if(creep.checkCloseSourceContainerEnergy()) {
                        creep.fillContainerEnergy();
                        creep.memory.notBuild = true;
                    }
				}
			}
			
	    }
	    else {
			// 获取能量
			if(!creep.memory.notBuild && creep.checkCloseSourceContainerEnergy(true)) { // 检查container
				creep.getContainerEnergy();
			} else {
				if(creep.checkSourceEnergy()) { // 直接挖矿
					creep.getSourceEnergy();
				}
			}
	    }
	}
};

module.exports = roleBuilder;