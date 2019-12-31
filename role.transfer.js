var roleTransfer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.transfing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transfing = false;
        }
        if(!creep.memory.transfing && creep.store.getFreeCapacity() == 0) {
            creep.memory.transfing = true;
        }
        //console.log(Creep.prototype.target_id);
        if(!creep.memory.transfing) {
			// 获取能量
			if(creep.checkCloseSourceContainerEnergy(true)) { // 检查container
				creep.getContainerEnergy();
			} else {
			    
			}
        }
        else {
            if(creep.checkSpawnEnergy()) {
                creep.fillSpawnEnergy();
            } else {
                if(creep.checkTowerEnergy()) {
                    creep.say("tawer");
                    creep.fillTowerEnergy();
                } else {
                    // 填充升级container的能量
                    if(creep.checkCloseControllerContainerEnergy()) {
                        creep.fillContainerEnergy();
                    }else {

                    }
                } 
            }

        }
            
    }
};

module.exports = roleTransfer;