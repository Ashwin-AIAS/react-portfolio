const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('BROWSER_ERROR:', msg.text());
            }
        });
        
        page.on('pageerror', error => {
            console.log('PAGE_ERROR:', error.message);
        });

        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
        
        // Let it sit for a second to catch async React mount errors
        await new Promise(r => setTimeout(r, 1000));
        
        await browser.close();
    } catch (e) {
        console.error('SCRIPT_ERROR', e);
    }
})();
