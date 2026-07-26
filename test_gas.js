const url = "https://script.google.com/macros/s/AKfycbyYyDijq_kjRzqa9CeqGm706-FDssRGaNYN9kLTe9awI3h-fsoK5ZCd3OPZKBv56fnM/exec";

fetch(url, {
    method: "POST",
    body: JSON.stringify({ action: "getPenggunaList", params: ["dummy_token"] }),
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    redirect: "follow"
})
.then(r => r.text())
.then(t => console.log(t))
.catch(e => console.error(e));
