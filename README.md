# datdot-ui-button
DatDot vanilla js UI component

Opts
---

`{name = 'i-button', text, icons = [], state = default_state, theme = ``}`

Help
---
`button.help()` returns opts & the defaults for button component


Incoming message types
---

- `help` requests info on current state
- `update` updates any of the data sent `{ text, icons = [], sheets }`

Outgoing message types
---

**parent**
- `help` sends info on current state
- `click`