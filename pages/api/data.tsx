import { NextApiRequest, NextApiResponse } from 'next'
import { tokenBucket } from '../../lib/tokenBucket'

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
	let ip
	if (req.headers['x-forwarded-for']) {
		ip = req.headers['x-forwarded-for'].split(',')[0]
	} else {
		ip = req.connection.remoteAddress
	}
	const { allowed, remaining } = await tokenBucket(ip)
	res.status(200).json({ allowed, remaining })
}
