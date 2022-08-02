// @ts-nocheck
import { TouchEvent, MouseEvent } from 'react'

import { barColor, axisLabelColor, tickLabelColor } from '../../../styles/Style'

import {
	getClicks,
	getHours,
	getImpressions,
	getRevenue,
} from '../../../lib/utils'

import { StatsHourlyChart, StatsHourly } from '../../../lib/interfaces'

// Visx
import { Group } from '@visx/group'
import { Bar, LinePath } from '@visx/shape'
import { curveMonotoneX } from '@visx/curve'
import { AnimatedAxis } from '@visx/react-spring'

const Chart = (props: StatsHourlyChart): JSX.Element => {
	const {
		margin,
		width,
		height,
		toggle,
		groupedDays,
		selectedDay,
		hourScale,
		impressionScale,
		clickScale,
		revenueScale,
		onMouseOver,
		onMouseOut,
	} = props

	const innerWidth = width - margin * 2
	const innerHeight = height - margin * 2

	return (
		<>
			<Group>
				<AnimatedAxis
					orientation='bottom'
					top={innerHeight}
					left={margin + 50}
					scale={hourScale}
					hideAxisLine
					label='Hour'
					labelProps={{ fontSize: 20, fill: axisLabelColor }}
					hideTicks
					numTicks={24}
					tickLabelProps={() => ({
						fill: tickLabelColor,
						fontSize: 14,
						textAnchor: 'middle',
					})}
				/>
			</Group>
			<Group>
				<AnimatedAxis
					orientation='left'
					scale={impressionScale}
					labelOffset={50}
					left={margin + 45}
					hideAxisLine
					hideTicks
					label='Impressions'
					labelProps={{ fontSize: 20, fill: axisLabelColor }}
					tickStroke='#612efb'
					tickLabelProps={() => ({
						fill: tickLabelColor,
						fontSize: 14,
						textAnchor: 'middle',
					})}
				/>
			</Group>
			<Group>
				<AnimatedAxis
					orientation='right'
					scale={toggle ? clickScale : revenueScale}
					labelOffset={50}
					left={innerWidth - margin}
					hideAxisLine
					hideTicks
					label={toggle ? 'Clicks' : 'Revenue'}
					labelProps={{ fontSize: 20, fill: axisLabelColor }}
					tickStroke='#612efb'
					tickLabelProps={() => ({
						fill: tickLabelColor,
						fontSize: 14,
						textAnchor: 'middle',
					})}
				/>
			</Group>
			<Group>
				<LinePath
					data={groupedDays.get(selectedDay)}
					x={(d) => hourScale(getHours(d)) + margin + 55 ?? 0}
					y={(d) =>
						toggle ? clickScale(getClicks(d)) : revenueScale(getRevenue(d)) ?? 0
					}
					stroke='#FDECEF'
					strokeWidth={5}
					curve={curveMonotoneX}
				/>
			</Group>
			<Group>
				{groupedDays.get(selectedDay)?.map((d: StatsHourly) => {
					const xValue = getHours(d)
					const barWidth = hourScale.bandwidth()
					const barHeight =
						innerHeight - (impressionScale(getImpressions(d)) ?? 0)

					const barX = hourScale(xValue) + margin + 50
					const barY = innerHeight - barHeight

					return (
						<Bar
							key={`bar-${xValue}`}
							x={barX}
							y={barY}
							width={barWidth}
							height={barHeight}
							opacity={0.7}
							fill={barColor}
							onMouseMove={(
								event: TouchEvent<SVGRectElement> | MouseEvent<SVGRectElement>
							) => {
								onMouseOver(event, d)
							}}
							onMouseLeave={onMouseOut}
						/>
					)
				})}
			</Group>
		</>
	)
}

export default Chart
