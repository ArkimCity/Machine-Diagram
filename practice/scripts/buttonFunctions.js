export async function getOptions() {
    let data = {};
    fetch('https://n1d8hlyh02.execute-api.ap-northeast-2.amazonaws.com/dev/api/product-options')
        .then(function (response) {
            console.log("성공");
            data.result = response.json();
        })
        .catch(function (error) {
            console.log("실패");
            console.log(error);
        });
    return data;
}