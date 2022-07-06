// These are **incoming** webhooks
import { Hooks } from 'speedybot'
import { Request as ExRequest } from 'express'

export const webhooks:Hooks = {
    '/abc_route1': {
        method: 'POST',
        handler($hookBot, request, response) {
            // request body from incoming webhook
            const { body } = request

            const targetEmail = 'test@test.com'
            $hookBot.dm(targetEmail, 'Got a hit on abc_route1')
            $hookBot.dm(targetEmail, `Here is raw body: ${JSON.stringify(body)}`)

            const targetRoomId = 'aaa-bbb-ccc-ddd' // find a room id here: https://developer.webex.com/docs/api/v1/rooms/list-rooms
            $hookBot.sendRoom(targetRoomId, $hookBot.card({title: 'Good stuff!'}))            
        },
        validate(request: ExRequest) {
            let proceed = false

            // could check headers
            // check for a secret
            // check signatures
            // etc
            // const code = request.get('my_secret_header_code')
            if (1+1 === 2) {
                proceed = true
            }

            return { proceed }
        }
    }
}

export default webhooks