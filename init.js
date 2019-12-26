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
        }
    }



}


module.exports = init;
