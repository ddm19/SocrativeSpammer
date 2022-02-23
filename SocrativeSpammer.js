const puppeteer = require('puppeteer');

const url = "https://b.socrative.com/login/student/"

async function run () 
{
    var sala = "-1"
    var veces = -1
    var respuesta = 0

    process.argv.forEach(function (val, index, array) // Tratamiento de argumentos
    {
        if (index == 2)
            sala = val;
        else if (index == 3)
            veces = val;
        else if (index == 4)
            respuesta = val
    });

    if(veces == -1 || sala == "-1")
    {
        console.error("Error en los parámetros. Uso: node programa.js NOMBRESALA NºUSUARIOS Respuesta(opcional)[0-3]")
        process.exit();
    }
    const browser = await puppeteer.launch();
    
    const page = await browser.newPage();
    
    await page.goto(url);

    for(var i = 0 ; i < veces ; i++)
    {
        await page.waitForSelector('input');

        await page.focus('[type="text"]');

        await page.keyboard.type(sala, { delay: 100 });

        await page.keyboard.press('Enter');

        await page.waitForNavigation();

        await page.waitForSelector('button')

        const opciones = await page.$$(".answer-option-letter");
        opciones[respuesta].click();

        await page.click('button[class="button button-primary button-large"]'); 

        //await page.waitForNavigation();

        const menu = await page.$x("//div[contains(text(), 'Menu')]");
        if (menu.length > 0) {
            await menu[0].click();
        } else {
            throw new Error("Link not found");
        }
        const logout = await page.$x("//li[contains(text(), 'LOG OUT')]");
        if (logout.length > 0) {
            await logout[0].click();
        } else {
            throw new Error("Link not found");
        }

        const salir = await page.$x("//button[contains(text(), 'Yes')]");
        if (salir.length > 0) {
            await salir[0].click();
            } else {
            throw new Error("Link not found");
            }

        await page.waitForNavigation();

        console.info('Hecho')
    }
    await page.screenshot({path: 'screenshot.png'});

    browser.close();
}

    run();