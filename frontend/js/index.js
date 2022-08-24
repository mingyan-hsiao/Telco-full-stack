function postData(url, data) {
    // Default options are marked with *
    return fetch(url, {
        body: JSON.stringify(data), // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'user-agent': 'Example',
            'content-type': 'application/json'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    })
        .then(response => response.json()) // 輸出成 json
}


function beforeSubmit(){
    window.open('subPage.html');
    }

function predictType(result){
    if(result==0)
        return  '此客戶短期內不會流失';
    else
        return '此客戶很有可能會流失';
}



// 除錯，不得為空值，一旦有誤，就結束function不會做預測
// function empty(){
//     if(document.getElementById("name").value.length == 0 ||
//     document.getElementById("gender")== null ||
//     document.getElementById("partner")== null ||
//     document.getElementById("depen").value.length == 0 ||
//     document.getElementById("senior").value.length == 0 ||
//     document.getElementById("contract").value.length == 0 ||
//     document.getElementById("charge").value.length == 0 ||
//     document.getElementById("phone").value.length == 0 ||
//     document.getElementById("multiline").value.length == 0 ||
//     document.getElementById("internet").value.length == 0 ||
//     document.getElementById("payment").value.length == 0 ||
//     document.getElementById("paper").value.length == 0){return 1
//     }else{return 0}
// }

function pred(){
    // if (empty() == 1){ 
    //     alert("有空值!");  	
    //     return; 
    // } 

    // 二擇一的旋鈕
    const gender = Number(document.querySelector('input[name="gender"]:checked').value);
    const senior = Number(document.querySelector('input[name="senior"]:checked').value);
    const partner = Number(document.querySelector('input[name="partner"]:checked').value);
    const depen = Number(document.querySelector('input[name="dependent"]:checked').value);
    const phone = Number(document.querySelector('input[name="phone"]:checked').value);
    const multiline = Number(document.querySelector('input[name="multiline"]:checked').value);
    const paper = Number(document.querySelector('input[name="nopaper"]:checked').value);

    // 兩個以上的旋鈕
    let fiber = 0;
    let noInternet = 0;
    if (document.querySelector('input[name="internet"]:checked').value == 'fiber'){
        fiber = 1;
    } else if (document.querySelector('input[name="internet"]:checked').value == 'noInternet'){noInternet=1;}

    let year1 = 0;
    let year2 = 0;
    if (document.querySelector('input[name="contract"]:checked').value == "year1"){
        year1=1;
    } else if (document.querySelector('input[name="contract"]:checked').value == "year2"){year2=1;}

    let credit = 0;
    let elect = 0;
    let mail = 0;
    if (document.querySelector('input[name="payment"]:checked').value == "credit"){
        credit = 1;
    } else if (document.querySelector('input[name="payment"]:checked').value == "elect"){
        elect = 1;
    } else if (document.querySelector('input[name="payment"]:checked').value == "mail"){
        mail = 1;
    }

    // 核取方塊變成虛擬變數
    let security = 0; 
    let backup = 0;
    let protection = 0;
    let support = 0;
    let tv = 0;
    let movie = 0;
    var secur_box = document.getElementById("security"); 
    if (secur_box.checked==true){security = 1}; // can work
    var b_box = document.getElementById("backup"); 
    if (b_box.checked==true){backup = 1};
    var p_box = document.getElementById("protection"); 
    if (p_box.checked==true){protection = 1};
    var s_box = document.getElementById("support"); 
    if (s_box.checked==true){support = 1};
    var tv_box = document.getElementById("tv"); 
    if (tv_box.checked==true){tv = 1};
    var m_box = document.getElementById("movie"); 
    if (m_box.checked==true){movie = 1};


    // 電話服務、網路的除錯，一旦有誤，就結束function不會做預測
    if (phone==0 & multiline==1){
        alert("客戶沒有辦理電話服務，請再確認「是否辦理多條電話線」");
        return;
    }
    if(noInternet==1 & (security+backup+protection+support+tv+movie)>0){
        alert("客戶沒有辦理網路服務喔！請再確認「加購網路相關服務」");
        return;
    }


    // 計算月費，每一個額外服務是10元美金(這邊只是PoC)
    const charge = Number(document.querySelector('input[name="charge"]:checked').value) + (security+backup+protection+support+tv+movie)*10
    // 利用迴歸式來計算客戶停留時間
    const t = 1.17282 + 0.05372*senior + 0.11718*partner - 0.05134*phone + 0.15426*multiline + 0.05033*fiber
              + 0.05712*noInternet + 0.26347*year1 + 0.38546*year2 + 0.12742*security + 0.14223*backup + 0.08172*protection
              + 0.08769*tv + 0.09021*movie - 0.0687*mail + 0.10535*(1-elect-mail) 
    // 加次方，四捨五入
    const tenure = Math.round(Math.pow(t, 1/0.182))
    
    // 結果輸出成json格式
    const data = {
        charge,
        gender,
        senior,
        partner,
        depen,
        phone,
        multiline,
        fiber,
        noInternet,
        security,
        backup,
        protection,
        support,
        tv,
        movie,
        year1,
        year2,
        paper,
        credit,
        elect,
        mail 
    }
    
    // console.log(data);  這邊的用途在於測試
    
    // 下面這一行是 local，如果要用local測試的話，記得要先去run後端的程式碼，這裡才跑得動
    // postData('http://127.0.0.1:3000/predict', data) 

    // 改成把後端部屬到GCP的VM降低延遲，提高scaling能力，但目前VM的問題還沒解決
    // postData('http://34.173.192.9/predict', data)

    // 下面這一行是我把後端部屬到heroku
    postData('https://telco-customer-churn-alice.herokuapp.com/predict', data)
    .then(data=>{
        const result = data.result;
        console.log(data);
        console.log(result);
        console.log(predictType(result));
        if (result==0){
            alert(predictType(result)) 
        } else{alert(predictType(result) + "\n預計停留的時間為"+ String(tenure) + "個月")}    
    })

    // 分群
    if(year1==0 && year2==0){
        alert("經過分群，此客戶屬於「喜歡嘗試型」，建議三個月後可以提出提前續約福利專案，依其最常使用的服務做優惠折扣。")
    } else if (partner==1  || depen==1){
        alert("經過分群，此客戶屬於「相對穩健型」，建議持續確保服務品質的穩定度。")
    } else{
        alert("經過分群，此客戶屬於「經典型」，建議可以持續關注顧客滿意度。")
    } 

}

// function myfun() {
//     if( beforeSubmit(form)==true){window.open('subPage.html')}

//     } 

