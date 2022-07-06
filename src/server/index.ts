import { SpeedybotWebhook, SpeedyGuard } from 'speedybot'
import express from 'express'
import bodyParser from 'body-parser'
import { join } from 'path'
import handlers from './../../settings/handlers'
import config from './../../settings/config.json'
import webhooks from './../../settings/webhooks'
const app = express()
const port = process.env.PORT || 8000

app.use(express.static(join(__dirname, 'ui')));
app.use(bodyParser.json());
app.use(SpeedyGuard(webhooks, config))

app.post('/speedybotwebhook', SpeedybotWebhook(config, handlers, app))

app.listen(port, () => {
    console.log(`Listening + tunneled on port ${port}`)
})
