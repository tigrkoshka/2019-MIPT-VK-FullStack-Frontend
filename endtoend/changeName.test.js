/* eslint-disable no-undef */

describe('Puppeteer tests', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000/#/', { waitUntil: 'load' })
  })

  it('should change name without error', async () => {
    await expect(page).toFill('[placeholder="Enter your tag"]', '@Tigran')
    await expect(page).toFill('[placeholder="Enter your password"]', '@Tigran')
    await expect(page).toClick('[class="welcomePageStyles_content__3EfBu"]')

    await page.waitFor(2000)
    await expect(page).toClick('[src$="/static/media/burger.c49120ed.png"]')
    await page.waitForSelector('[placeholder="Your name"]')
    await page.click('[placeholder="Your name"]', { clickCount: 2 })
    await page.keyboard.press('Backspace')
    await page.waitFor(500)
    await expect(page).toFill('[placeholder="Your name"]', 'New test name')
    await page.waitForSelector('[src$="/static/media/tick.9bf6c7db.png"]')
    await expect(page).toClick('[src$="/static/media/tick.9bf6c7db.png"]')
    await expect(page).toClick('[class="headerStyles_vertical__HH6d5"]')

    await page.waitFor(1000)
    await expect(page).toClick('[class="headerStyles_text__3zlfI"]')
  })

  it('should change name back without error', async () => {
    await expect(page).toFill('[placeholder="Enter your tag"]', '@Tigran')
    await expect(page).toFill('[placeholder="Enter your password"]', '@Tigran')
    await expect(page).toClick('[class="welcomePageStyles_content__3EfBu"]')

    await page.waitFor(2000)
    await expect(page).toClick('[src$="/static/media/burger.c49120ed.png"]')
    await page.waitForSelector('[placeholder="Your name"]')
    await page.click('[placeholder="Your name"]', { clickCount: 3 })
    await page.keyboard.press('Backspace')
    await page.waitFor(500)
    await expect(page).toFill('[placeholder="Your name"]', 'Tigran')
    await page.waitForSelector('[src$="/static/media/tick.9bf6c7db.png"]')
    await expect(page).toClick('[src$="/static/media/tick.9bf6c7db.png"]')
    await expect(page).toClick('[class="headerStyles_vertical__HH6d5"]')

    await page.waitFor(1000)
    await expect(page).toClick('[class="headerStyles_text__3zlfI"]')
  })
})
