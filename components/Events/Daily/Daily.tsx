// @ts-nocheck
import { useRouter } from 'next/router'

import { group } from 'd3-array'
import { useState } from 'react'
import useMeasure from 'react-use-measure'
import { getEvents, getName, getDate } from '../../../lib/utils'

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

const Daily = (): JSX.Element => {
	const router = useRouter()
	const [ref, bounds] = useMeasure()
	const { containerRef, TooltipInPortal } = useTooltipInPortal({
		detectBounds: true,
		scroll: true,
	})

	const { eventsDaily } = useData()
	const { dailyEventNames, dailyEventDays } = useValue()

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

	const [toggle, setToggle] = useState(true)
	const [selectedDay, setSelectedDay] = useState(dailyEventDays[0])
	const [selectedName, setSelectedName] = useState(dailyEventNames[0])

	// Group by date
	const groupedNames = group(eventsDaily, getName)
	const groupedDays = group(eventsDaily, getDate)

	// xScale
	const dateScale = scaleBand({
		domain: groupedNames.get(selectedName)?.map(getDate),
		padding: 0.5,
	})

	const nameScale = scaleBand({
		domain: groupedDays.get(selectedDay)?.map(getName),
		padding: 0.5,
	})

	// yScale
	const eventScale = scaleLinear<number>({
		domain: [
			0,
			toggle
				? Math.max(...groupedNames.get(selectedName)?.map(getEvents)) + 5
				: Math.max(...groupedDays.get(selectedDay)?.map(getEvents)) + 5,
		],
		range: [innerHeight, margin],
	})

	dateScale.rangeRound([margin, innerWidth])
	nameScale.rangeRound([margin, innerWidth])
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
			<Typography sx={TitleStyle}>Daily Events</Typography>
			<svg
				ref={ref}
				width='38%'
				height='38%'
				viewBox={`0 0 ${width} ${height}`}
			>
				<BarComponent
					margin={margin}
					height={height}
					groupCategory={toggle ? groupedNames : groupedDays}
					selected={toggle ? selectedName : selectedDay}
					getDate={getDate}
					getName={getName}
					toggle={toggle}
					getEvents={getEvents}
					xScale={toggle ? dateScale : nameScale}
					yScale={eventScale}
					onMouseOver={handleMouseOver}
					onMouseOut={hideTooltip}
					xAxisLabel={toggle ? 'Date' : 'POI'}
				/>
				{tooltipOpen && (
					<TooltipInPortal
						key={Math.random()}
						style={defaultStyles}
						top={tooltipTop + margin * 1.6}
						left={tooltipLeft + innerWidth - margin * 3.5}
					>
						<b>Total Events: </b> {tooltipData?.events} <br />
						<b>Date: </b> {tooltipData?.date}
					</TooltipInPortal>
				)}
			</svg>
			<Stack direction='row' mt={5} spacing={1} alignItems='center'>
				<FormControl>
					<InputLabel id='demo-simple-select-label'>
						{toggle ? 'POI' : 'Date'}
					</InputLabel>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						value={toggle ? selectedName : selectedDay}
						label={toggle ? 'POI' : 'Date'}
						onChange={(e) =>
							toggle
								? setSelectedName(e.target.value)
								: setSelectedDay(e.target.value)
						}
					>
						{toggle ? menuItem(dailyEventNames) : menuItemDate(dailyEventDays)}
					</Select>
				</FormControl>
				<Button
					variant='outlined'
					sx={ButtonStyle}
					onClick={() => {
						setToggle(!toggle)
						setSelectedDay(dailyEventDays[0])
						setSelectedName(dailyEventNames[0])
					}}
				>
					Toggle
				</Button>
				<Button
					variant='outlined'
					sx={ButtonStyle}
					onClick={() => router.push('/events/hourly')}
				>
					Hourly
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

export default Daily
