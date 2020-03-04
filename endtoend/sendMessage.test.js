/* eslint-disable no-undef */

describe('Send message test', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000/#/', { waitUntil: 'load' })
  })

  it('should send message without error', async () => {
    await expect(page).toFill('[placeholder="Enter your tag"]', '@Tigran')
    await expect(page).toFill('[placeholder="Enter your password"]', '@Tigran')
    await expect(page).toClick('[class="welcomePageStyles_content__3EfBu"]')
    await page.waitForSelector('table', { timeout: 20000 })
    await expect(page).toClick('table')
    await expect(page).toFill('[placeholder="Your message"]', 'Hello test')
    await page.keyboard.press('Enter')
  })
})
