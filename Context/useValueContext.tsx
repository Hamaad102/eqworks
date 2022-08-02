import { group } from 'd3-array'
import {
	useState,
	useContext,
	createContext,
	FunctionComponent,
	useEffect,
} from 'react'

// Context
import { useData } from './useDataContext'

// Interface
import { EventsDaily } from '../lib/interfaces'

interface IValueContext {
	dailyEventDays: Array<string>
	dailyEventNames: Array<string>
	hourlyEventDays: Array<string>
}

type Props = {
	children?: React.ReactNode
}

export const ValueContext = createContext<IValueContext>({
	dailyEventDays: [],
	dailyEventNames: [],
	hourlyEventDays: [],
})

export const ValueProvider: FunctionComponent<Props> = ({
	children,
}): JSX.Element => {
	// Context
	const { eventsDaily, eventsHourly } = useData()

	const [dailyEventDays, setDailyEventDays] = useState<Array<string>>([])
	const [dailyEventNames, setDailyEventNames] = useState<Array<string>>([])
	const [hourlyEventDays, setHourlyEventDays] = useState<Array<string>>([])

	useEffect(() => {
		if (eventsDaily.length) {
			// Daily Days
			const dailyDaysArr: Array<string> = []
			const dailyGroupedDays = group(eventsDaily, (d: EventsDaily) => d.date)
			Array.from(dailyGroupedDays, ([key, value]) => dailyDaysArr.push(key))

			// Daily Names
			const dailyNamesArr: Array<string> = []
			const dailyGroupedNames = group(eventsDaily, (d: EventsDaily) => d.name)
			Array.from(dailyGroupedNames, ([key, value]) => dailyNamesArr.push(key))

			// Hourly Days
			const hourlyDaysArr: Array<string> = []
			const hourlyGroupedDays = group(eventsHourly, (d: EventsDaily) => d.date)
			Array.from(hourlyGroupedDays, ([key, value]) => hourlyDaysArr.push(key))

			setDailyEventDays(dailyDaysArr)
			setDailyEventNames(dailyNamesArr)
			setHourlyEventDays(hourlyDaysArr)
		}
	}, [eventsDaily])

	return (
		<ValueContext.Provider
			value={{
				dailyEventDays,
				dailyEventNames,
				hourlyEventDays,
			}}
		>
			{children}
		</ValueContext.Provider>
	)
}

export function useValue(): IValueContext {
	return useContext(ValueContext)
}
