/**
 * 
 * @param {EasyWAFRequestInfo} data
 * @returns {Boolean} Is false when a possible security incident has been found
 */
function check(data){    
    for (const [, value] of Object.entries(data.query)) {
        if(Array.isArray(value)){
            return false;
        }
      }

    return true;
}

module.exports = {
    check: check,
    info: () => {
        return {
            name: 'httpParameterPollution'
        };
    }
};