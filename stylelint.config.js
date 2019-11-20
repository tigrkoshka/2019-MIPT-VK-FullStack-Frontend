// Configuration for StyleLint
// See: https://stylelint.io/user-guide/configuration/

module.exports = {
  extends: ['@wemake-services/stylelint-config-scss', 'stylelint-config-css-modules', 'stylelint-a11y/recommended'],
  plugins: ['stylelint-no-unsupported-browser-features', 'stylelint-a11y'],

  rules: {
    // ignore special `var-` css variables for `:export`
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['/^var-/', 'composes'],
      },
    ],

    // custom plugins to work with
    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning',
        ignore: [
          'flexbox',
          'border-radius',
          'calc',
          'outline',
          'word-break',
          'transforms2d',
          'css-animation',
          'object-fit',
        ],
      },
    ],

    // a11y
    'a11y/content-property-no-static-value': true,

    'a11y/media-prefers-reduced-motion': null,

    'scale-unlimited/declaration-strict-value': ['/color/', 'fill', 'stroke'],
  },
}
