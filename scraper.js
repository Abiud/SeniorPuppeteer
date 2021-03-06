const puppeteer = require('puppeteer');
const fs = require('fs');

const idURL = "http://www.ratemyprofessors.com/search.jsp?queryBy=schoolId&schoolName=University+of+Texas+Rio+Grande+Valley+%28all+campuses%29&schoolID=1306&queryoption=TEACHER";
const info = [];

let a = [];
function run () {
    return new Promise(async (resolve, reject) => {
        try { 
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(idURL, {waitUntil: 'networkidle2'});

            n = 1;
            while (true) {
                if (await page.waitForSelector('div.content', 'visible')){
                    console.log(`Pass #${n}`);
                    await page.evaluate( () => document.querySelector( 'div.content' ).click() );
                    n++;
                } else {
                    break;
                }
                await page.waitFor(2000);
                if (n == 196) {
                    break;
                }
            }

            await page.waitFor(3000);
            let ids = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('[id^=my-professor-]');
                console.log(items);
                items.forEach((item) => {
                    id = item.id;
                    results.push({'id': id});
                });
                return results;
            })
            console.log(ids.length);
            await browser.close();
            return resolve(ids)
        } catch (e) {
            return reject(e);
        }
    });
}

run().then((result)=> { getId(result) }).catch(console.error);


function getId(arr) {
    arr.forEach(item => { 
        a.push(item.id.split('-')[2]);
    });
    //secondRun(a);
    //fs.writeFileSync('./data.json', JSON.stringify(a, null, 2));
    return;
}

function secondRun () {
    return new Promise(async (resolve, reject) => {
        try { 
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            for (let i = 0; i < a.length; i++) {
                let url = prof.replace("**", a[i]);
                await page.goto(url, {waitUntil: 'networkidle2'});

            }

            await browser.close();
            return resolve(ids)
        } catch (e) {
            return reject(e);
        }
    });
}
/* 

Get id's
    $('[id^=my-professor-]') 

    same as:
    document.querySelectorAll('[id^=my-professor-]')

*/