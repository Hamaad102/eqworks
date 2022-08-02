// @ts-nocheck
import { group } from 'd3-array'
import { useRouter } from 'next/router'

import { useState } from 'react'
import useMeasure from 'react-use-measure'

import Chart from './Chart'

import {
	getClicks,
	getDate,
	getHours,
	getImpressions,
	getRevenue,
} from '../../../lib/utils'

// Context
import { useData } from '../../../Context/useDataContext'

// Style
import {
	Button,
	FormControl,
	InputLabel,
	Select,
	Stack,
	Typography,
} from '@mui/material'
import {
	margin,
	defaultWidth,
	defaultHeight,
	TitleStyle,
	ButtonStyle,
} from '../../../styles/Style'

import { menuItemDate } from '../../../lib/components'

import { Line } from '@visx/shape'
import { Group } from '@visx/group'
import { localPoint } from '@visx/event'
import { scaleBand, scaleLinear } from '@visx/scale'
import { TooltipWithBounds, useTooltip, defaultStyles } from '@visx/tooltip'

const Hourly = (): JSX.Element => {
	const router = useRouter()
	const [ref, bounds] = useMeasure()

	const { statsHourly } = useData()

	const {
		showTooltip,
		hideTooltip,
		tooltipData,
		tooltipLeft = 0,
		tooltipTop = 0,
	} = useTooltip()

	// Style
	const width = bounds.width || defaultWidth
	const height = bounds.height || defaultHeight

	const innerWidth = width - margin * 2
	const innerHeight = height - margin * 2

	const [toggle, setToggle] = useState(true)

	// Days
	const daysArr: Array<string> = []
	const groupedDays = group(statsHourly, getDate)
	Array.from(groupedDays, ([key, value]) => daysArr.push(key))

	const [selectedDay, setSelectedDay] = useState(daysArr[0])

	// xScale
	const hourScale = scaleBand({
		domain: groupedDays.get(selectedDay)?.map(getHours),
		padding: 0.5,
	})

	// yScale
	const impressionScale = scaleLinear<number>({
		domain: [0, Math.max(...groupedDays.get(selectedDay)?.map(getImpressions))],
	})

	const clickScale = scaleLinear<number>({
		domain: [0, Math.max(...groupedDays.get(selectedDay)?.map(getClicks))],
	})

	const revenueScale = scaleLinear<number>({
		domain: [0, Math.max(...groupedDays.get(selectedDay)?.map(getRevenue))],
	})

	hourScale.rangeRound([margin, innerWidth - margin * 4])
	impressionScale.range([innerHeight, margin])
	clickScale.range([innerHeight, margin])
	revenueScale.range([innerHeight, margin])

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
			<Typography sx={TitleStyle}>Hourly Stats</Typography>
			<svg
				ref={ref}
				width='38%'
				height='38%'
				viewBox={`0 0 ${width} ${height}`}
			>
				<Chart
					margin={margin}
					height={height}
					width={width}
					toggle={toggle}
					groupedDays={groupedDays}
					selectedDay={selectedDay}
					hourScale={hourScale}
					impressionScale={impressionScale}
					clickScale={clickScale}
					revenueScale={revenueScale}
					onMouseOver={handleMouseOver}
					onMouseOut={hideTooltip}
				/>
				{tooltipData ? (
					<Group>
						<Line
							from={{ x: tooltipLeft, y: 0 }}
							to={{ x: tooltipLeft, y: height }}
							stroke='#59588D'
							strokeWidth={1}
							pointerEvents='none'
							strokeDasharray='5, 5'
						/>
					</Group>
				) : null}
			</svg>
			<Stack direction='row' spacing={1} alignItems='center' mt={5}>
				<FormControl>
					<InputLabel id='demo-simple-select-label'>
						{toggle ? 'POI' : 'Date'}
					</InputLabel>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						value={selectedDay}
						label='Date'
						onChange={(e) => setSelectedDay(e.target.value)}
					>
						{menuItemDate(daysArr)}
					</Select>
				</FormControl>
				<Button
					variant='outlined'
					style={ButtonStyle}
					onClick={() => setToggle(!toggle)}
				>
					{toggle ? 'Revenue' : 'Clicks'}
				</Button>
				<Button
					variant='outlined'
					style={ButtonStyle}
					onClick={() => router.push('/stats/daily')}
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
			{tooltipData ? (
				<TooltipWithBounds
					key={Math.random()}
					top={tooltipTop}
					left={tooltipLeft + innerWidth / 1.5 - margin}
					style={defaultStyles}
				>
					<b>Hour: </b>
					{tooltipData.hour}
					<br />
					<b>Impressions: </b>
					{tooltipData.impressions}
					<br />
					<b>Location: </b>
					{tooltipData.name}
					<br />
					{toggle ? (
						<>
							<b>Clicks: </b>
							{tooltipData.clicks}
						</>
					) : (
						<>
							<b>Revenue: </b>
							{tooltipData.revenue}
						</>
					)}
				</TooltipWithBounds>
			) : null}
		</Stack>
	)
}

export default Hourly
