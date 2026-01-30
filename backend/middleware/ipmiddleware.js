let { Blockedip } = require('../db/db');

async function ipmiddleware(req, res, next) {
    try {
        const exist = await Blockedip.find({ ip: req.ip });
        if (!exist.length) throw new Error;
        else {
            global.RequestCnt++;
            if (global.RequestCnt == 5 || ((new Date()).getTime() - (new Date(exist[0].updatedAt)).getTime()) < 5 * 1000) {
                await Blockedip.findOneAndUpdate({ ip: req.ip });
                res.status(500).json({
                    message: "You are Already blocked for 15 seconds",
                    success: false,
                    ratelimit: true
                })
            } else {
                next();
            }
        }
    } catch (e) {
        if (global.RequestCnt == 5) {
            await Blockedip.create({ ip: req.ip });
            res.status(500).json({
                message: "You are blocked for 15 seconds",
                success: false,
                ratelimit: true
            })
        } else {
            global.RequestCnt++;
            next();
        }
    } finally {
        // console.log("global.RequestCnt " + global.RequestCnt);
    }
}



module.exports = {
    ipmiddleware
}