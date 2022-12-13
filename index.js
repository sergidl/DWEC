let button=document.getElementById("send")
function time() {
	let total=document.getElementById("sum")
	for (let index = 1; index < 31; index++) {
		let tmp=document.getElementById(index)
		console.log(tmp.innerHTML)
	}
	let day=document.getElementById("day").value
	let hours=document.getElementById("hours").value
	console.log(day)
	console.log(hours)
	
}

