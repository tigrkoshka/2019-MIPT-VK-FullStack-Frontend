/* eslint-disable no-undef */

describe('Puppeteer tests', () => {
  beforeEach(async () => {
    await page.goto('https://localhost:3000/#/', { waitUntil: 'load' })
  })

  it('should change name without error', async () => {
    await expect(page).toFill('[placeholder="Enter your tag"]', '@Tigran')
    await expect(page).toFill('[placeholder="Enter your password"]', '@Tigran')
    await expect(page).toClick('[class^="welcomePageStyles_content"]')

    await page.waitFor(2000)
    await expect(page).toClick('[class^="imagesStyles_burger"]')
    await expect(page).toClick('[placeholder="Your name"]', { clickCount: 2 })
    await page.keyboard.press('Backspace')
    await page.waitFor(500)
    await expect(page).toFill('[placeholder="Your name"]', 'New test name')
    await page.waitForSelector('[class^="imagesStyles_tick"]')
    await expect(page).toClick('[class^="imagesStyles_tick"]')
    await expect(page).toClick('[class^="headerStyles_vertical"]')

    await page.waitFor(2000)
    await expect(page).toClick('[class^="imagesStyles_burger"]')
    await page.waitForSelector('[placeholder="Your name"]')
    await expect(page).toClick('[placeholder="Your name"]', { clickCount: 2 })
    await page.keyboard.press('Backspace')
    await page.waitFor(500)
    await expect(page).toFill('[placeholder="Your name"]', 'Tigran')
    await page.waitForSelector('[class^="imagesStyles_tick"]')
    await expect(page).toClick('[class^="imagesStyles_tick"]')
    await expect(page).toClick('[class^="headerStyles_vertical"]')

    await page.waitFor(1000)
    await expect(page).toClick('[class^="headerStyles_text"]')
  })
})
