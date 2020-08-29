let urls = require('../fixtures/urls')

/******************README***********************
 * 对 H5 商城/渠道定制页面进行产品详情页的元素检查。
 * 只进行了大部分的元素检查，没有对头图、介绍文案等进行检查。
 * 社保组件、自动续保组件等只检查点击后的样式，没有检查
 * 对应的 js 数据与发起请求时的正确性。
 * 不会点击进行跳转的链接，应当在其它用例中直接打开目标页并进行检查。
 */

let x = 'yd'
let wtag = '122.100.100'
let productCode = 'PH01'
let env = urls.env

// 忽略上报请求
const whitelist = (xhr) => {
  // this function receives the xhr object in question and
  // will whitelist if it's a GET that appears to be a static resource
  let is_static = xhr.method === 'GET' && /\.(jsx?|html|css)(\?.*)?$/.test(xhr.url)
  console.log(`xhr.url: ${xhr.url}`)
  let is_weblog = xhr.url === urls.weblog_url
  return is_static || is_weblog
}


// ============================= 测试用例从这里开始 ================================
describe('PH01-产品详情页元素检查-yd', function () {
  beforeEach(function () {
    cy.server({whitelist})
    cy.viewport('iphone-6+')
    // wait for page load

    cy.route('POST', urls.api_render_wpp)
      .as('api_render_wpp')
    cy.renderURL(env, productCode, wtag, x)
      .then((url)=>{
        cy.envProcessing(env, url)
      })
  })

  // Cypress.on('fail', function(err, runnable) {
  //   cy.screenshot()
  //   throw err
  // })


  it('nav-bar', function () {

    cy.get('li')
      .contains('产品特色')
      .should('have.class', 'ws-tab__item ws-tab__item--selected')

    cy.get('li')
      .contains('理赔说明')
      .should('have.class', 'ws-tab__item')
      .click()

    // cy.get('li')
    //   .contains('理赔说明')
    //   .should('have.class', 'ws-tab__item ws-tab__item--selected')

    cy.get('li')
      .contains(/我要领取|我要投保/)
      .should('have.class', 'ws-tab__item')
      .click()

    // cy.get('li')
    //   .contains(/我要领取|我要投保/)
    //   .should('have.class', 'ws-tab__item ws-tab__item--selected')

    cy.get('li')
      .contains('产品特色')
      .should('have.class', 'ws-tab__item')
      .click()
    //
    // cy.get('li')
    //   .contains('产品特色')
    //   .should('have.class', 'ws-tab__item ws-tab__item--selected')
  })

  it('理赔说明组件', function () {
    cy.get('h3')
      .contains('理赔说明')
      .should('have.class', 'ws-panel__title')

    cy.get('h3')
      .contains('第1步: 理赔报案')
      .should('have.class', 'ws-step__header-text')

    cy.get('h3')
      .contains('第2步: 提交理赔资料')
      .should('have.class', 'ws-step__header-text')

    cy.get('h3')
      .contains('第3步: 完成理赔')
      .should('have.class', 'ws-step__header-text')

    // 点击链接然后看页面是否拉取到东西（没有做很仔细的校验）
    cy.get('a')
      .contains('理赔须知')
      .click()
      .wait(3000)
      .go('back')

  })


  it('本人信息（投保人）填写', function () {
    cy.get('label').contains('姓名')
      .parent()
      .children('input')
      .should('have.attr', 'placeholder', '请输入您的姓名')
      .type("测试名")

    cy.get('label').contains('身份证')
      .parent()
      .children('input')
      .should('have.attr', 'placeholder', '信息保密，仅用于投保')
      .type("111111201908191110")

    cy.get('label').contains('手机号码')
      .parent()
      .children('input')
      .should('have.attr', 'placeholder', '信息保密，仅用于投保')
      .type("13111111111")
  })

  it('为谁投保按钮', function () {
    cy.get('span')
      .contains('父母')
      .parent()
      .should('have.class', 'ws-radio-group__radio')
      .click()
      .should('have.class', 'ws-radio-group__radio ws-radio-group__radio--checked')

    cy.get('span')
      .contains('配偶')
      .parent()
      .should('have.class', 'ws-radio-group__radio')
      .click()
      .should('have.class', 'ws-radio-group__radio ws-radio-group__radio--checked')

    cy.get('span')
      .contains('子女')
      .parent()
      .should('have.class', 'ws-radio-group__radio')
      .click()
      .should('have.class', 'ws-radio-group__radio ws-radio-group__radio--checked')

  })

  it('有无社保按钮', function () {
    cy.get('span')
      .contains('有社保(含新农合)')
      .parent()
      .should('have.class', 'ws-radio-group__radio ws-radio-group__radio--checked')

    cy.get('.ws-radio-group__radio-text')
      .contains('无社保')
      .parent()
      .should('have.class', 'ws-radio-group__radio')
      .click()
      .should('have.class', 'ws-radio-group__radio ws-radio-group__radio--checked')

    cy.get('span')
      .contains('有社保(含新农合)')
      .parent()
      .should('have.class', 'ws-radio-group__radio')
      .click()
      .should('have.class', 'ws-radio-group__radio ws-radio-group__radio--checked')

  })

  it('缴费方式', function () {
    cy.get('span.ws-radio-group__radio-text')
      .contains('按月缴费')
      .parent()
      .should('have.class', 'ws-radio-group__radio ws-radio-group__radio--checked')

    cy.get('.ws-radio-group__radio-text')
      .contains('全额缴清')
      .parent()
      .should('have.class', 'ws-radio-group__radio')
      .click()
      .should('have.class', 'ws-radio-group__radio ws-radio-group__radio--checked')

    cy.get('span.ws-radio-group__radio-text')
      .contains('按月缴费')
      .parent()
      .should('have.class', 'ws-radio-group__radio')
      .click()
      .should('have.class', 'ws-radio-group__radio ws-radio-group__radio--checked')

  })


  it('自动续保组件', function () {
    cy.get('span.ws-radio-group__radio-text')
      .contains('免费开通')
      .parent().eq(0)
      .should('have.class', 'ws-radio-group__radio--checked')

    cy.get('span.ws-radio-group__radio-text')
      .contains('暂不开通').eq(0)
      .click()
      .parent()
      .should('have.class', 'ws-radio-group__radio--checked')

    cy.get('span.ws-radio-group__radio-text')
      .contains('免费开通')
      .should('not.have.class', 'ws-radio-group__radio--rec')
  })

  it('常见问题组件', function () {
    cy.get('h3')
      .contains('常见问题')
      .should('have.class', 'ws-panel__title')

    cy.get('span')
      .contains('有了医保，还需要购买微医保吗？')
      .should('have.class', 'product-faq__question-title')

    cy.get('span')
      .contains('1万元免赔额是什么意思？')
      .should('have.class', 'product-faq__question-title')

    // 点击链接然后看页面是否拉取到东西（没有做很仔细的校验）
    cy.get('div')
      .contains('更多问题')
  })

  it('页面底部投保须知', function () {
    cy.get('span')
      .contains('投保须知')
      .click()

    cy.wait(1000)
    cy.get('body')
      .should('have.class', 'van-overflow-hidden')

    // cy.get('iframe.link-popup__iframe-wrapper')
    //   .iframe('div.wesure-section')
    //   .contains('《保单样本》')
    //   .should('have.attr', 'href', 'file://product/PH01/file/policy_sample.pdf?t=20190505')

    // 关掉这个浮层
    cy.get('i.link-popup__close-icon').click()
  })

  it('页面底部隐私政策', function () {
    cy.get('span.link-popup-group__link-item')
      .contains('隐私政策')
      .click()

    // cy.wait(3000)
    // 加载过慢则会导致用例挂掉
    // cy.get('iframe.link-popup__iframe-wrapper')
    //   .iframe('div.the-canvas-1')
    //   .should('have.class', 'container')

    // 关掉这个浮层
    cy.get('i.link-popup__close-icon').click()

  })

  it('页面底部保险条款', function () {
    cy.get('span.link-popup-group__link-item')
      .contains('保险条款')
      .click()

    cy.wait(1000)

    // 时不时会挂先关掉它
    // cy.get('iframe.link-popup__iframe-wrapper')
    //   .iframe('span')
    //   .contains('附加恶性肿瘤院外特定药品费用医疗保险条款')

    // 关掉这个浮层
    cy.get('i.link-popup__close-icon').click()
  })

  it('健康告知', function () {
    cy.get('.van-popup.product-health-notice-agreement-popup__popup')
      .should('not.visible')

    cy.get('span.link-popup-group__link-item')
      .contains('健康告知')
      .click()

    cy.wait(1000)

    cy.get('.van-popup.product-health-notice-agreement-popup__popup')
      .should('be.visible')

    cy.get('span.health-notice__tip-text')
      .contains('为了保证被保人的保险权益在理赔时不受影响，请确认被保人健康状况是否符合投保条件')

    // 关掉这个浮层
    cy.get('i.ws-popup__close-icon').click()
  })

  it('保障计划', function () {
    cy.get('h3.ws-panel__title')
      .contains('保障计划')

    cy.get('h3.ws-panel__title')
      .parent()
      .parent()
      .get('div.product-combo-v2__more')
      .contains('查看更多').click()
      
    cy.get('div.ws-list__title')
      .contains('100种重大疾病医疗保险金(0免赔额)')
      .parent()
      .children()
      .contains('600万')

    cy.get('div.ws-list__title')
      .contains('一般疾病及意外医疗保险金(1万免赔额)')
      .parent()
      .children()
      .contains('300万')

    cy.get('div.ws-list__title')
      .contains('质子重离子海外医疗保险金(60%赔付)')
      .parent()
      .children()
      .contains('600万')

    cy.get('div.ws-list__title')
      .contains('指定疾病特需医疗保险金(0免赔额)')
      .parent()
      .children()
      .contains('600万')

    cy.get('div.ws-list__title')
      .contains('恶性肿瘤院外特定药品费用医疗保险金')
      .parent()
      .children()
      .contains('600万')

    cy.get('div.ws-list__title')
      .contains('重大疾病住院津贴保险金')
      .parent()
      .children()
      .contains('100元/日')

    cy.get('div.ws-list__title')
      .contains('投保年龄')
      .parent()
      .children()
      .contains('0-65周岁')

    cy.get('div.ws-list__title')
      .contains('保障期限')
      .parent()
      .children()
      .contains('1年')

    cy.get('a')
      .contains('查看详情')
      .click()

    cy.get('strong')
      .contains('投保人年龄')
      .go('back')

  })

  it('默认报价', function () {
    cy.get('div.product-premium__premium-discount-top')
      .contains('首月￥3')

    cy.get('div.product-premium__premium-discount-bottom')
      .contains(/次月起￥22\/月起|次月起￥22起\/月/)
  })

  // it('剩余分数和投保按钮', function () {
  //   cy.get('div.product-banner__last-nums')
  //     .children()
  //     .invoke('text')
  //     .should("gte", 1000)
  //
  //   cy.get("button.ws-btn--primary")
  //     .contains("立即投保")
  // })

  // TODO: 图片的加载
  // TODO：默认报价

})
