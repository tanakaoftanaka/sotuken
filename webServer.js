const fs = require("fs"),
    ejs = require("ejs"),
    express = require("express"),
    app = express();
    port = process.env.PORT || 4000;

var http = require('http');

var server = http.createServer(app);

const template = fs.readFileSync(`./main.ejs`, "utf-8");

var tableContent = "";
const dateList = ["2022-12-21","2022-12-22","2022-12-23","2022-12-24","2022-12-25","2022-12-26","2022-12-27","2022-12-28","2022-12-29","2022-12-30","2022-12-31","2023-01-01","2023-01-02","2023-01-03","2023-01-04","2023-01-05"]
const studentList = ["2056189","2256103","2256104","2256105","2256121","2256234","2256237","2256238","2256241"]
var resultList = []

app.set("view engine", "ejs");

app.get("/", function(req, res) {
    const data = ejs.render(template, {
    });
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    res.end();
})

app.get("/main.js", function (req, res) {
    const js = fs.readFileSync('./main.js', "utf-8")
    const render = ejs.render(js, {
        // tableView: '\'<a href=\"google.com\">テスト</a>\';'
        tableView: '"' + tableContent + '"'
    })
    res.writeHead(200, { "Content-Type": "text/javascript" });
    res.write(render);
    res.end();
});

function serverInit() {
    resultList = null
    resultList = Array(studentList.length)
    let a = 0
    while(a < studentList.length) {
        resultList[a] = []
        a++
    }
    console.log(resultList)
    loadAudio();
}

function loadAudio() {
    let s = 0;
    while(s < studentList.length) {
        let d = 0;
        while(d < dateList.length) {
            fileCheck(s, d);
            d++;
        }
        s++;
    }
    setTimeout(function() {
        let tableText = "<table border='1'><thead><tr><th>学生番号</th>"
        let tmp = 0;
        while(tmp < dateList.length) {
            tableText += "<th>" + dateList[tmp] + "</th>"
            tmp++
        }
        setTimeout(function(){
            tableText += "</tr></thread><tbody>"
            let tmp2s = 0;
            while(tmp2s < studentList.length) {
                let tmpD = 0;
                if(tmp2s != 0) {
                    tableText += "</tr>"
                }
                tableText += "<tr><td>" + studentList[tmp2s] + "</td>"
                while(tmpD < dateList.length) {
                    tableText += "<td>" + resultList[tmp2s][tmpD] + "</td>"
                    tmpD++
                }
                tmp2s++
            }
            tableContent = tableText;
        }, 1000)
        console.log(tableText)
    }, 2000)
}
var i = 0;
function fileCheck(s, d) {
    i++
    console.log(i + " / " + (dateList.length * studentList.length) + " done.")
    var fileContents = './audio/' + dateList[d] + '_' + studentList[s] + ".mp3";
    if(!fs.existsSync(fileContents)) {
        console.log("File not found");
        resultList[s][d] = '☓'
    } else {
        console.log("file exist.")
        resultList[s][d] = "<button onclick='playerSet(" + d + ", " + s + ")'>再生</button>"
    }
}

server.listen(port, function() {
    console.log("server listen...");
    serverInit()
});
