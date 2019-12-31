var init = {
    map : function() {
        if(typeof Memory.map == 'undefined') {
            Memory.map = {};
        }
        for(var roomName in Game.rooms) {
            if(typeof Memory.map[roomName] == 'undefined') {
                Memory.map[roomName] = {};
            }
            for(var x = 0; x < 50; x++) {
                if(Memory.map[roomName] == null) Memory.map[roomName] = {};
    
                if(Memory.map[roomName][x] == null) {
                    Memory.map[roomName][x] = {};
                }
                for(var y = 0; y < 50; y++){
                    if(Memory.map[roomName][x][y] == null) {
                         Memory.map[roomName][x][y] = {'passTimes':0};
                    }
                }
            }
        }
    },
    structure : function() {
        for(var roomName in Game.rooms) {
            var structures = Game.rooms[roomName].find(FIND_STRUCTURES);
            for (var i in structures) {
                var structure = structures[i];
                Memory.map[roomName][structure.pos.x][structure.pos.y].type = 'structure';
                Memory.map[roomName][structure.pos.x][structure.pos.y].subType = structure.structureType;
            }
            // var structures_sites = Game.rooms[roomName].find();

        }
    },
    // 初始化所有的sources资源
    source : function() {
        for(var roomName in Game.rooms) {
            const visual = new RoomVisual(roomName);
            var sources = Game.rooms[roomName].find(FIND_SOURCES);
            for(var i in sources) {
                var source = sources[i];
                if(typeof Memory.source == 'undefined') {
                    Memory.source = {};
                }
                if(typeof Memory.source[roomName] == 'undefined') {
                    Memory.source[roomName] = {};
                }
                if(typeof Memory.source[roomName][source] == 'undefined'){
                    Memory.source[roomName][source] = {};
                }
                if(source.ticksToRegeneration < 10) {
                    Memory.source[roomName][source].lastEnergy = source.energy;
                    //console.log("lastEnergy", Memory.source[source].lastEnergy);
                }
                Memory.map[roomName][source.pos.x][source.pos.y].type = 'source';
                Memory.map[roomName][source.pos.x][source.pos.y].id = source.id;
                visual.text(source.energy, source.pos.x + 0.3, source.pos.y, {align: 'left', size:0.3,opacity: 0.7});
                visual.text(source.ticksToRegeneration, source.pos.x + 0.3, source.pos.y + 0.3, {align: 'left', size:0.3,opacity: 0.7});
                visual.text(Memory.source[roomName][source].lastEnergy, source.pos.x + 0.3, source.pos.y + 0.6, {align: 'left', size:0.3,opacity: 0.7});
            }
        }
    },
    container : function() {
        for(var roomName in Game.rooms) {
            const visual = new RoomVisual(roomName);
            var containers = Game.rooms[roomName].find(FIND_STRUCTURES,{
                filter : (structure) => {
                    return structure.structureType == 'container';
                }
            })
            for(var i in containers) {
                var container = containers[i];
                if(typeof Memory.container == 'undefined') {
                    Memory.container = {};
                }
                if(typeof Memory.container[roomName] == 'undefined') {
                    Memory.container[roomName] = {};
                }
                if(typeof Memory.container[roomName][container.id] == 'undefined') {
                    Memory.container[roomName][container.id] = {};
                }
                // container.find(FIND_SOURCES);
                for(var j = -2; j < 2; j++) {
                    for(var k = -2; k < 2; k++) {
                        var ans = Memory.map[roomName][container.pos.x + j][container.pos.y + k].type;
                        if(ans == 'source') {
                            Memory.container[roomName][container.id].closeSource = true;
                            //container.memory.closeSource = true;
                        }
                    }
                }
                for(var j = -4; j < 4; j++) {
                    for(var k = -4; k < 4; k++) {
                        var ans = Memory.map[roomName][container.pos.x + j][container.pos.y + k].subType;
                        if(ans == 'controller') {
                            Memory.container[roomName][container.id].closeController = true;
                            //container.memory.closeController = true;
                            //console.log(container.closeController);
                            //container.memory.closeController = true;
                        }
                    }
                }
                
            }


        }
    }


}


module.exports = init;
