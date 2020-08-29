let env= 'prd'
let channel = {}
let productCode = 'PH01'
module.exports = {
    // env 为 'uat' 或 'sit'
'env': env,
// 被测页面 url
'target_url': 'https://www.wesure.cn/mall/xproduct/\${productCode}/productDetail?x=${x}&wtagid=${wtag}',
'weblog_url': `https://api.wesure.cn/api/weblog`,

// =============以下为页面加载、操作中调用的部分接口=======================
'api_render_wpp': `https://inf-prdapi.wesure.cn/prdapp/api-render/wpp`
}