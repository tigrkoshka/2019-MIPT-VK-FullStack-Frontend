import TranslateUtil from '.'

async function main(count: number) {
  for (let i = 0; i < count; i++) {
    // Translation direction not supported.
    await TranslateUtil.translate('Привет, меня зовут Джон', 'vdsv')
      .then((str) => console.log(str))
      .catch((e) => console.log(e.message))
  }
  for (let i = 0; i < count; i++) {
    // Hi, my name is Jack
    await TranslateUtil.translate('Привет, меня зовут Джек', 'en')
      .then((str) => console.log(str))
      .catch((e) => console.log(e.message))
  }
}

main(3).then()
