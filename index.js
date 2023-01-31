function time() {
	let day = document.getElementById("day").value
	let hours = document.getElementById("hours").value
	localStorage.setItem(day, hours)
	location.reload()
}

function recount() {
	let time = 0
	let total = document.getElementById("sum")
	let date = document.getElementById("date")
	let dia = document.getElementById("dia")
	for (let index = 1; index < 8; index++) {
		var tmp = document.getElementById(index)
		if (localStorage.getItem(index)) {
			tmp.innerHTML += localStorage.getItem(index)
			time += parseInt(localStorage.getItem(index))
		}
		else {
			tmp.innerHTML += 0
		}

	}
	total.innerHTML += time
	let hours = 0;
	let round = 0
	while (hours < 100) {

		for (let index = 1; index < 8; index++) {
			hours += parseInt(document.getElementById(index).innerHTML.slice(5))
			if (hours < 100) {
				round++
			}
			console.log(hours)
		}
		if (hours == 0) {
			hours = 101
			round = "∞"
		}
	}
	date.innerHTML += round + " dias"
	let t = new Date()
	t.setDate(t.getDate() + round)
	dia.innerHTML=`-> ${t.getDate()}/${t.getMonth()+1}/${t.getFullYear()}`
		console.log("restante: " + round)


}

function clearStorage() {
	localStorage.clear()
	location.reload()
}

window.addEventListener("load", recount())