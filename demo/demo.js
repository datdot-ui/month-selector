const csjs = require('csjs-inject')
const bel = require('bel')
const protocol_maker = require('protocol-maker')

const { isBefore, getYear, getMonth, getDaysInMonth } = require('date-fns')
const calendar_month = require('..')

var id = 0

function demo () {
// ------------------------------------
    const contacts = protocol_maker('demo', listen)

    function listen (msg) {
        console.log('DEMO', { msg })
        const { head, refs, type, data, meta } = msg // receive msg
        const [from] = head
        // send back ack
        const name = contacts.by_address[from].name
        if (type === 'click') {
            const { name: target } =  data
            const $month1 = contacts.by_name['cal-month-0']
            const $month2 = contacts.by_name['cal-month-1']
            if (name === 'cal-month-0') {
                if (target === 'prev') new_pos = current_state.cal_month_1.pos - 1
                else if (target === 'next') new_pos = current_state.cal_month_1.pos + 1
                current_state.cal_month_1.pos = new_pos
                $month1.notify($month1.make({ to: $month1.address, type: 'update', data : { pos: new_pos } }))
            } else if (name === 'cal-month-1') {
                if (target === 'prev') new_pos = current_state.cal_month_2.pos - 1
                else if (target === 'next') new_pos = current_state.cal_month_2.pos + 1
                current_state.cal_month_2.pos = new_pos
                $month2.notify($month2.make({ to: $month2.address, type: 'update', data : { pos: new_pos } }))
            }
        }
    }
// ------------------------------------
    let current_state = {
        cal_month_1: { pos: 2 },
        cal_month_2: { pos: 7 },
    }
    let counter = 0
    const cal_month1 = calendar_month({ pos: current_state.cal_month_1.pos }, contacts.add(`cal-month-${counter++}`))
    const cal_month2 = calendar_month({ pos: current_state.cal_month_2.pos }, contacts.add(`cal-month-${counter++}`))

    const el = bel`
    <div class=${css.wrap}>
      <section class=${css["ui-widgets"]}>
        <div class=${css['ui-calendar-header']}>
          <h2 class=${css.title}>Calendar Header</h2>
          <div class=${css["custom-header"]}>${cal_month1}</div>
          <div class=${css["calendar-header-fullsize"]}>${cal_month2}</div>
        </div>
      </section>
    </div>`

  return el
    
}


const css = csjs`
body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    background-color: #F2F2F2;
    height: 100%;
}
button:active, button:focus {
    outline: dotted 1px #c9c9c9;
}
.wrap {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 75vh 25vh;
    min-width: 520px
}
.ui-widgets {
    padding: 20px;
    overflow-y: auto;
}
.ui-widgets > div {
    margin-bottom: 30px;
    padding: 10px 20px 20px 20px;
    background-color: #fff;
}
.title {
    color: #008dff;
}
.ui-calendar-header {
}
.custom-header {
    background-color: #f2f2f2;
    max-width: 25%;
    min-width: 225px;
    border-radius: 50px;
}
.custom-header > [class^="calendar-header"] {
    grid-template-rows: 30px;
}
.custom-header > [class^="calendar-header"] h3 {
    font-size: 16px;
}
.calendar-header-fullsize {
}
`

document.body.append(demo())