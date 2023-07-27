const pup = require('puppeteer')

const url = 'https://www.mercadolivre.com.br';

const searchFor = "macbook";


(async ()=>{

    const browser = await pup.launch({headless: false});

    const page = await browser.newPage();


    await page.goto(url)
    await page.waitForSelector('#cb1-edit')
    await page.type('#cb1-edit', searchFor)


    await Promise.all([
        page.waitForNavigation(),
        await page.click('.nav-search-btn')
    ])

   // ui-search-result-image__element shops__image-element
    const links = await page.$$eval('.ui-search-result_image__element > a', el => el.map(link => link.href))
    let cont=1;
    let list = []
    console.log(links)

    for(const link of links){

        console.log('Page - ', cont);
        await page.goto(link)
        await page.waitForSelector('.ui-pdp-title');
 
        const title = await page.$eval('.ui-pdp-title', element => element.innerText);

        const price = await page.$eval('.andes-money-amount_fraction', element => element.innerText);

        const seller = await page.evaluate(()=>{
            const el = document.querySelector('ui-pdp-seller_link-trgger');
            if(!el) return null
            return el.innerText
        });

        const obj = {}
        obj.title = title;
        obj.price = price;
        (seller ? obj.seller = seller : '')
        obj.link = link;

        list.push(obj)
        cont ++
    }
    console.log(list)


    await page.waitForTimeout(3000)

    await browser.close()

})();