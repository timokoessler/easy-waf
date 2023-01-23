module.exports = {
    badBots: require('./badBots'),
    blockTorExitNodes: require('./blockTorExitNodes'),
    crlfInjection: require('./crlfInjection'),
    directoryTraversal: require('./directoryTraversal'),
    fakeSearchCrawlers: require('./fakeSearchCrawlers'),
    httpParameterPollution: require('./httpParameterPollution'),
    noSqlInjection: require('./noSqlInjection'),
    openRedirect: require('./openRedirect'),
    prototypePollution: require('./prototypePollution'),
    sqlInjection: require('./sqlInjection'),
    xss: require('./xss')
};