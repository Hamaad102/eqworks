# EQ Works Application Development Track

**Tech Stack:** Next.js, Typescript, Material.ui, D3, Visx, Redis, Leaflet

**Contributors**: [Hamaad Chughtai](https://github.com/Hamaad102)

**Live Demo**: https://glittery-chebakia-9a6c63.netlify.app/

**Backend Code**: https://glitch.com/edit/#!/luminous-lucky-pear

---

### Explanation for Rate Limiting Challenge

I chose to tackle this challenge using the Token Bucket algorithm as I felt it was the most appropriate choice given the available options. The Fixed Window algorithm, while simpler, has a critical oversight. Users can take advantage of the fixed position regarding time which would allow them to create a burst of traffic that could overwhelm the servers. A slightly better approach would be the Sliding Window algorithm which does away with the fixed position in time. If 100 requests can be made within an hour then the algorithm will look at the number of requests in the past hour starting from when you make the request to determine whether to throw an error or not. This is a solid option and a great alternative to the Token Bucket if I were to pick another option. I chose the Token Bucket as I felt it met the needs of the challenge; it's resource efficient and the rate at which users are able to make requests is consistent. I wanted to take into consideration the fact that the company, EQ Works, handles a large amount of data, however, it's not a file sharing company. 10 back to back requests for a small json file isn’t going to hamper our servers in the same way multiple 10GB file transfer requests might for Google Drive for example. Time based constraints make more sense when we're trying to limit the transfer of large amounts of data within a short period of time. I think a Sliding Window implementation only serves to inconvenience customers who might be trying to access insights and detailed statistics regarding their product. At the same time we don't want to be overwhelmed with the number of requests to our servers and I think a Token Bucket implementation serves us best given that scenario. We are able to control the output of data giving us breathing room and also this doesn't hamper the experience for the customer.

For this I used Redis for the backend which is hosted on Upstash. The information isn’t necessary to store long term so an in-memory solution like Redis is ideal. It’s also important to note that our backend is serverless so having Redis there would not be possible as every call to the server would fire up a fresh instance of the Redis database making it pointless. On top of that the main advantage of going serverless is the fact that you are only charged for what you use. If you’re starting up the server every time to see if you should be able to use it you most likely will be racking up the bill quite fast making it again pointless.

My implementation is based on the examples provided by [Stripe](https://gist.github.com/ptarjan/e38f45f2dfe601419ca3af937fff574d) who use Lua for the logic of the Token Bucket. The reason Lua is used to write the logic for the token bucket is because Redis is single threaded. It will go through the logic and execute it sequentially. If we were to do it ourselves in Javascript it’s possible that in the process of going through the logic more requests could come in and be run simultaneously which would create race conditions. Doing it the way Stripe lays out allows us to avoid that headache entirely and allow requests to be made in the order they come in.
