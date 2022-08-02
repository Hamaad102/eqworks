import axios from 'axios'

const dailyGet = () => axios.get(`${process.env.NEXT_PUBLIC_DAILY}`)

const dailyEventsGet = () =>
	axios.get(`${process.env.NEXT_PUBLIC_DAILY_EVENTS}`)

const hourlyEventsGet = () =>
	axios.get(`${process.env.NEXT_PUBLIC_HOURLY_EVENTS}`)

const statsGet = () => axios.get(`${process.env.NEXT_PUBLIC_STATS}`)

const dailyStatsGet = () => axios.get(`${process.env.NEXT_PUBLIC_DAILY_STATS}`)

const hourlyStatsGet = () =>
	axios.get(`${process.env.NEXT_PUBLIC_HOURLY_STATS}`)

export {
	dailyGet,
	dailyEventsGet,
	hourlyEventsGet,
	statsGet,
	dailyStatsGet,
	hourlyStatsGet,
}
