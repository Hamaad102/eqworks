// @ts-nocheck
import { useRouter } from 'next/router'

import { useState } from 'react'
import useMeasure from 'react-use-measure'

import Chart from './Chart'

import {
	getClicks,
	getDate,
	getImpressions,
	getRevenue,
} from '../../../lib/utils'

// Context
import { useData } from '../../../Context/useDataContext'

// Style
import {
	margin,
	defaultWidth,
	defaultHeight,
	TitleStyle,
	ButtonStyle,
} from '../../../styles/Style'
import { Button, Stack, Typography } from '@mui/material'

import { Group } from '@visx/group'
import { localPoint } from '@visx/event'
import { Line } from '@visx/shape'
import { scaleBand, scaleLinear } from '@visx/scale'
import { TooltipWithBounds, useTooltip, defaultStyles } from '@visx/tooltip'

const Daily = (): JSX.Element => {
	const router = useRouter()
	const [ref, bounds] = useMeasure()

	const { statsDaily } = useData()

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

	// xScale
	const dateScale = scaleBand({
		domain: statsDaily.map(getDate),
		padding: 0.5,
	})

	// yScale
	const impressionScale = scaleLinear<number>({
		domain: [0, Math.max(...statsDaily.map(getImpressions)) + 100000],
	})

	const clickScale = scaleLinear<number>({
		domain: [0, Math.max(...statsDaily.map(getClicks)) + 500],
	})

	const revenueScale = scaleLinear<number>({
		domain: [0, Math.max(...statsDaily.map(getRevenue)) + 1000],
	})

	dateScale.rangeRound([margin, innerWidth - margin * 5.8])
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
			<Typography sx={TitleStyle}>Total Daily Stats</Typography>
			<svg
				ref={ref}
				width='38%'
				height='38%'
				viewBox={`0 0 ${width} ${height}`}
			>
				<Chart
					margin={margin}
					width={width}
					height={height}
					toggle={toggle}
					dateScale={dateScale}
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
					onClick={() => router.push('/stats/hourly')}
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
			{tooltipData ? (
				<TooltipWithBounds
					key={Math.random()}
					top={tooltipTop}
					left={tooltipLeft + innerWidth / 1.5 - margin}
					style={defaultStyles}
				>
					<b>Date: </b>
					{tooltipData.date}
					<br />
					<b>Impressions: </b>
					{tooltipData.impressions}
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

export default Daily
