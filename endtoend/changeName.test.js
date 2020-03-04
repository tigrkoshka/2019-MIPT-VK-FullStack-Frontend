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
    await expect(page).toClick('[class="headerStyles_vertical__HH6d5"]')
    await page.waitForSelector('[class$="profileAndCreateStyles_inputName__2H0Zf"]', { timeout: 10000 })
    await page.click('[class$="profileAndCreateStyles_inputName__2H0Zf"]', { clickCount: 3 })
    await page.keyboard.press('Backspace')
    await page.waitFor(500)
    await expect(page).toFill('[class$="profileAndCreateStyles_inputName__2H0Zf"]', 'New test name')
    await page.waitForSelector('[src$="/static/media/tick.9bf6c7db.png"]', { timeout: 5000 })
    await expect(page).toClick('[src$="/static/media/tick.9bf6c7db.png"]')
    await expect(page).toClick('[class="headerStyles_vertical__HH6d5"]')
  })

  it('should change name back without error', async () => {
    await expect(page).toFill('[placeholder="Enter your tag"]', '@Tigran')
    await expect(page).toFill('[placeholder="Enter your password"]', '@Tigran')
    await expect(page).toClick('[class="welcomePageStyles_content__3EfBu"]')

    await page.waitFor(2000)
    await expect(page).toClick('[class="headerStyles_vertical__HH6d5"]')
    await page.waitForSelector('[class$="profileAndCreateStyles_inputName__2H0Zf"]', { timeout: 10000 })
    await page.click('[class$="profileAndCreateStyles_inputName__2H0Zf"]', { clickCount: 3 })
    await page.keyboard.press('Backspace')
    await page.waitFor(500)
    await expect(page).toFill('[class$="profileAndCreateStyles_inputName__2H0Zf"]', 'Tigran')
    await page.waitForSelector('[src$="/static/media/tick.9bf6c7db.png"]', { timeout: 5000 })
    await expect(page).toClick('[src$="/static/media/tick.9bf6c7db.png"]')
    await expect(page).toClick('[class="headerStyles_vertical__HH6d5"]')
  })
})
