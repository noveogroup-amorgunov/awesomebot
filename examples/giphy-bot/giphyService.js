const axios = require('axios');

const API_KEY = process.env.GIPHY_API_KEY || '738fc2a18e3d479eb5f711627925b2bc';

function getApiEndpoind(q) {
    return `http://api.giphy.com/v1/gifs/search?q=${q}&api_key=${API_KEY}&limit=1`;
}

async function getGifUrlByKeywords(keywords) {
    const response = await axios.get(getApiEndpoind(keywords));
    const gifUrl = response.data.data[0].images.fixed_height.url;
    return gifUrl;
}

module.exports = {getGifUrlByKeywords};
