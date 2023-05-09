import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useObjectives } from '../viewmodels/useObjectives.js';
import { API } from '../models/ApiQuery.js'
import "./App.css"

// NO MAS DE 100 INTENTOS POR DIA 
// LIMITE DE LA API
// INTENTOS ES IGUAL A BORRAR EL LOCALSTORAGE

function Main() {
	const [goal, setGoal] = useState(localStorage.getItem("goal") || 0);
	const [dates, setDates] = useState(localStorage.getItem("dates") || [])
	const [holidays, setHolidays] = useState([])
	const [start, setStart] = useState(localStorage.getItem("start") || ((new Date()).getFullYear()) + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + (("0" + (new Date()).getDate()).slice(-2)))
	const [timePerWeek, setTimePerWeek] = useState(0)
	const [objectives, addObjective, updateObjective, deleteObjective] = useObjectives();
	const [etaDays, setEtaDays] = useState(0)
	const [etaDate, setEtaDate] = useState("")

	const [daysModalDetalles, setDaysModalDetalles] = useState(localStorage.getItem("week") || Array(7))
	const [hoursModalDetalles, setHoursModalDetalles] = useState(localStorage.getItem("hours") || 0)
	const [etaDaysModalDetalles, setEtaDaysModalDetalles] = useState(0)
	const [etaDateModalDetalles, setEtaDateModalDetalles] = useState("")
	const [startDetalles, setStartDetalles] = useState("")
	const [timePerWeekDetalles, setTimePerWeekDetalles] = useState(0)

	const [idUpdate, setIdUpdate] = useState(0)
	const [startUpdate, setStartUpdate] = useState("")
	const [daysModalUpdate, setDaysModalUpdate] = useState(localStorage.getItem("week") || Array(7))
	const [hoursModalUpdate, setHoursModalUpdate] = useState(localStorage.getItem("hours") || 0)
	const [timePerWeekUpdate, setTimePerWeekUpdate] = useState(0)
	const [etaDateModalUpdate, setEtaDateModalUpdate] = useState("")
	const [etaDaysModalUpdate, setEtaDaysModalUpdate] = useState(0)
	const [holidaysUpdate, setHolidaysUpdate] = useState([])
	const [media, setMedia] = useState(0)


	let h = 0;
	let round = 0;
	let hUpdate = 0;
	let roundUpdate = 0;
	let dayIndex = new Date(start).getDay();
	let dayIndexUpdate = new Date(startUpdate).getDay();
	let t = new Date(start);
	let tUpdate = new Date(startUpdate);
	let tmp=0

	if (typeof (dates) === "string") {
		setDates(dates.split(','))
	}

	let daysSkipped = {};
	let daysSkippedUpdate = {};
	useEffect(() => {
		for (let day of holidays) {
			daysSkipped[new Date(day).toDateString()] = true;
		}
		sumDays()
		setEtaDate(`-> ${t.getDate()}/${t.getMonth() + 1}/${t.getFullYear()}`);
		setEtaDays(round);
	}, [holidays]);

	useEffect(() => {
		for (let day of holidaysUpdate) {
			daysSkippedUpdate[new Date(day).toDateString()] = true;
		}
		sumDaysUpdate()
		setEtaDateModalUpdate(`-> ${tUpdate.getDate()}/${tUpdate.getMonth() + 1}/${tUpdate.getFullYear()}`);
		setEtaDaysModalUpdate(roundUpdate);
	}, [holidaysUpdate]);


	const timeHtml = (day) => {
		localStorage.setItem(day, document.getElementById(day).value);
		recount()
	};
	const timeHtmlUpdate = () => {
		let tmp_update = Array(7)
		for (let index = 0; index < 7; index++) {
			tmp_update[index] = document.getElementsByClassName("update" + index)[0].value
		}
		setTimePerWeekUpdate(tmp_update.reduce((a, b) => parseInt(a) + parseInt(b), 0))
		setDaysModalUpdate(tmp_update)

	};


	useEffect(() => {
		localStorage.setItem("goal", goal);
		localStorage.setItem("start", start);
		recount()
	}, [goal, start, timePerWeek])

	useEffect(() => {
		localStorage.setItem("week", daysModalDetalles);
		localStorage.setItem("hours", hoursModalDetalles);
		objectives.map(e=>{
			tmp+=parseInt(e.etaDays)
		})
		setMedia(tmp/objectives.length)
	})

	useEffect(() => {
		recountUpdate()
	}, [startUpdate, daysModalUpdate, hoursModalUpdate, timePerWeekUpdate])

	function recount() {
		let dia = document.getElementById("dia");
		let total = document.getElementById("sum");
		let sum = 0


		for (let index = 0; index < 7; index++) {
			var tmp = document.getElementById(index);
			if (localStorage.getItem(index)) {
				tmp.value = localStorage.getItem(index);
				sum += parseInt(localStorage.getItem(index));
			} else {
				tmp.value = 0;
			}
			setTimePerWeek(sum)
		}
		total.innerHTML = timePerWeek;


		if (dates.length === 0) {
			console.log("GET")
			API(setDates, dates, start, t, round, dia)
		}
		else {
			const datesBeforeTarget = dates.filter(date => new Date(start) <= new Date(date));
			setHolidays(datesBeforeTarget)
			setDates(dates)
			localStorage.setItem('dates', dates)

		}
		sumDays()
	};

	function recountUpdate() {
		const datesBeforeTarget = dates.filter(date => new Date(start) <= new Date(date));
		setHolidaysUpdate(datesBeforeTarget)
		sumDaysUpdate()

	};

	function sumDays() {
		if (timePerWeek !== 0) {
			while (h < goal) {
				if (daysSkipped[t.toDateString()]) {
					console.log("Festivo: " + t.toDateString())
				}

				else {
					h += parseInt(document.getElementById(dayIndex).value);
				}

				round++
				dayIndex = (dayIndex + 1) % 7
				t = t.setDate(t.getDate() + 1)
				t = new Date(t)
			}
			t = t.setDate(t.getDate() - 1)
			t = new Date(t)
		}
	}
	function sumDaysUpdate() {
		if (timePerWeekUpdate !== 0) {
			while (hUpdate < hoursModalUpdate) {
				if (daysSkippedUpdate[tUpdate.toDateString()]) {
					console.log("Festivo Update: " + tUpdate.toDateString())
				}

				else {
					hUpdate += parseInt(document.getElementsByClassName("update" + dayIndexUpdate)[0].value);
				}
				roundUpdate++
				dayIndexUpdate = (dayIndexUpdate + 1) % 7
				tUpdate = tUpdate.setDate(tUpdate.getDate() + 1)
				tUpdate = new Date(tUpdate)
			}
			tUpdate = tUpdate.setDate(tUpdate.getDate() - 1)
			tUpdate = new Date(tUpdate)
		}
	}

	const clearStorage = () => {
		localStorage.clear();
		document.location.reload()
	};
	const modalDetalles = document.getElementById("detalles")
	const modalUpdate = document.getElementById("update")
	const modalMedia = document.getElementById("media")

	return (
		<div>
			<form>

				<label htmlFor="start">Dia de inicio </label>
				<input type='date' id="start" name='start' value={start} onChange={(e) => setStart(e.target.value)} />

				<br />

				<dialog id='detalles'>
					<h2>Detalles</h2>
					<input type='date' id="start" name='start' value={startDetalles} readOnly />
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
								<td>time: <input type="number" min="0" max="24" className="1" value={daysModalDetalles[1] || 0} readOnly /></td>
								<td>time: <input type="number" min="0" max="24" className="2" value={daysModalDetalles[2] || 0} readOnly /></td>
								<td>time: <input type="number" min="0" max="24" className="3" value={daysModalDetalles[3] || 0} readOnly /></td>
								<td>time: <input type="number" min="0" max="24" className="4" value={daysModalDetalles[4] || 0} readOnly /></td>
								<td>time: <input type="number" min="0" max="24" className="5" value={daysModalDetalles[5] || 0} readOnly /></td>
								<td>time: <input type="number" min="0" max="24" className="6" value={daysModalDetalles[6] || 0} readOnly /></td>
								<td>time: <input type="number" min="0" max="24" className="0" value={daysModalDetalles[0] || 0} readOnly /></td>
							</tr>
						</tbody>
					</table>
					<br />

					<span>Horas a hacer: <input type="number" name="goal" id="goal" min="1" readOnly value={hoursModalDetalles || 0} />
					</span>
					<br />
					<p>Horas por semana: <span id="sumModal">{timePerWeekDetalles}</span></p>
					<p>ETA: <span id="dateModal">{etaDaysModalDetalles}</span> dias <span id="diaModal">{etaDateModalDetalles}</span></p>
					<br />
					<input type='button' value="Cerrar" onClick={() => modalDetalles.close()}></input>
				</dialog>

				<dialog id='update'>
					<h2>Actualizar</h2>
					<input type='date' id="start" name='start' value={startUpdate} onChange={(e) => setStartUpdate(e.target.value)} />
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
								<td>time: <input type="number" min="0" max="24" className="update1" value={daysModalUpdate[1] || 0} onChange={timeHtmlUpdate} /></td>
								<td>time: <input type="number" min="0" max="24" className="update2" value={daysModalUpdate[2] || 0} onChange={timeHtmlUpdate} /></td>
								<td>time: <input type="number" min="0" max="24" className="update3" value={daysModalUpdate[3] || 0} onChange={timeHtmlUpdate} /></td>
								<td>time: <input type="number" min="0" max="24" className="update4" value={daysModalUpdate[4] || 0} onChange={timeHtmlUpdate} /></td>
								<td>time: <input type="number" min="0" max="24" className="update5" value={daysModalUpdate[5] || 0} onChange={timeHtmlUpdate} /></td>
								<td>time: <input type="number" min="0" max="24" className="update6" value={daysModalUpdate[6] || 0} onChange={timeHtmlUpdate} /></td>
								<td>time: <input type="number" min="0" max="24" className="update0" value={daysModalUpdate[0] || 0} onChange={timeHtmlUpdate} /></td>
							</tr>
						</tbody>
					</table>
					<br />
					<span>Horas a hacer: <input type="number" name="goal" id="goal" min="1" value={hoursModalUpdate || 0} onChange={(e) => setHoursModalUpdate(e.target.value)} />
					</span>
					<br />
					<p>Horas por semana: <span id="sumModal">{timePerWeekUpdate}</span></p>
					<p>ETA: <span id="dateModal">{etaDaysModalUpdate}</span> dias <span id="diaModal">{etaDateModalUpdate}</span></p>
					<br />
					<input type='button' value="Update" onClick={() => {
						updateObjective({
							id: idUpdate,
							start: startUpdate,
							goal: hoursModalUpdate,
							daysHours: daysModalUpdate,
							totalWeek: timePerWeekUpdate,
							etaDays: etaDaysModalUpdate,
							etaDate: etaDateModalUpdate
						})
						modalUpdate.close()
					}
					}></input>
					<input type='button' value="Cerrar" onClick={() => modalUpdate.close()}></input>
				</dialog>



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
						<td>time: <input type="number" min="0" max="24" id="1" value={localStorage.getItem(1) || 0} onChange={() => timeHtml(1)}></input></td>
						<td>time: <input type="number" min="0" max="24" id="2" value={localStorage.getItem(2) || 0} onChange={() => timeHtml(2)}></input></td>
						<td>time: <input type="number" min="0" max="24" id="3" value={localStorage.getItem(3) || 0} onChange={() => timeHtml(3)}></input></td>
						<td>time: <input type="number" min="0" max="24" id="4" value={localStorage.getItem(4) || 0} onChange={() => timeHtml(4)}></input></td>
						<td>time: <input type="number" min="0" max="24" id="5" value={localStorage.getItem(5) || 0} onChange={() => timeHtml(5)}></input></td>
						<td>time: <input type="number" min="0" max="24" id="6" value={localStorage.getItem(6) || 0} onChange={() => timeHtml(6)}></input></td>
						<td>time: <input type="number" min="0" max="24" id="0" value={localStorage.getItem(0) || 0} onChange={() => timeHtml(0)}></input></td>
					</tr>
				</tbody>
			</table>
			<br />

			<span>Horas a hacer: <input type="number" name="goal" id="goal" min="1" required onChange={(e) => setGoal(e.target.value)} value={goal} />
			</span>
			<br />
			<input type='button' onClick={
				() => addObjective(
					{
						id: (new Date()).getTime(),
						start: start,
						goal: goal,
						daysHours: [localStorage.getItem(0), localStorage.getItem(1), localStorage.getItem(2), localStorage.getItem(3), localStorage.getItem(4), localStorage.getItem(5), localStorage.getItem(6)],
						totalWeek: timePerWeek,
						etaDays: etaDays,
						etaDate: etaDate
					}
				)
			} value={"Añadir"} />
			<button type="button" id="clear" onClick={clearStorage}>
				Clear All
			</button>
			<p>Horas por semana: <span id="sum"></span></p>
			<p>ETA: <span id="date">{etaDays}</span> dias <span id="dia">{etaDate}</span></p>


			<ul id='objectives'>
				{objectives.map((e) => {
					return (<li key={e.id}>{e.start} - {e.goal} horas para completar - {e.totalWeek} horas por semana
						
						
						<input type='button' value={"Borrar"} onClick={() => deleteObjective(e.id)} />

						<input type='button' onClick={() => {
							setIdUpdate(e.id)
							setStartUpdate(e.start)
							setHoursModalUpdate(e.goal)
							setDaysModalUpdate(e.daysHours);
							setEtaDateModalUpdate(e.etaDate)
							setEtaDaysModalUpdate(e.etaDays)
							setTimePerWeekUpdate(e.totalWeek)
							modalUpdate.showModal()
						}} value="Actualizar" />

						<input type='button' id='detallesButton' onClick={() => {
							setStartDetalles(e.start)
							setHoursModalDetalles(e.goal)
							setDaysModalDetalles(e.daysHours);
							setEtaDateModalDetalles(e.etaDate)
							setEtaDaysModalDetalles(e.etaDays)
							setTimePerWeekDetalles(e.totalWeek)
							modalDetalles.showModal()
						}} value="Detalles" />

					</li>)
				})}
			</ul>

			<dialog id='media'>
				<h2>Media</h2>

					<p>Media de completado de objetivos: <b>{media}</b> dias</p>
			
			<input type='button' value="Cerrar" onClick={() => modalMedia.close()}></input>
			</dialog>
			{objectives.length!==0?<input type='button' value="Calcula media de tiempo" onClick={()=>modalMedia.showModal()}/>:""}
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
