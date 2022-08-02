import { TouchEvent, MouseEvent } from 'react'
import { StatsDaily } from '../../../lib/interfaces'

import { barColor, axisLabelColor, tickLabelColor } from '../../../styles/Style'

import {
	getClicks,
	getDate,
	getImpressions,
	getRevenue,
} from '../../../lib/utils'

// Context
import { useData } from '../../../Context/useDataContext'

import { StatsDailyChart } from '../../../lib/interfaces'

// Visx
import { Group } from '@visx/group'
import { Bar, LinePath } from '@visx/shape'
import { curveMonotoneX } from '@visx/curve'
import { AnimatedAxis } from '@visx/react-spring'

const Chart = (props: StatsDailyChart): JSX.Element => {
	const { statsDaily } = useData()

	const {
		margin,
		height,
		width,
		toggle,
		dateScale,
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
					scale={dateScale}
					hideAxisLine
					label='Date'
					labelProps={{ fontSize: 20, fill: axisLabelColor }}
					hideTicks
					numTicks={2}
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
					left={innerWidth - margin * 2}
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
					data={statsDaily}
					x={(d) => dateScale(getDate(d)) + margin + 55 ?? 0}
					y={(d) =>
						toggle ? clickScale(getClicks(d)) : revenueScale(getRevenue(d)) ?? 0
					}
					stroke='#FDECEF'
					strokeWidth={5}
					curve={curveMonotoneX}
				/>
			</Group>

			<Group>
				{statsDaily.map((d: StatsDaily) => {
					const xValue = getDate(d)
					const barWidth = dateScale.bandwidth()
					const barHeight =
						innerHeight - (impressionScale(getImpressions(d)) ?? 0)

					const barX = dateScale(xValue) + margin + 50
					const barY = innerHeight - barHeight

					return (
						<Bar
							key={`bar-${xValue}`}
							x={barX}
							y={barY}
							width={barWidth}
							height={barHeight}
							fill={barColor}
							opacity={0.7}
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
