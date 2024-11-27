const ShortUrl = require('../models/shortUrl');


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
        const state = shortUrl.state;
        console.log(state)
        if(shortUrl.state === false){
            return res.status(200).json({ error: 'This url currently unavailable' });
        }
        shortUrl.count = shortUrl.count+1;
        shortUrl.save();
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


module.exports = {

    generateShort,
    redirectShort,
    getPrevShorts,
    urlState
}