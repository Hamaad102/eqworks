import { useState, useContext, createContext, FunctionComponent } from 'react'

// Interface
import {
	Daily,
	EventsDaily,
	EventsHourly,
	StatsDaily,
	StatsHourly,
} from '../lib/interfaces'

interface IDataContext {
	eventsDaily: Array<EventsDaily>
	eventsHourly: Array<EventsHourly>
	updateEvents: (daily: Array<EventsDaily>, hourly: Array<EventsHourly>) => void
	statsDaily: Array<StatsDaily>
	statsHourly: Array<StatsHourly>
	updateStats: (daily: Array<StatsDaily>, hourly: Array<StatsHourly>) => void
	daily: Array<Daily>
	updateDaily: (dailyInfo: Array<Daily>) => void
}

type Props = {
	children?: React.ReactNode
}

export const DataContext = createContext<IDataContext>({
	eventsDaily: [],
	eventsHourly: [],
	updateEvents: () => null,
	statsDaily: [],
	statsHourly: [],
	updateStats: () => null,
	daily: [],
	updateDaily: () => null,
})

export const DataProvider: FunctionComponent<Props> = ({
	children,
}): JSX.Element => {
	// Daily information from API
	const [daily, setDaily] = useState<Array<Daily>>([])

	const updateDaily = (dailyInfo: Array<Daily>) => setDaily(dailyInfo)

	// Events information from API
	const [eventsDaily, setEventsDaily] = useState<Array<EventsDaily>>([])
	const [eventsHourly, setEventsHourly] = useState<Array<EventsHourly>>([])

	const updateEvents = (
		daily: Array<EventsDaily>,
		hourly: Array<EventsHourly>
	) => {
		setEventsDaily(daily)
		setEventsHourly(hourly)
	}

	// Stats information from API
	const [statsDaily, setStatsDaily] = useState<Array<StatsDaily>>([])
	const [statsHourly, setStatsHourly] = useState<Array<StatsHourly>>([])

	const updateStats = (
		daily: Array<StatsDaily>,
		hourly: Array<StatsHourly>
	) => {
		setStatsDaily(daily)
		setStatsHourly(hourly)
	}

	return (
		<DataContext.Provider
			value={{
				eventsDaily,
				eventsHourly,
				updateEvents,
				statsDaily,
				statsHourly,
				updateStats,
				daily,
				updateDaily,
			}}
		>
			{children}
		</DataContext.Provider>
	)
}

export function useData(): IDataContext {
	return useContext(DataContext)
}
