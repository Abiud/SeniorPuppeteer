const puppeteer = require('puppeteer');
const fs = require('fs');
const prof = "http://www.ratemyprofessors.com/ShowRatings.jsp?tid=**&showMyProfs=true";

let pArr = [];
let professors = [];

function fileToAray(){
    x = fs.readFileSync('./data.json');
    pArr = JSON.parse(x);
    secondRun().then((result)=> { fs.writeFileSync('./dataProf.json', JSON.stringify(result, null, 2)); }).catch(console.error);
}

function secondRun () {
    return new Promise(async (resolve, reject) => {
        try { 
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            for (let i = 0; i < pArr.length; i++) {
                console.log(`Run #${i}`);
                let url = prof.replace("**", pArr[i]);
                await page.goto(url, {waitUntil: 'networkidle2'});


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
                }).catch(console.log(`Error on cell:${i}`));
                professors.push(ids);
            }
            console.log(professors);
            await browser.close();
            return resolve(professors);
        } catch (e) {
            return reject(e);
        }
    });
}

// run().then((result)=> { getId(result) }).catch(console.error);
fileToAray();
/*
Name:
document.querySelector(".profname").innerText;

Quality:
document.querySelector(".grade").innerText;

Level Difficulty:
document.querySelectorAll(".grade")[2].innerText;
*/