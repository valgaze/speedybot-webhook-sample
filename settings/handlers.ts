import { BotHandler, $, SpeedyCard} from 'speedybot'
import Namegamehandler from './namegame'

/**
 * Add a "handler" below to control your bot's responses to a user-- just add to the list
 * 
 * At minimum a handler must have
 * A handler has 3 components:
 * - Keyword: a string, regex, or list of strings or regex's that will match against the user's input (or a **[Special Keyword](#special-keywords)**)
 *
 * - Handler: A function that takes a ```bot``` and ```trigger```
 * 
 * - helpText: A decription of what the handler does (used by the default <@help> handler to tell users what your bot can do)
 * 
 * Special keyword phrases:
 * 1) "<@submit>": will be triggered whenever the user subits data from a form
 * 2) "<@catchall>": will be triggered on every message received
 * 3) "<@help>": override the built-in help handler
 * 4) "<@fileupload>": Handle file-upload event
 * 5) "<@nomatch>": Fires when there is no matching intent
 * 6) "<@spawn>": Gets called whenever a user adds your bot to a new space-- there are some caveats, however, to its behavior, so if you think you'll need this, see here: https://github.com/valgaze/speedybot/blob/master/docs/resources.md
 * 7) "<@despawn>": Opposite of spawn, see here for details: https://github.com/WebexSamples/webex-node-bot-framework/#despawn
 */
const handlers: BotHandler[] = [
	{
		keyword: ['hi', 'hello', 'hey', 'yo', 'watsup', 'hola'],
		handler(bot, trigger) {
			const utterances = [`Heya how's it going $[name]?`,
								`Hi there, $[name]!`,
								`Hiya $[name]`]
			const template = {name: trigger.person.displayName}
			$(bot).sendTemplate(utterances, template)
			$(bot).$trigger('chips', trigger)
		},
		helpText: `A handler that greets the user`
	},
	{
		keyword: ['sendfile'],
		handler(bot, trigger) {
			const $bot = $(bot)
			// Send a publically accessible URL file
			// Supported filetypes: ['doc', 'docx' , 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'jpg', 'jpeg', 'bmp', 'gif', 'png']
			const pdf = 'https://speedybot.valgaze.com'

			$bot.sendDataFromUrl(pdf)

		},
		helpText: `A handler that attaches a file in a direct message`
	},
	{
        keyword: 'sendcard',
        handler(bot, trigger) {
            bot.say('One card on the way...')
            // Adapative Card: https://developer.webex.com/docs/api/guides/cards
            const myCard = new SpeedyCard().setTitle('System is 👍')
                                     .setSubtitle('If you see this card, everything is working')
                                     .setImage('https://raw.githubusercontent.com/valgaze/speedybot/master/docs/assets/chocolate_chip_cookies.png')
                                     .setInput(`What's on your mind?`)
                                     .setUrl('https://www.youtube.com/watch?v=3GwjfUFyY6M', 'Take a moment to celebrate')
                                     .setTable([[`Bot's Date`, new Date().toDateString()], ["Bot's Uptime", `${String(process.uptime())}s`]])
                                     .setData({mySpecialData: {a:1, b:2}})
            bot.sendCard(myCard.render(), 'Your client does not currently support Adaptive Cards')
        },
        helpText: 'Sends an Adaptive Card with an input field to the user'
    },
	{
		keyword: ['ping', 'pong'],
		handler(bot, trigger) {
			const normalized = trigger.text.toLowerCase()
			if (normalized === 'ping') {
				bot.say('pong')
			} else {
				bot.say('ping')
			}
		},
		helpText: `A handler that says ping when the user says pong and vice versa`
	},
	{
		keyword: 'prompt',
		async handler(bot) {

			const $bot = $(bot)
			await bot.say('Sending you a prompt...')
			$bot.prompt('Enter a number whose digits that add up to 6 (ex 51, 60, 33, 501, etc)', {
				retry: [`Sorry, doesn't add up to 6`, 
                        `Whoops that value doesn't work try again`, 
                        `That value doesn't work`, 
                        `Whoops, that input is not valid. You can type '$exit' to abandon this`
                        ],
				async success(bot, trigger, answer) {
					bot.say('You did it!!! Good job! <3 <3')
					bot.say(answer)

					// Ex. Submit data to a 3rd-party service/integration
					const res = await $bot.post('https://jsonplaceholder.typicode.com/posts', { data: { title: 'my special value that adds to 6', userValue: answer } })
					$(bot).sendSnippet(res.data, 'Posted response to https://jsonplaceholder.typicode.com/posts')
				},
				validate(val=0) {
					// Make sure digits add to 6
					const sum = String(val).split('')
											.map(Number)
											.reduce(function (prev, next) {
												return prev + next;
											}, 0)
					if (sum === 6) {
						return true
					} else {
						return false
					}
				}
			})
		},
		helpText: 'A handler which will ask the user for a number whose digits sum to 6'
	},
	{
		keyword: '<@submit>',
		handler(bot, trigger) {
			// Ex. From here data could be transmitted to another service or a 3rd-party integrationn
			bot.say(`Submission received! You sent us ${JSON.stringify(trigger.attachmentAction.inputs)}`)

		},
		helpText: `A special handler that fires anytime a user submits data (you can only trigger this handler by tapping Submit in a card)`
	},
	{
		keyword: 'chips',
		async handler(bot) {
			const $bot = $(bot)

			// (optional) Set chips to disappear after tap
			// $bot.setChipsConfig({disappearOnTap: true})

			// Send chip with custom handler
			const customChip = { 
				label: 'custom chip', 
				handler(bot, trigger) {
					$bot.sendSnippet(trigger, `**The 'custom chip' was tapped**	`)
					$bot.$trigger('chips', trigger) // re-render chips
				}
			}

			// Add optional title
			$bot.sendChips(['hey', customChip, 'ping', { label:`Say the phrase 'pong'`, keyword: 'pong' }], 'Tap an item below')

		},
		helpText: 'Returns a sample list of "chips"'
	},
	{
		keyword: '<@fileupload>',
		async handler(bot, trigger) {
			const supportedFiles = ['json', 'txt', 'csv']

            // take 1st file uploaded, note this is just a URL & not authenticated
            const [file] = trigger.message.files

            // Retrieve file data
			const fileData = await $(bot).getFile(file)
			const { extension, type } = fileData

            if (supportedFiles.includes(extension)) {
                const {data} = fileData
                // bot.snippet will format json or text data into markdown format
                bot.say({markdown: $(bot).snippet(data)})
            } else {
                bot.say(`Sorry, somebody needs to add support to handle *.${extension} (${type}) files`)
            }
		},
		helpText: 'A special handler that will activate whenever a file is uploaded'
	},
	{
		keyword: 'counter',
		async handler(bot) {
			const $bot = $(bot)
			await $bot.increaseCounter('myCounter')
			const counterRef = await $bot.getCounter('myCounter')
			$bot.thread(['Counter was increased', `The current count is ${counterRef}`])

		},
		helpText: 'Will increment a counter (scoped to current user) each time the handler is invoked'
	},
	{
		keyword: '<@nomatch>',
		handler(bot, trigger) {
			const $bot = $(bot)
			const { text } = trigger.message
			$bot.sendRandom([`Sorry, I don't understand that command`, 
							'Whoops, that input does not have an associated handler',
							`Ruh roh, I don't know what to do with ${text}`])
		},
		helpText: 'A special handler which will fire if there is no handler registered for that input'
	},
	Namegamehandler, // You can also include single-file handlers in your list,
]

export default handlers;