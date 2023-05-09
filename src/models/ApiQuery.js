import axios from 'axios';

export const API=(setDates,dates,start,t,round,dia)=>{axios.get(`https://api.generadordni.es/v2/holidays/holidays?year=2023&country=ES&state=CT`).then(e => {
    let tmp = []
    e.data.forEach(element => {
        tmp.push(element.date)
    });
    setDates(tmp)
    const datesBeforeTarget = dates.filter(date => new Date(start) <= new Date(date) && new Date(date) <= t);
    localStorage.setItem('dates', tmp)
    round += datesBeforeTarget.length
}).catch(e => dia.innerHTML = "<br/> <br/> <p style='color:red'>" + e + "<p/>")}