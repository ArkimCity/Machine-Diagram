const Options = document.querySelector("#options");
const innerOptions = document.querySelector("#innerOptions");
const selectedOptions = document.querySelector(".selected-options");
const totalPrice = document.querySelector(".total-price");
const orderButton = document.querySelector(".order-button");

const selectedRendered = {};

async function init() {
    //여기서 기다리게 하는 팝업창 생성
    const response = await fetch('https://n1d8hlyh02.execute-api.ap-northeast-2.amazonaws.com/dev/api/product-options',{
        method: 'GET',
    });

    const data = await response.json();

    for (let option of data) {
        Options.innerHTML += "<option value=" + option.id + ">" + option.optionName + "</option>";
    }

    Options.addEventListener("change", ()=>{
        requestinnerOptions(Options.options[Options.selectedIndex].value, Options.options[Options.selectedIndex].innerText)
    });
    //여기서 기다리게 하는 팝업창 끄기
}

async function requestinnerOptions(optionId, name) {
    innerOptions.innerHTML = null;
    const response = await fetch('https://n1d8hlyh02.execute-api.ap-northeast-2.amazonaws.com/dev/api/product-options/' + optionId, {
        method: 'GET',
    });

    const data = await response.json();


    let optionIds = '';
    for (let option of data) {
        optionIds += option.id + ',';
    }
    let optionStorage = await requestStorage(optionIds);

    for (let option of data) {
        if (optionStorage[option.id].stock != 0) {
            let addaral = "";
            addaral += "<option value=" + option.id + "," + optionStorage[option.id].stock + "," + optionStorage[option.id].optionPrice +">";
            addaral += option.optionName + " (+" + optionStorage[option.id].optionPrice + ") - 재고 : ";
            addaral += optionStorage[option.id].stock + "</option>";
    
            innerOptions.innerHTML += addaral;
        }

    }

    innerOptions.addEventListener("change", ()=>{ 
        let innderSelected = innerOptions.options[innerOptions.selectedIndex].value.split(",");

        if (innderSelected[0] in selectedRendered) {
            alert("이미 선택된 상품입니다");
        } else {
            selectedRendered[innderSelected[0]] = innderSelected[0];
            if (Object.keys(selectedRendered).length == 0) {
                selectedOptions.innerHTML = "옵션을 선택해주세요.";
            } else {
                selectedOptions.innerHTML = "";
            }
            let addaral = "";
            addaral += `<div id="` + innderSelected[0] + `" value="` + innderSelected[2] + `">`
            addaral += name + " "
            addaral += innerOptions.options[innerOptions.selectedIndex].innerText 
            addaral += `<br><input type="number" min="0" max="` + innderSelected[1] + `" id="count` + innderSelected[0] + `" type="text" placeholder="수량을 입력해주세요" value=0> `
            addaral += `<button onclick="plus(` + innderSelected[0] + `)">+</button>`
            addaral += `<button onclick="minus(` + innderSelected[0] + `)">-</button> <br><br>`
            // addaral += `<button onclick="deleteOption(` + innderSelected[0] + `)">삭제</button>`
            addaral += `</div>`
            selectedOptions.innerHTML += addaral;
            document.getElementById("count" + innderSelected[0]).addEventListener("cellchange", ()=>{console.log("w");});
        }
    });
}


async function requestStorage(optionIds) {
    const response = await fetch('https://n1d8hlyh02.execute-api.ap-northeast-2.amazonaws.com/dev/api/stocks/' + optionIds, {
        method: 'GET',
    });
    const data = await response.json();
    return data;
}

init();


function plus(id) {
    document.getElementById("count" + id).value = parseInt(document.getElementById("count" + id).value) + 1;
}
function minus(id) {
    document.getElementById("count" + id).value = parseInt(document.getElementById("count" + id).value) - 1;
}

selectedOptions.addEventListener("change", ()=>{
    let sum = 0;
    for (let childeNode of selectedOptions.childNodes) {
        console.log(childeNode);
        console.log(childeNode.value);
        console.log(document.getElementById("count" + childeNode.id).value);
        sum += parseInt(childeNode.name) * parseInt(document.getElementById("count" + childeNode.id).value);
    }

    totalPrice.innerHTML = sum;
});

function sum() {
    return selectedOptions.firstChild.id;
}

orderButton.addEventListener("click", ()=>{
    let message = "주문할 상품 목록";
    
    alert(message);
});