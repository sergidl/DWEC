import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useObjectives } from './useObjectives.js';

import "./App.css"

// NO MAS DE 100 INTENTOS POR DIA 
// LIMITE DE LA API
// INTENTOS ES IGUAL A BORRAR EL LOCALSTORAGE O CAMBIAR HORAS OBJETIVO

function Main() {
	const [hours, setHours] = useState(0);
	const [goal, setGoal] = useState(localStorage.getItem("goal") || 0);
	const [dates, setDates] = useState(localStorage.getItem("dates") || [])
	const [holidays, setHolidays] = useState([])
	const [start, setStart] = useState(localStorage.getItem("start") || ((new Date()).getFullYear()) + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + (("0" + (new Date()).getDate()).slice(-2)))
	const [timePerWeek, setTimePerWeek] = useState(0)
	const [objectives, addObjective, updateObjective, deleteObjective] = useObjectives();

	let h = 0;
	let round = 0;
	let dayIndex = new Date(start).getDay();
	let t = new Date(start);

	if (typeof (dates) === "string") {
		setDates(dates.split(','))
	}

	let daysSkipped = {};
	useEffect(() => {
		for (let day of holidays) {
			daysSkipped[new Date(day).toDateString()] = true;
		}
		sumDays()
		let date = document.getElementById("date");
		let dia = document.getElementById("dia");
		dia.innerHTML = `-> ${t.getDate() - 1}/${t.getMonth() + 1}/${t.getFullYear()}`;
		date.innerHTML = round;
	}, [holidays]);


	const timeHtml = () => {
		const day = document.getElementById("day").value;
		if (!(document.getElementById("hours").value > 24) && !(document.getElementById("hours").value < 0)) {
			setHours(document.getElementById("hours").value);
		} else {
			setHours(0);
		}
		localStorage.setItem(day, hours);
		recount()
	};


	useEffect(() => {

		localStorage.setItem("goal", goal);
		localStorage.setItem("start", start);
		recount()
	}, [goal, start, hours, timePerWeek])


	function recount() {
		let dia = document.getElementById("dia");
		let total = document.getElementById("sum");
		let sum = 0

		for (let index = 0; index < 7; index++) {
			var tmp = document.getElementById(index);
			if (localStorage.getItem(index)) {
				tmp.innerHTML = localStorage.getItem(index);
				sum += parseInt(localStorage.getItem(index));
			} else {
				tmp.innerHTML = 0;
			}
			setTimePerWeek(sum)
		}
		total.innerHTML = timePerWeek;


		if (dates.length === 0) {
			console.log("GET")
			axios.get(`https://api.generadordni.es/v2/holidays/holidays?year=2023&country=ES&state=CT`).then(e => {
				let tmp = []
				e.data.forEach(element => {
					tmp.push(element.date)
				});
				setDates(tmp)
				const datesBeforeTarget = dates.filter(date => new Date(start) <= new Date(date) && new Date(date) <= t);
				localStorage.setItem('dates', tmp)
				round += datesBeforeTarget.length
			}).catch(e => dia.innerHTML = "<br/> <br/> <p style='color:red'>" + e + "<p/>")
		}
		else {
			const datesBeforeTarget = dates.filter(date => new Date(start) <= new Date(date));
			setHolidays(datesBeforeTarget)
			setDates(dates)
			localStorage.setItem('dates', dates)
		}
		sumDays()
	};

	function sumDays() {
		if (timePerWeek !== 0) {
			while (h < goal) {
				if (daysSkipped[t.toDateString()]) {
					console.log("Festivo: " + t.toDateString())
				}

				else {
					h += parseInt(document.getElementById(dayIndex).innerHTML);
				}
				round++
				dayIndex = (dayIndex + 1) % 7
				t = t.setDate(t.getDate() + 1)
				t = new Date(t)
			}
		}
	}

	const clearStorage = () => {
		localStorage.clear();
		document.location.reload()
	};
	return (
		<div>
			<form>
				<label htmlFor="day">Dia: </label>
				<select name="day" id="day">
					<option value="1">Lunes</option>
					<option value="2">Martes</option>
					<option value="3">Miércoles</option>
					<option value="4">Jueves</option>
					<option value="5">Viernes</option>
					<option value="6">Sábado</option>
					<option value="0">Domingo</option>
				</select>
				<label htmlFor="hours">Horas: </label>
				<input type="number" name="hours" id="hours" max="24" min="0" required onChange={(e) => setHours(e.target.value)} value={hours} />

				<label htmlFor="start">Dia de inicio </label>
				<input type='date' id="start" name='start' value={start} onChange={(e) => setStart(e.target.value)}></input>

				<br />
				<button type="button" id="send" onClick={timeHtml}>
					Confirma
				</button>
				<button type="button" id="clear" onClick={clearStorage}>
					Clear All
				</button>
				<input type='button' onClick={
					() => addObjective(
						{
							id: objectives.length,
							start: start,
							goal:goal,
							// end: (t.getFullYear()) + "-" + ("0" + (t.getMonth() + 1)).slice(-2) + "-" + (("0" + (t).getDate()).slice(-2)),
							daysHours:[localStorage.getItem(0),localStorage.getItem(1),localStorage.getItem(2),localStorage.getItem(3),localStorage.getItem(4),localStorage.getItem(5),localStorage.getItem(6)]
						}
					)
				}></input>
			</form>

			<table id="calendar">
				<thead>
					<tr>
						<th>Lunes</th>
						<th>Martes</th>
						<th>Miércoles</th>
						<th>Jueves</th>
						<th>Viernes</th>
						<th>Sábado</th>
						<th>Domingo</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>time: <span id="1"></span></td>
						<td>time: <span id="2"></span></td>
						<td>time: <span id="3"></span></td>
						<td>time: <span id="4"></span></td>
						<td>time: <span id="5"></span></td>
						<td>time: <span id="6"></span></td>
						<td>time: <span id="0"></span></td>
					</tr>
				</tbody>
			</table>

<br/>
				<span id='objectives'>
				{objectives.keys()}
				</span>
			<span>Horas a hacer: <input type="number" name="goal" id="goal" min="1" required onChange={(e) => setGoal(e.target.value)} value={goal} />
			</span>
			<p>Horas por semana: <span id="sum"></span></p>
			<p>ETA: <span id="date"></span> dias <span id="dia"></span></p>
		</div>
	)
}

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Main />} />
			</Routes>
		</Router>
	);
}
export default App;
