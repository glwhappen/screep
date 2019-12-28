var roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(!creep.findAttack()){
            //console.log(1);
            creep.moveTo(Game.flags.Flag1.pos);
            
            //creep.moveTo(Memory.waitPos.attacker, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};
module.exports = roleAttacker;
