var cypress = require('cypress')
var fs = require('fs');
var os = require('os')
const schedule = require('node-schedule');
var reportJsonBasePath = ''
var reportOutBasePath = ''
var screenshotsBasePath = ''
console.log(os.platform())

if (os.platform() == 'win32') {
    reportJsonBasePath = 'cypress\\reports\\mochawesome\\'
    reportOutBasePath = 'cypress\\reports\\'
    screenshotsBasePath = 'cypress\\screenshots\\'
} else {
    reportJsonBasePath = 'cypress/reports/mochawesome/'
    reportOutBasePath = 'cypress/reports/'
    screenshotsBasePath = 'cypress/screenshots/'
}

function deleteall(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteall(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

function copyfiles(src, dest) {
    var ncp = require('ncp').ncp;
    ncp(src, dest, function (err) {
        if (err) {
			console.log("copyfiles:")
            return console.error(err);
        }
        console.log('done!');
    });
}

function mkdir(path) {
    var fs = require('fs-extra');
    // ncp.limit = 16;

    fs.mkdir(path, function (error) {
        if (error) {
            console.log(error);
            return false;
        }
        console.log('创建目录成功');
    })
}

function generatorReport(path) {
    var {merge} = require('mochawesome-merge')
    var margereport = require('mochawesome-report-generator')
    var options = {
        files: [
            reportJsonBasePath + '*.json'
        ],
    }
    var reportOptions = {
        reportDir: reportOutBasePath + path,
    }
    merge(options).then(report => margereport.create(report, reportOptions)).catch((err) => {
		console.log("generatorReport:")
        console.error(err)
    })
}

function reportTaksStatus() {
    console.log("iminreportTaksStatus")
    var request = require('request');
    url = "http:/172.17.0.1:8888/status"
    body = {
        "taskid": process.env.taskid
    }
    request.post({url, body, json: true}, function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    })
}

//将结果post到python查看
function reportToPy(results, reportPath) {
    var host_ip = process.env.host_ip;
	var task_id = process.env.task_id;
    var request = require('request');
    var taskResults = [];
    results.runs.forEach(function (v) {
        taskResults.push({
            'task_name': v.spec.name,
            'task_tests': v.stats.tests,
            'task_passes': v.stats.passes,
            'task_failures': v.stats.failures,
            'task_skipped': v.stats.skipped,
        })
    })
    url = "http://" + host_ip + ":5001/metrics";
    body = {
		"task_id":task_id,
        "total": results.totalTests,
        "passed": results.totalPassed,
        "failed": results.totalFailed,
        "skipped": results.totalSkipped,
        "taskResults": taskResults,
        "totalDuration":(results.totalDuration / 1000 / 60).toFixed(2),
    }

    request.post({url, body, json: true}, function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    })
}

//将结果post到机器人
function reportToBot(results, reportPath) {
    var request = require('request');
	var bot_key = process.env.bot_key;
	var mention_list = process.env.mention_list;
	var send_report = process.env.send_report;
	var task_name = process.env.task_name;
    url = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key="+bot_key;
    body = {
        "msgtype": "text",
        "text": {
            "content": "content",
            "mentioned_list":[],
            "mentioned_mobile_list":[]
        }
    }
    reportUrl=`http://10.0.32.235:8888/${reportPath}/mochawesome.html`
    total=results.totalTests;
    pass=results.totalPassed;
    fail=results.totalFailed;
    pending=results.totalPending;
    skip=results.totalSkipped;
    totalDuration=(results.totalDuration/1000/60).toFixed(2)
    if(total==pass){
        if(send_report =='1'){
            msg2send = `任务：` + task_name + ` 定时任务测试通过`
        }else{
            return
        }
    }else{
        body.text.mentioned_mobile_list = eval(mention_list);
		msg2send = `任务：` + task_name + ` 定时测试结果：测试case：${total}，通过case：${pass}，失败case：${fail}，pending: ${pending}，跳过:${skip} 执行时间：${totalDuration}分钟\n报告访问地址：${reportUrl}`
    }
	body.text.content=msg2send;
    request.post({url, body, json: true}, function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    })
}

function runCypress() {
    var path = process.env.reportpath
	var job_type = process.env.job_type
    console.log(path)
    if (!path) {
        var path = new Date().getTime();
    }
    var spec_js = process.env.spec_js
    console.log(spec_js)
    //先做清除动作
    deleteall(reportJsonBasePath)

    //执行用例
    cypress.run({
        spec: spec_js,
        headless: true,
        browser: 'chrome',
        screenshotsFolder: 'reports/' + path,
        // parallel: true,
        config: {
            video: false,
        }
    })
        .then((results) => {
            generatorReport(path)
			copyfiles('cypress/screenshots', 'cypress/reports/' + path + '/screenshots/')
            reportToPy(results, path)
			if(job_type == '1'){
				reportToBot(results, path)
			}
        })
        .catch((err) => {
            console.error(err)
            process.exit(1)
        })
}

runCypress()

