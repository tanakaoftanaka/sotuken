let loginStatus = false;

const dateList = ["2022-12-21","2022-12-22","2022-12-23","2022-12-24","2022-12-25","2022-12-26","2022-12-27","2022-12-28","2022-12-29","2022-12-30","2022-12-31","2023-01-01","2023-01-02","2023-01-03","2023-01-04","2023-01-05"]
const studentList = ["2056189","2256103","2256104","2256105","2256121","2256234","2256237","2256238","2256241"]
var resultList = []



function loginAction() {
    let passWord = document.getElementById("passwd")
    console.log(passWord.value)
    sha256(passWord.value).then(hash => {
        console.log(hash)
        if(hash == "36684976be1f529e6e2a32c9edab4cf8e364b2b916ae2ceca8893db20c59af9e") {
            loginStatus == true;
            initAction()
        } else {
            alert("パスワードが不正です。")
        }
    })
}

function initAction() {
    resultList = null
    resultList = Array(studentList.length)
    let a = 0
    while(a < studentList.length) {
        resultList[a] = []
        a++
    }
    console.log(resultList)
    let loginView = document.getElementById("loginContent")
    let recordView = document.getElementById("voiceContent")
    let statusView = document.getElementById("statusView")
    let afterLoad = document.getElementById("afterLoad")
    loginView.innerHTML = "<p>ログインしました。</p><button value='ログアウト' onclick='logout()'>ログアウト</button>";
    statusView.innerHTML = "<p>完了</p>";
    recordView.innerHTML = "<%- tableView %>";
    afterLoad.innerHTML = "";
    // loadAudio();
}

function logout() {
    let loginView = document.getElementById("loginContent")
    let recordView = document.getElementById("voiceContent")
    let afterLoad = document.getElementById("afterLoad")
    const playerHtml = document.getElementById("player")
    const information = document.getElementById("infomation")
    information.innerHTML = ""
    playerHtml.innerHTML = ""
    loginView.innerHTML = "<h2>ログアウトしました。</h2><button value='再ログイン' onclick='reload()'>再ログイン</button>"
    recordView.innerHTML = ""
    statusView.innerHTML = ""
    afterLoad.innerHTML = ""
}

function reload() {
    location.reload()
}


function loadAudio() {
    let recordView = document.getElementById("voiceContent")
    let statusView = document.getElementById("statusView")
    let afterLoad = document.getElementById("afterLoad")
    const information = document.getElementById("infomation")
    information.innerHTML = "<p>12/31 2256237 システム上では通話成功、録音失敗</p>"
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
        statusView.innerHTML = "<p>参照完了。表を作成中...</p>"
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
            recordView.innerHTML = tableText;
            statusView.innerHTML = "<p>完了</p>"
            afterLoad.innerHTML = "<p>取得失敗と表示される場合は、少し時間をおいてから再読み込みして下さい。</p><button onclick='initAction()'>再読み込み</button>"
        }, 500)
        recordView.innerHTML = tableText;
    }, 2000)
}


async function fileCheck(s, d) {
    var audio = new Audio();
    // audio.src = "http://157.118.91.44/~s1957157/zemi/sotsuken/html/audio/" + dateList[d] + "_" + studentList[s] + ".mp3"
    // ここから新規作成
    audio.src = "../audio/" + dateList[d] + "_" + studentList[s] + ".mp3"
    // ここまで新規作成

    resultList[s][d] = "<button onclick='playerSet(" + d + ", " + s + ")'>再生</button>"

    audio.onerror = function() {
        resultList[s][d] = '☓'
    }
}

function playerSet(d, s) {
    const playerHtml = document.getElementById("player")
    // playerHtml.innerHTML = "<audio controls autplay src='https://mt-44.cs-ed.tohoku-gakuin.ac.jp/~s1957157/zemi/sotsuken/html/audio/" + dateList[d] + "_" + studentList[s] + ".mp3'></audio><button onclick='stopAudio()'>停止</button>"
    // ここから新規作成
    playerHtml.innerHTML = "<audio controls autplay src='../audio/" + dateList[d] + "_" + studentList[s] + ".mp3'></audio><button onclick='stopAudio()'>停止</button>"
    // ここまで新規作成
}

function stopAudio() {
    const playerHtml = document.getElementById("player")
    playerHtml.innerHTML = ""
}

async function sha256(text){
    const uint8  = new TextEncoder().encode(text)
    const digest = await crypto.subtle.digest('SHA-256', uint8)
    return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2,'0')).join('')
}
