/**
 * 
 * @param {EasyWAFRequestInfo} data
 * @returns {Boolean} Is false when a possible security incident has been found
 */
function check(data){
    for (const [key, value] of Object.entries(data.query)) {
        if(Array.isArray(value)){
            data.query[key] = value[value.length-1];
        }
      }

    return true;
}

module.exports = {
    check: check,
    info: () => { /* istanbul ignore next */
        return {
            name: 'httpParameterPollution'
        };
    }
};