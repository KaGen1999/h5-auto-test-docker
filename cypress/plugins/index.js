// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// Cypress.on('test:after:run', (test, runnable) => {
//     if (test.state === 'failed') {
//         const screenshotFileName = `${runnable.parent.title} -- ${test.title} (failed).png`
//         addContext({ test }, `assets/${Cypress.spec.name}/${screenshotFileName}`)
//     }
// })
module.exports = (on, config) => {
  on('before:browser:launch', (browser, launchOptions) => {
    // browser will look something like this
    // {
    //   name: 'chrome',
    //   displayName: 'Chrome',
    //   version: '63.0.3239.108',
    //   path: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    //   majorVersion: '63'
    // }

    if (browser.name === 'chrome') {
      // `args` is an araay of all the arguments
      // that will be passed to Chrome when it launchers
      launchOptions.args.push('--ignore-certificate-errors')
      launchOptions.args.push('--no-referrers')
      // args.push('--headless')
      launchOptions.args.push('--disable-gpu')
      launchOptions.args.push('--disable-dev-shm-usage')

      // whatever you return here becomes the new args
      return launchOptions
    }

    if (browser.name === 'electron') {
      // `args` is a `BrowserWindow` options object
      // https://electronjs.org/docs/api/browser-window#new-browserwindowoptions
      launchOptions.args['fullscreen'] = true

      // whatever you return here becomes the new args
      return launchOptions
    }
  })
}
