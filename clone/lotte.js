const request = require('request-promise');
const cheerio = require('cheerio');

const options = {
    uri: "http://www.speedl.vn/SpeedSub.do",
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36"
    }
};
const lotteFullData = [{
        url: options.uri + '?category=2&categorytitle=5'
    },
    {
        url: options.uri + '?category=6&categorytitle=17'
    }, // glucid
    {
        url: options.uri + '?category=2&categorytitle=3'
    },
    {
        url: options.uri + '?category=2&categorytitle=4'
    }, // mineral
    {
        url: options.uri + '?category=3&categorytitle=6'
    },
    {
        url: options.uri + '?category=3&categorytitle=7'
    },
    {
        url: options.uri + '?category=3&categorytitle=9'
    },
    {
        url: options.uri + '?category=3&categorytitle=8'
    },
    {
        url: options.uri + '?category=3&categorytitle=10'
    } // protein
];

async function scrapeLotte() {

    return await Promise.all(lotteFullData.map(async (product, index) => {
        options.uri = product.url;
        product.products = [];
        await request(options).then(html => {
            const $ = cheerio.load(html);
            const products = $('ul.speedl-cate-list').find('li');
            products.each((index2, element) => {
                const productName = $(element).find('div.info').children().first().text().trim();
                const productPrice = $(element)
                    .find('span.price').text()
                    .replace(',', '.').replace(/[0-9]+%/, '')
                    .replace('VND', '').trim();
                const productImage = 'http://speedl.vn' + $(element).find('div.img-wrap').find('img').attr('src');
                const tmp = $(element).find('div.img-wrap').find('a').attr('href');
                const productURL = 'http://speedl.vn/ProductDetail.do?prd_seq=' + tmp.substr(tmp.indexOf("('") + 2,
                    tmp.indexOf("')") - 2 - tmp.indexOf("('"));
                product.products.push({
                    name: productName,
                    price: parseFloat(productPrice),
                    img: productImage,
                    url: productURL
                });
            });
        });
        return product;
    }));
}
module.exports = scrapeLotte;