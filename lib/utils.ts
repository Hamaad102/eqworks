import {
	EventsDaily,
	EventsHourly,
	StatsDaily,
	StatsHourly,
} from './interfaces'
import { timeParse, timeFormat } from 'd3-time-format'

// Accessors
const getDate = (d: EventsHourly | StatsDaily | StatsHourly | EventsDaily) =>
	d.date
const getName = (d: EventsHourly) => d.name
const getEvents = (d: EventsHourly) => d.events
const getHours = (d: EventsHourly) => d.hour

// Stats Accessors
const getImpressions = (d: StatsDaily | StatsHourly) => d.impressions
const getClicks = (d: StatsDaily | StatsHourly) => d.clicks
const getRevenue = (d: StatsDaily | StatsHourly) => d.revenue

// Date
const parseDate = timeParse('%Y-%m-%d')
const format = timeFormat('%B %d %Y')
const formatDate = (date: string) => format(parseDate(date) as Date)

export {
	getDate,
	getName,
	getEvents,
	getHours,
	getImpressions,
	getClicks,
	getRevenue,
	parseDate,
	format,
	formatDate,
}
