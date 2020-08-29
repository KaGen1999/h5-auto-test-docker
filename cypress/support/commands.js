// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// import 'cypress-wait-until';
let urls = require('../fixtures/urls')
// env 为 'uat' 或 'sit'
let env = urls.env

Cypress.Commands.add('envProcessing', (env, url) =>{
  Cypress.log({
    name: 'envProcessing',
    consoleProps() {
      return {
        envProcessing: `before visit ${url}`,
      };
    },
  });
  cy.visit(url);
  // wait for page loading because of poor CUP performance
  cy.wait(5000)
  Cypress.log({
    name: 'envProcessing',
    consoleProps() {
      return {
        envProcessing: `after visit ${url}`,
      };
    },
  });
  if(env==='sit'){
    cy.get('div')
      .contains('SIT 环境')
      .click()
  } else if (env==='uat') {
    cy.get('div')
      .contains('UAT 环境')
      .click()
  }

})

Cypress.Commands.add('renderURL', (env, productCode,  wtagid, x='default') => {
  let urlTemplate = {
    "prd": `https://www.wesure.cn/mall/xproduct/${productCode}/productDetail?x=${x}&wtagid=${wtagid}`,
    "uat": `https://inf-devapi.wesure.cn/uatmall/xproduct/${productCode}/productDetail?x=${x}&wtagid=${wtagid}`,
    "sit": `https://inf-devapi.wesure.cn/sitmall/xproduct/${productCode}/productDetail?x=${x}&wtagid=${wtagid}`,
    // "dev": `https://inf-devapi.wesure.cn/devmall/xproduct/${productCode}/productDetail?x=${x}&wtagid=${wtagid}`
  };
  Cypress.log({
    name: 'renderURL',
    consoleProps() {
      return {
        renderURL: `env:${env}, wtagid: ${wtagid}, x: ${x}\n`,
      };
    },
  });
  Cypress.log()
  try {
    Cypress.log({
      name: 'renderURL',
      consoleProps() {
        return {
          renderURL: `${urlTemplate[env]}`,
        };
      },
    });
    return urlTemplate[env]
  } catch (e) {
    throw "unsupport env"
  }
});

// PRD 监控不能用这个
Cypress.Commands.add('userMock', () => {
  let user_mock_url = urls.usermock
  let body = {
    "productCode": "PH01",
    "isH5": "True",
    "applicant": { "gender": "1", "age": "48", "day": "13" },
    "insurant": { "gender": "2", "age": "48", "day": "0" },
    "env": env
  }
  cy.request({
    method: 'POST',
    url: user_mock_url,
    headers: { 'Content-Type': 'application/json' },
    body
  }).then((response) => {
    return response
  })
})

// 不稳定先不用
Cypress.Commands.add('iframe', { prevSubject: 'element' }, ($iframe, selector) => {
  Cypress.log({
    name: 'iframe',
    consoleProps() {
      return {
        iframe: $iframe,
      };
    },
  });
  return new Cypress.Promise(resolve => {
    resolve($iframe.contents().find(selector));
  });
});
