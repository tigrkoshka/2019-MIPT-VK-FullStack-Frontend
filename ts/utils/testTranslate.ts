import TranslateUtil from '.'

async function main() {
  for (let i = 0; i < 10; i++) {
    await TranslateUtil.translate('Привет, меня зовут Джон', 'en').then((str) => {
      console.log(str)
    })
  }
  for (let i = 0; i < 10; i++) {
    await TranslateUtil.translate('Привет, меня зовут Джек', 'en').then((str) => {
      console.log(str)
    })
  }
}

main().then()
