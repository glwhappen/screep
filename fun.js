/**
 * 自己的一些函数
 *  
 */
/**
 * 根据身体部件计算最大的值
 * @param {传入身体部件} need 
 */
var getCnt = function(need){
    var ret = 0;
    for(var n in need){
        if(need[n] == WORK) {
            ret += 100;
        } else {
            ret += 50;
        }
    }
    return ret;
}

var fun = {
    // 创建creep
    createCreep : function(body, data){
        var need = [];
        data.spawn = data.spawn ? data.spawn : "Spawn1";
        var newName = data.role + Game.time;
        for(var i in body){
            for(var j = 0; j < body[i]; j++){
                var a = i;
                need.push(i.toLowerCase());
            }
        }
        if(Game.spawns[data.spawn].canCreateCreep(need) == 0) {
            Game.spawns[data.spawn].spawnCreep(need, newName + "_" + getCnt(need), {memory: {"role": data.role, value: getCnt(need), beginTime: Game.time,id : Memory[data.role + "Id"]}});
            Memory[data.role + "Id"]++;
        }
    }
};
module.exports = fun;