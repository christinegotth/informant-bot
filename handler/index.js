const fbLibInit = require('../lib/facebook');
const fbLib = fbLibInit();

module.exports = {
    actions: {
        current_time: require('./action_current_time')(fbLib),
        current_news: require('./action_current_news')(fbLib),
    },
    payloads: {
        report_start: require('./payload_report_start')(fbLib),
        fragment_next: require('./payload_fragment_next')(fbLib),
    },
};