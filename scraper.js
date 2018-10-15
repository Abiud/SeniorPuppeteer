const puppeteer = require('puppeteer');

const idURL = "http://www.ratemyprofessors.com/search.jsp?queryBy=schoolId&schoolName=University+of+Texas+Rio+Grande+Valley+%28all+campuses%29&schoolID=1306&queryoption=TEACHER";

function run () {
    return new Promise(async (resolve, reject) => {
        try { 
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(idURL, {waitUntil: 'networkidle2'});
            await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})

                let ids = await page.evaluate(() => {
                    let results = [];
                    let items = document.querySelectorAll('[id^=my-professor-]');
                    console.log(items);
                    items.forEach((item) => {
                        results.push(item.id);
                    });
                    return results;
                })
            await browser.close();
            return resolve(ids)
        } catch (e) {
            return reject(e);
        }
    });
}

run().then(console.log).catch(console.error);
/* 

Get id's
$('[id^=my-professor-]')

*/