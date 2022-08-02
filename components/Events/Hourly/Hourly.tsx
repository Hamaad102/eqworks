// @ts-nocheck
import { useRouter } from 'next/router'

import { group } from 'd3-array'
import useMeasure from 'react-use-measure'
import { useState, useEffect } from 'react'
import { getEvents, getHours, getName, getDate } from '../../../lib/utils'

// Context
import { useData } from '../../../Context/useDataContext'
import { useValue } from '../../../Context/useValueContext'

// Style
import {
	margin,
	defaultWidth,
	defaultHeight,
	ButtonStyle,
	TitleStyle,
} from '../../../styles/Style'

// Components
import { menuItem, menuItemDate } from '../../../lib/components'
import {
	Button,
	FormControl,
	InputLabel,
	Select,
	Stack,
	Typography,
} from '@mui/material'

// Visx + Bar Graph
import { localPoint } from '@visx/event'
import BarComponent from './BarComponent'
import { scaleBand, scaleLinear } from '@visx/scale'
import { defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip'

const Hourly = (): JSX.Element => {
	const router = useRouter()
	const [ref, bounds] = useMeasure()
	const { containerRef, TooltipInPortal } = useTooltipInPortal({
		detectBounds: true,
		scroll: true,
	})

	const { eventsHourly } = useData()
	const { hourlyEventDays } = useValue()

	const {
		showTooltip,
		hideTooltip,
		tooltipData,
		tooltipOpen,
		tooltipLeft = 0,
		tooltipTop = 0,
	} = useTooltip()

	// Style
	const width = bounds.width || defaultWidth
	const height = bounds.height || defaultHeight

	const innerWidth = width - margin * 2
	const innerHeight = height - margin * 2

	const [selectedDay, setSelectedDay] = useState(hourlyEventDays[0])

	let namesArr: Array<string> = []
	const groupedNames = group(eventsHourly, getDate, getName)
	Array.from(groupedNames.get(selectedDay), ([key, value]) =>
		namesArr.push(key)
	)

	const [hourlyNames, setHourlyNames] = useState(namesArr)
	const [selectedName, setSelectedName] = useState(namesArr[0])
	const [localDay, setLocalDay] = useState(selectedDay)

	useEffect(() => {
		setHourlyNames(namesArr)
		setSelectedName(namesArr[0])
		setLocalDay(selectedDay)
	}, [selectedDay])

	const hourScale = scaleBand({
		domain: groupedNames.get(localDay).get(selectedName).map(getHours),
		padding: 0.5,
	})

	const eventScale = scaleLinear<number>({
		domain: [
			0,
			Math.max(...groupedNames.get(localDay).get(selectedName).map(getEvents)) +
				5,
		],
		range: [innerHeight, margin],
	})

	hourScale.rangeRound([margin, innerWidth])
	eventScale.range([innerHeight, margin])

	const handleMouseOver = (event, d) => {
		const coords = localPoint(event)
		showTooltip({
			tooltipData: d,
			tooltipLeft: coords.x,
			tooltipTop: coords.y,
		})
	}

	return (
		<Stack alignItems='center' mt={2}>
			<Typography sx={TitleStyle}>Hourly Events</Typography>
			<svg
				ref={ref}
				width='38%'
				height='38%'
				viewBox={`0 0 ${width} ${height}`}
			>
				<BarComponent
					margin={margin}
					height={height}
					groupCategory={groupedNames}
					date={selectedDay}
					selected={selectedName}
					getHour={getHours}
					getEvents={getEvents}
					xScale={hourScale}
					yScale={eventScale}
					onMouseOver={handleMouseOver}
					onMouseOut={hideTooltip}
					xAxisLabel={'Hour'}
				/>
				{tooltipOpen && (
					<TooltipInPortal
						key={Math.random()}
						style={defaultStyles}
						top={tooltipTop + margin * 1.6}
						left={tooltipLeft + innerWidth - margin * 3.5}
					>
						<b>Total Events: </b> {tooltipData?.events} <br />
						<b>Hour: </b> {tooltipData?.hour}
					</TooltipInPortal>
				)}
			</svg>
			<Stack direction='row' mt={2} spacing={1} alignItems='center'>
				<FormControl>
					<InputLabel id='demo-simple-select-label'>Date</InputLabel>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						value={selectedDay}
						label='Date'
						onChange={(e) => setSelectedDay(e.target.value)}
					>
						{menuItemDate(hourlyEventDays)}
					</Select>
				</FormControl>
				<FormControl>
					<InputLabel id='demo-simple-select-label'>POI</InputLabel>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						value={selectedName}
						label='POI'
						onChange={(e) => setSelectedName(e.target.value)}
					>
						{menuItem(hourlyNames)}
					</Select>
				</FormControl>
				<Button
					variant='outlined'
					sx={ButtonStyle}
					onClick={() => router.push('/events/daily')}
				>
					Daily
				</Button>
				<Button
					variant='outlined'
					sx={ButtonStyle}
					onClick={() => router.push('/')}
				>
					Return Home
				</Button>
			</Stack>
		</Stack>
	)
}

export default Hourly
