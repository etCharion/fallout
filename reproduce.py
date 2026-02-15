import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_viewport_size({"width": 1280, "height": 1000})

        try:
            await page.goto('http://localhost:8000', wait_until='load')
        except Exception as e:
            print(f'Failed to connect: {e}')

        # Click "Nová" button
        try:
            await page.wait_for_selector('button:has-text("Nová")', timeout=10000)
            await page.click('button:has-text("Nová")')
        except Exception as e:
            print(f'Button not found: {e}')
            return

        # Wait for character sheet
        await page.wait_for_selector('.character-sheet-container')

        # Fill some data to match the user's screenshot
        await page.evaluate("""() => {
            // Fill name
            const nameInput = document.querySelector('.char-field-name input');
            if (nameInput) {
                nameInput.value = 'Lyra Downfall';
                nameInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            // Fill origin
            const originInput = document.querySelector('.char-field-origin input');
            if (originInput) {
                originInput.value = 'Obyvatel Vaultu';
                originInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            // Fill HP
            const hpContainer = [...document.querySelectorAll('div')].find(d => d.innerText && d.innerText.includes('ZDRAVÍ (HP)'));
            if (hpContainer) {
                // Find nearest inputs
                const parent = hpContainer.closest('div.border-2');
                if (parent) {
                    const inputs = parent.querySelectorAll('input[type="number"]');
                    if (inputs.length >= 2) {
                        inputs[0].value = '13';
                        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
                        inputs[1].value = '13';
                        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }
            }
        }""")

        # Take print view screenshot
        await page.emulate_media(media='print')
        await page.wait_for_timeout(2000)

        os.makedirs('/home/jules/verification', exist_ok=True)
        await page.screenshot(path='/home/jules/verification/reproduce_issue.png', full_page=True)
        print('Saved reproduce_issue.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
