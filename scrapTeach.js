const puppeteer = require('puppeteer');
const fs = require('fs');
const prof = "http://www.ratemyprofessors.com/ShowRatings.jsp?tid=**&showMyProfs=true";

let pArr = [];

function fileToAray(){
    x = fs.readFileSync('./data.json');
    pArr = JSON.parse(x);
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

// run().then((result)=> { getId(result) }).catch(console.error);
fileToAray().then(secondRun());
/*
Name:
document.querySelector(".profname").innerText;

Quality:
document.querySelector(".grade").innerText;

Level Difficulty:
document.querySelectorAll(".grade")[2].innerText;
*/