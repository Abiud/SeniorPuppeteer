const puppeteer = require('puppeteer');
const fs = require('fs');
const prof = "http://www.ratemyprofessors.com/ShowRatings.jsp?tid=**&showMyProfs=true";

let pArr = []; //array to hold data on data.json
let professors = []; //array to store the new data
let err = []; //array to store the data we couldn't find
let storeErr = [];

function fileToArray() {
    x = fs.readFileSync('./data.json');
    pArr = JSON.parse(x);
    secondRun().then((result) => {
        fs.writeFileSync('./dataProf.json', JSON.stringify(result, null, 2));
    }).catch(console.error);
}

function secondRun() {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            // 2430
            for (let i = 0; i < pArr.length; i++) {
                console.log(`Run #${i}`);
                let url = prof.replace("**", pArr[i]);
                await page.goto(url, {
                    waitUntil: 'networkidle2'
                }).catch(console.error);

                let ids = await page.evaluate(() => {
                    let name = document.querySelector(".profname").innerText;
                    let quality = document.querySelector(".grade").innerText;
                    let dificulty = document.querySelectorAll(".grade")[2].innerText;
                    p = {
                        'name': name,
                        'quality': quality,
                        'dificulty': dificulty
                    }
                    return p;
                }).catch(() => {
                    err.push(pArr[i]);
                });
                if (ids != null) {
                    ids.pid = pArr[i];
                    professors.push(ids);
                }
            }
            fs.writeFileSync('./dataErr.json', JSON.stringify(err, null, 2));
            await browser.close();
            return resolve(professors);
        } catch (e) {
            return reject(e);
        }
    });
}

// run().then((result)=> { getId(result) }).catch(console.error);
// fileToArray();

fileToArrayErr();

function fileToArrayErr() {
    y = fs.readFileSync('./dataProf.json');
    x = fs.readFileSync('./dataErr.json');
    err = JSON.parse(x);
    pArr = JSON.parse(y);
    thirdRun().then((result) => {
        fs.writeFileSync('./dataProf.json', JSON.stringify(result, null, 2));
    }).catch(console.error);
}

function thirdRun() {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            // 2430
            for (let i = 0; i < err.length; i++) {
                console.log(`Run #${i}`);
                let url = prof.replace("**", err[i]);
                await page.goto(url, {
                    waitUntil: 'networkidle2'
                }).catch(console.error);

                let ids = await page.evaluate(() => {
                    let name = document.querySelector(".name").innerText;;
                    p = {
                        'name': name,
                        'quality': '',
                        'dificulty': '',
                    }
                    return p;
                }).catch((err) => {
                    storeErr.push(err[i]);
                    return console.log(err);
                });
                if (ids != null) {
                    ids.pid = err[i];
                    professors.push(ids);
                }
            }
            fs.writeFileSync('./dataErr.json', JSON.stringify(storeErr, null, 2));
            await browser.close();
            return resolve(professors.concat(pArr));
        } catch (e) {
            return reject(e);
        }
    });
}
/*
Name:
document.querySelector(".profname").innerText;

Quality:
document.querySelector(".grade").innerText;

Level Difficulty:
document.querySelectorAll(".grade")[2].innerText;
*/