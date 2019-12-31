var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = true;
        }
        //creep.checkCloseSourceContainerEnergy();

	    if(creep.memory.harvesting) {
            
            if(Memory.number.transfer.now == 0 && creep.checkSpawnEnergy()) {
                creep.fillSpawnEnergy();
            } else {
                if(creep.checkCloseSourceContainerEnergy()) {
                    creep.fillContainerEnergy();
                }
            }
            
        } else {
            // 挖矿
            if(creep.checkSourceEnergy()) {
                creep.getSourceEnergy();
            }
            
        }
	}
};

module.exports = roleHarvester;