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
            var sources = Game.rooms[roomName].find(FIND_SOURCES);
            for(var i in sources) {
                var source = sources[i];
                // console.log(source.ticksToRegeneration);
                // console.log(source.energy);
                // console.log(source.pos);
                // console.log(source.room);
                const visual = new RoomVisual(roomName);
                if(typeof Memory.source) {
                    Memory.source = {};
                }
                if(typeof Memory.source[source]){
                    Memory.source[source] = {};
                }
                if(source.ticksToRegeneration < 10 || !source.ticksToRegeneration) {
                    Memory.source[source].lastEnergy = source.energy;
                }

                visual.text(source.energy, source.pos.x + 0.3, source.pos.y, {align: 'left', size:0.3,opacity: 0.7});
                visual.text(source.ticksToRegeneration, source.pos.x + 0.3, source.pos.y + 0.3, {align: 'left', size:0.3,opacity: 0.7});
            }
        }
    }


}


module.exports = init;
