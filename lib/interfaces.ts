interface DailyEventsBar {
	margin: number
	height: number
	groupCategory: any
	selected: string
	getDate: any
	getName: any
	toggle: boolean
	getEvents: any
	xScale: any
	yScale: any
	onMouseOver: any
	onMouseOut: any
	xAxisLabel: string
}

interface HourlyEventsBar {
	margin: number
	height: number
	groupCategory: any
	date: string
	selected: string | number
	getHour: any
	getEvents: any
	xScale: any
	yScale: any
	onMouseOver: any
	onMouseOut: any
	xAxisLabel: string
}

interface Daily {
	name: string
	events: number
	impressions: number
	clicks: number
	revenue: number
	lat: number
	lon: number
}

interface EventsDaily {
	date: string
	name: string
	events: number
}

interface EventsHourly {
	date: string
	name: string
	hour: number
	events: number
}

interface StatsDaily {
	date: string
	impressions: number
	clicks: number
	revenue: number
}

interface StatsHourly {
	date: string
	name: string
	hour: number
	impressions: number
	clicks: number
	revenue: number
}

interface StatsDailyChart {
	margin: number
	height: number
	width: number
	toggle: boolean
	dateScale: any
	impressionScale: any
	clickScale: any
	revenueScale: any
	onMouseOver: any
	onMouseOut: any
}

interface StatsHourlyChart {
	margin: number
	width: number
	height: number
	toggle: boolean
	groupedDays: any
	selectedDay: string
	hourScale: any
	impressionScale: any
	clickScale: any
	revenueScale: any
	onMouseOver: any
	onMouseOut: any
}

export type {
	DailyEventsBar,
	HourlyEventsBar,
	Daily,
	EventsDaily,
	EventsHourly,
	StatsDaily,
	StatsHourly,
	StatsDailyChart,
	StatsHourlyChart,
}
