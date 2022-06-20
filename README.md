# datdot-ui-calendar-month
DatDot vanilla js UI component

Opts
---

`{name = 'calendar-month', pos, theme = ``}`

Help
---
`calendar_month.help()` returns opts & the defaults for calendar-month component


Incoming message types
---

- `help` requests info on current state
- `update` updates any of the data sent `{pos, sheets }`

Outgoing message types
---

**parent**
- `help` sends info on current state
- `click` notifies when next or prev is clicked