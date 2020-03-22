/* eslint-disable no-undef */

describe('Send message test', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000/#/', { waitUntil: 'load' })
  })

  it('should send message without error', async () => {
    await expect(page).toFill('[placeholder="Enter your tag"]', '@Tigran')
    await expect(page).toFill('[placeholder="Enter your password"]', '@Tigran')
    await expect(page).toClick('[class^="welcomePageStyles_content"]')
    await page.waitForSelector('[href="#/MessageForm/@group_1/Group started by Tigran/1"]')
    await expect(page).toClick('[href="#/MessageForm/@group_1/Group started by Tigran/1"]')
    await expect(page).toFill('[placeholder="Your message"]', 'Hello test')
    await page.keyboard.press('Enter')
    await expect(page).toClick('[class^="headerStyles_text"]')

    await page.waitFor(1000)
    await expect(page).toClick('[class^="headerStyles_text"]')
  })
})
