const ShortUrl = require('../models/shortUrl');
const UAParser  = require('ua-parser-js');
var ip = require('ip');


const generateShort = async (req,res)=>{
    {
        try {
            const full = req.body.full;
            if(!full){
                return res.status(400).json({ error: 'full URL is required' });
            }

            const shortUrl = await ShortUrl.create({full:full});
            if(req.user){
                shortUrl.createdby = req.user.username;
                await shortUrl.save();
            }
            return res.status(200).json({ data : { full: shortUrl.full, short: shortUrl.short, createdby: shortUrl.createdby} });
        } catch (error) {
            console.error('Error creating short URL:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

const redirectShort = async (req, res) => {
    try {
        const short = req.params.short;
        
        if (!short) {
            return res.status(400).json({ error: 'short URL required' });
        }

        const shortUrl = await ShortUrl.findOne({ short: short });

        if (!shortUrl) {
            console.error('Short URL not found for:', short);
            return res.status(404).json({ error: 'Short URL not found' });
        }

        if (shortUrl.state === false) {
            return res.status(200).json({ error: 'This URL is currently unavailable' });
        }

        shortUrl.count += 1;

        const newVisit = getClientInfo(req);
        shortUrl.visits.push(newVisit);

        await shortUrl.save();

        res.redirect(shortUrl.full);
    } catch (error) {
        console.error('Error redirecting short URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getPrevShorts = async(req, res)=>{
    try {
        const prevShorts = await ShortUrl.find({ createdby: req.user.username });

        if (!prevShorts || prevShorts.length === 0) {
            return res.status(200).json({ data: "You have not created short links yet" });
        }

        return res.status(200).json({ data: prevShorts });
    } catch (error) {
        console.error('Error fetching previous short URLs:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const urlState = async (req, res)=>{
    try {
        const short = req.params.short;
        const state = req.body.state;

        const shortUrl = await ShortUrl.findOne({short:short});
        if(!shortUrl){
            return res.status(404).json({ error: 'Short URL not found' });
        }
        if(!state){
            return res.status(404).json({ error: 'state must not be empty' });
        }
        shortUrl.state = state;
        shortUrl.save();

        return res.status(200).json({ data : shortUrl });

    } catch (error) {
        return res.status(500).json({ error: error });

    }
    
}


function getClientInfo (req, res){
    const ipAddress =  ip.address();

        const userAgent = req.headers['user-agent'];
        const parser = new UAParser();
        const result = parser.setUA(userAgent).getResult();

        const browserInfo = {
            browser: result.browser.name,
            version: result.browser.version,
            os: result.os.name,
        };

        const newVisit = {
            ip: ipAddress,
            time: new Date(),
            browserInfo: browserInfo,
        };
        return newVisit;
}
module.exports = {

    generateShort,
    redirectShort,
    getPrevShorts,
    urlState
}

