const bel = require('bel')
const csjs = require('csjs-inject')
const { format, setMonth, getMonth, getYear, getDaysInMonth } = require('date-fns')
const protocol_maker = require('protocol-maker')
const button = require('datdot-ui-button')

var id = 0
var count = 0
const sheet = new CSSStyleSheet()
const default_opts = {
	name: 'calendar-month',
	pos: 0,
	theme: get_theme()
}
sheet.replaceSync(default_opts.theme)

module.exports = calendar_month

calendar_month.help = () => { return { opts: default_opts } }

function calendar_month(opts, parent_wire) {
	const { 
		name = default_opts.name,
		pos = default_opts.pos,
		theme = ``
	} = opts
	
	const current_state =  { opts: { name, pos, sheets: [default_opts.theme, theme] } }

	// protocol
  const initial_contacts = { 'parent': parent_wire }
  const contacts = protocol_maker('input-number', listen, initial_contacts)

  function listen (msg) {
      const { head, refs, type, data, meta } = msg // receive msg
      const [from] = head
      const name = contacts.by_address[from].name
      console.log('Cal month', { type, from, name, msg, data })
			if (type === 'help') {
				const $from = contacts.by_address[from]
				$from.notify($from.make({ to: $from.address, type: 'help', data: { state: get_current_state() }, refs: { cause: head }}))                         
			}
      if (type === 'update') handle_update(data)
  }

	// make calendar month
	let date 
	if (!pos) date = new Date()
	else date = setMonth(new Date(), pos)
	if (!pos && pos !== 0) pos = getMonth(date)
	let year = getYear(date)
	let month = format(date, 'MMMM')
	
	const el = document.createElement('calendar-month')
	const shadow = el.attachShadow({mode: 'closed'})

	const title = document.createElement('h3')
	title.append(month, ' ', year)
	title.classList.add('title')

	let path = 'https://raw.githubusercontent.com/datdot-ui/icon/main/src/svg/'
	const prev = button({ name: 'prev', icons: [{ name: 'arrow-left', path }] }, contacts.add('prev'))
	prev.onclick = () => handle_onclick(prev)
	const next = button({ name: 'next', icons: [{ name: 'arrow-right', path}] }, contacts.add('next'))
	next.onclick = () => handle_onclick(next)
	
	var header = document.createElement('div')
	header.append(prev, title, next)
	header.classList.add('calendar-header')

	const custom_theme = new CSSStyleSheet()
	custom_theme.replaceSync(theme)
	shadow.adoptedStyleSheets = [sheet, custom_theme]

	shadow.append(header)

	return el
	
	function handle_onclick (target) {
		const name = target.getAttribute('aria-label')
		const $parent = contacts.by_name['parent']
		$parent.notify($parent.make({ to: $parent.address, type: 'click', data: { name }}))
	} 

	function handle_update (data) {
		const { pos } = data
		if (pos || pos === 0) {
			current_state. pos = pos
			update_month(pos)
		}
	}

	function update_month (pos) {
		let date = setMonth(new Date(), pos)
		let year = getYear(date)
		let month = format(date, 'MMMM')

		title.innerHTML = `${month} ${year}`
	}

	// get current state
	function get_current_state () {
		return  {
			opts: current_state.opts,
			contacts
		}
	}
}

function get_theme () {
	return `
	.calendar-header {
			display: grid;
			grid-template-rows: auto;
			grid-template-columns: minmax(25px, 30px) auto minmax(25px, 30px);
			align-items: center;
	}
	.calendar-header  > :nth-last-child(1) {
		justify-content: end;
	}
	.datepicker-header {
			display: grid;
			grid-template-rows: 30px;
			grid-template-columns: auto;
			align-items: center;
			margin-bottom: 12px;
	}
	.datepicker-header > h3 {
			margin: 0;
	}
	.btn {
			background: none;
			border: none;
			border-radius: 50px;
			width: 30px;
			height: 30px;
			padding: 0;
			transition: background-color 0.3s ease-in-out;
			cursor: pointer;
	}
	.btn:active, .btn:hover {
			background-color: #C9C9C9;
	}
	.btn:active div > svg path, .btn:hover div > svg path {
			
	}
	.icon svg path {
			transition: stroke 0.25s ease-in-out;
	}
	.title {
			text-align: center;
	}
	`
}