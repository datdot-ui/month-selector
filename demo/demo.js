const bel = require('bel')
const csjs = require('csjs-inject')
const button = require('..')
const protocol_maker = require('protocol-maker')

var id = 0

function demo () {
//------------------------------------------
    const contacts = protocol_maker('demo', listen)

    function listen (msg) {
        console.log('New message', { msg })
        const { head, refs, type, data, meta } = msg // receive msg
        const [from] = head
        // handle
        if (type === 'click') return handle_click_event(msg)
        if (type === 'help') console.log({data})
    }
//------------------------------------------    
    console.log('Button help', button.help()) // get opts & the defaults for button component
    
    // buttons
    const primary = button({ name: 'primary', text: 'Hello', theme: `` }, contacts.add('primary'))
    const current1 = button({ name: 'button1', text: 'Button1', }, contacts.add('button1'))
    const current2 = button({ name: 'button2', text: 'Button2', }, contacts.add('button2'))
    const disabled = button({ name: 'disable', text: 'Disabled', status: { disabled: true, }, theme: `` }, contacts.add('disable'))

    // Tab element
    const tab1 = button({ name: 'tab1', text: 'Tab1', 
        theme: `
            :host(i-button) {
                --color: var(--color-green);
                --current_color: var(--color-green);
                --icon_fill: var(--color-green);
                --icon_fill_hover: var(--color-green);
                --icon_size: 24px;             
            }
        ` 
    }, contacts.add('tab1'))
    const tab2 = button({ name: 'tab2', text: 'Tab2', theme: `` }, contacts.add('tab2'))
    const tab3 = button({ name: 'tab3', text: 'Tab3', status: { current: true, },theme: `` }, contacts.add('tab3'))

    // Tab & icon
    const tab4 = button({ name: 'notice', text: 'Notice', icons: [{name: 'notice'}], 
        theme: ``}, contacts.add('notice'))
    const tab5 = button({ name: 'warning', text: 'Warning', icons: [{ name: 'warning' }], status: { disabled: true, }, theme: `` }, contacts.add('warning'))
    const tab6 = button({ name: 'search', text: 'Search', icons: [{name: 'search'}], 
        theme: `
            :host(i-button) {
                --color-maya-blue: 205, 96%, 72%;
                display: grid;
                justify: items-center;
                align: items-center;
            }
            :host(i-button) g {
                --icon-fill: var(--color-maya-blue); 
            }
            :host(i-button:hover) g {
                --icon-fill: var(--color-maya-blue); 
            }
            :host(i-button) .text {
                color: var(--color-maya-blue);
            }
        `  
    }, contacts.add('search'))

    // buttons
    const cancel = button({ name: 'cancel', icons: [{name: 'cross'}],
        theme: `
            :host(i-button) {
                --color-flame: 15, 80%, 50%;
                --color-red: 358, 99%, 53%;
            }
            :host(i-button) g {
                --icon-fill: var(--color-red);            
            }
            :host(i-button:hover) {
                --bg-color: var(--color-flame);
            }
        `
    }, contacts.add('cancel'))

    const confirm = button({ name: 'confirm', icons: [{name: 'check'}], 
        theme: `
        :host(i-button) {
            --color-lincoln-green: 97, 100%, 18%;
            --color-green: 136, 82%, 38%;
        }
        :host(i-button) g {
            --icon-fill: var(--color-green);            
        }
        :host(i-button:hover) {
            --bg-color: var(--color-lincoln-green);
        }
    `
    }, contacts.add('confirm'))
    const previous = button({ name: 'previous', text: 'Previous', icons: [{name: 'arrow-left'}], theme: ``}, contacts.add('previous'))
    const next = button({ name: 'next', icons: [{name: 'arrow-right'}], text: 'Next', theme: `` }, contacts.add('next'))
    const filter = button({ name: 'filter', text: 'Filter', icons: [{ name: 'filter' }], status: { current: true }, theme: ``}, contacts.add('filter'))
    const dropdown = button({ name: 'dropdown', text: 'Dropdown', icons: [{name: 'star'}, {name: 'arrow-down'},], theme: `` }, contacts.add('single-selector'))
    const option = button({ name: 'option-star', icons: [{ name: 'star' }, { name: 'check' }], theme: ``}, contacts.add('option-star'))
    const option1 = button({ name: 'datdot app', text: 'DatDot app', icons: [{ name: 'datdot-white' }, { name: 'check' }], theme: `` }, contacts.add('datdot app'))

    // get help about button1 (current state etc.)
    const $button1 = contacts.by_name['button1']
    $button1.notify($button1.make({ to: $button1.address, type: 'help'}))
    
    // content
    const content = bel`
    <div class=${css.content}>
        <a name="top"></a>
        <section>
            <h2>Text buttons</h2>
            <div class=${css.text}>
                ${primary}${disabled}${current1}${current2}
            </div>
        </section>
        <section>
            <h2>Text and icon buttons</h2>
            <div class=${css.icon}>
                ${cancel}${confirm}${previous}${next}${filter}
                ${dropdown}${option}
                ${option1}
            </div>
        </section>
        <section>
            <h2>Tab buttons</h2>
            <nav class=${css.tabs} role="tablist" aria-label="tabs"> ${tab1}${tab2}${tab3} </nav>
        </section>
        <section>
            <h2>Tab & icon buttons</h2>
            <nav class=${css.tabs} role="tablist" aria-label="tabs"> ${tab4}${tab5}${tab6} </nav>
        </section>     
    </div>`
    const container = bel`<div class="${css.container}">${content}</div>`
    const app = bel`<div class="${css.wrap}">${container}</div>`

    return app

    
    // handle events
    function handle_click_event ({head, type, refs, data}) {
        console.log('New click', {head, type, refs, data} )
        const [from, to, msg_id] = head
        const $from = contacts.by_address[from]
        if (contacts.by_address[from].name === 'button1') {
            const new_theme = `
                :host(i-button) {
                    --color-flame: 15, 80%, 50%;
                    --color-red: 358, 99%, 53%;
                }
                :host(i-button) g {
                    --icon-fill: var(--color-red);            
                }
                :host(i-button:hover) {
                    --bg-color: var(--color-flame);
                }
            `
            $from.notify($from.make({ to: $from.address, type: 'update', data: { 
                text: 'Updated', icons: [{ name: 'play' }], sheets: [0, 1, new_theme] // keep current shadow.adoptedStyleSheets[0] on pos 0, shadow.adoptedStyleSheets[1] on pos 1 and add new_theme on shadow.adoptedStyleSheets[2]
             } }))                         
        }
    }

}

const css = csjs`
:root {
    /* define colors ---------------------------------------------*/
    --b: 0, 0%;
    --r: 100%, 50%;
    --color-white: var(--b), 100%;
    --color-black: var(--b), 0%;
    --color-dark: 223, 13%, 20%;
    --color-deep-black: 222, 18%, 11%;
    --color-red: 358, 99%, 53%;
    --color-amaranth-pink: 329, 100%, 65%;
    --color-persian-rose: 323, 100%, 50%;
    --color-orange: 32, var(--r);
    --color-light-orange: 36, 100%, 55%;
    --color-safety-orange: 27, 100%, 50%;
    --color-deep-saffron: 31, 100%, 56%;
    --color-ultra-red: 348, 96%, 71%;
    --color-flame: 15, 80%, 50%;
    --color-verdigris: 180, 54%, 43%;
    --color-viridian-green: 180, 100%, 63%;
    --color-blue: 214, 100%, 49%;
    --color-heavy-blue: 233, var(--r);
    --color-maya-blue: 205, 96%, 72%;
    --color-slate-blue: 248, 56%, 59%;
    --color-blue-jeans: 204, 96%, 61%;
    --color-dodger-blue: 213, 90%, 59%;
    --color-light-green: 97, 86%, 77%;
    --color-lime-green: 127, 100%, 40%;
    --color-slimy-green: 108, 100%, 28%;
    --color-maximum-blue-green: 180, 54%, 51%;
    --color-deep-green: 136, 79%, 22%;
    --color-green: 136, 82%, 38%;
    --color-lincoln-green: 97, 100%, 18%;
    --color-yellow: 44, 100%, 55%;
    --color-chrome-yellow: 39, var(--r);
    --color-bright-yellow-crayola: 35, 100%, 58%;
    --color-green-yellow-crayola: 51, 100%, 83%;
    --color-purple: 283, var(--r);
    --color-heliotrope: 288, 100%, 73%;
    --color-medium-purple: 269, 100%, 70%;
    --color-electric-violet: 276, 98%, 48%;
    --color-grey33: var(--b), 20%;
    --color-grey66: var(--b), 40%;
    --color-grey70: var(--b), 44%;
    --color-grey88: var(--b), 53%;
    --color-greyA2: var(--b), 64%;
    --color-greyC3: var(--b), 76%;
    --color-greyCB: var(--b), 80%;
    --color-greyD8: var(--b), 85%;
    --color-greyD9: var(--b), 85%;
    --color-greyE2: var(--b), 89%;
    --color-greyEB: var(--b), 92%;
    --color-greyED: var(--b), 93%;
    --color-greyEF: var(--b), 94%;
    --color-greyF2: var(--b), 95%;
    --transparent: transparent;
    /* define font ---------------------------------------------*/
    --snippet-font: Segoe UI Mono, Monospace, Cascadia Mono, Courier New, ui-monospace, Liberation Mono, Menlo, Monaco, Consolas;
    --size12: 1.2rem;
    --size13: 1.3rem;
    --size14: 1.4rem;
    --size15: 1.5rem;
    --size16: 1.6rem;
    --size18: 1.8rem;
    --size20: 2rem;
    --size22: 2.2rem;
    --size24: 2.4rem;
    --size26: 2.6rem;
    --size28: 2.8rem;
    --size30: 3rem;
    --size32: 3.2rem;
    --size34: 3.4rem;
    --size36: 3.6rem;
    --size38: 3.8rem;
    --size40: 4rem;
    --size42: 4.2rem;
    --size44: 4.4rem;
    --size46: 4.6rem;
    --size48: 4.8rem;
    --size50: 5rem;
    --size52: 5.2rem;
    --size54: 5.4rem;
    --size56: 5.6rem;
    --size58: 5.8rem;
    --size60: 6rem;
    --weight100: 100;
    --weight300: 300;
    --weight400: 400;
    --weight600: 600;
    --weight800: 800;
    /* define primary ---------------------------------------------*/
    --primary-body-bg-color: var(--color-greyF2);
    --primary-font: Arial, sens-serif;
    --primary-size: var(--size14);
    --primary-size-hover: var(--primary-size);
    --primary-weight: 300;
    --primary-weight-hover: 300;
    --primary-color: var(--color-black);
    --primary-color-hover: var(--color-white);
    --primary-color-focus: var(--color-orange);
    --primary-bg-color: var(--color-white);
    --primary-bg-color-hover: var(--color-black);
    --primary-bg-color-focus: var(--color-greyA2), 0.5;
    --primary-border-width: 1px;
    --primary-border-style: solid;
    --primary-border-color: var(--color-black);
    --primary-border-opacity: 1;
    --primary-radius: 8px;
    --primary-avatar-width: 100%;
    --primary-avatar-height: auto;
    --primary-avatar-radius: 0;
    --primary-disabled-size: var(--primary-size);
    --primary-disabled-color: var(--color-greyA2);
    --primary-disabled-bg-color: var(--color-greyEB);
    --primary-disabled-icon-size: var(--primary-icon-size);
    --primary-disabled-icon-fill: var(--color-greyA2);
    --primary-listbox-option-icon-size: 20px;
    --primary-listbox-option-avatar-width: 40px;
    --primary-listbox-option-avatar-height: auto;
    --primary-listbox-option-avatar-radius: var(--primary-avatar-radius);
    --primary-option-avatar-width: 30px;
    --primary-option-avatar-height: auto;
    --primary-list-avatar-width: 30px;
    --primary-list-avatar-height: auto;
    --primary-list-avatar-radius: var(--primary-avatar-radius);
    /* define icon settings ---------------------------------------------*/
    --primary-icon-size: var(--size16);
    --primary-icon-size-hover: var(--size16);
    --primary-icon-fill: var(--primary-color);
    --primary-icon-fill-hover: var(--primary-color-hover);
    /* define current ---------------------------------------------*/
    --current-size: var(--primary-size);
    --current-weight: var(--primary-weight);
    --current-color: var(--color-white);
    --current-bg-color: var(--color-black);
    --current-icon-size: var(--primary-icon-size);
    --current-icon-fill: var(--color-white);
    --current-list-selected-icon-size: var(--list-selected-icon-size);
    --current-list-selected-icon-fill: var(--color-white);
    --current-list-selected-icon-fill-hover: var(--color-white);
    --current-list-size: var(--current-size);
    --current-list-color: var(--current-color);
    --current-list-bg-color: var(--current-bg-color);
    --current-list-avatar-width: var(--primary-list-avatar-width);
    --current-list-avatar-height: var(--primary-list-avatar-height);
    /* role listbox settings ---------------------------------------------*/
    /*-- collapsed --*/
    --listbox-collapsed-bg-color: var(--primary-bg-color);
    --listbox-collapsed-bg-color-hover: var(--primary-bg-color-hover);
    --listbox-collapsed-icon-size: var(--size14);
    --listbox-collapsed-icon-size-hover: var(--size14);
    --listbox-collapsed-icon-fill: var(--primary-icon-fill);
    --listbox-collapsed-icon-fill-hover: var(--primary-icon-fill-hover);
    --listbox-collapsed-listbox-size: var(--primary-size);
    --listbox-collapsed-listbox-size-hover: var(--primary-size-hover);
    --listbox-collapsed-listbox-weight: var(--primary-weight);
    --listbox-collapsed-listbox-weight-hover: var(--primary-weight);
    --listbox-collapsed-listbox-color: var(--primary-color);
    --listbox-collapsed-listbox-color-hover: var(--primary-color-hover);
    --listbox-collapsed-listbox-avatar-width: var(--primary-listbox-option-avatar-width);
    --listbox-collapsed-listbox-avatar-height: var(--primary-listbox-option-avatar-height);
    --listbox-collapsed-listbox-icon-size: var(--primary-listbox-option-icon-size);
    --listbox-collapsed-listbox-icon-size-hover: var(--primary-listbox-option-icon-size);
    --listbox-collapsed-listbox-icon-fill: var(--color-blue);
    --listbox-collapsed-listbox-icon-fill-hover: var(--color-yellow);
    /*-- expanded ---*/
    --listbox-expanded-bg-color: var(--current-bg-color);
    --listbox-expanded-icon-size: var(--size14);
    --listbox-expanded-icon-fill: var(--color-light-green);
    --listbox-expanded-listbox-size: var(--size20);
    --listbox-expanded-listbox-weight: var(--primary-weight);
    --listbox-expanded-listbox-color: var(--current-color);
    --listbox-expanded-listbox-avatar-width: var(--primary-listbox-option-avatar-width);
    --listbox-expanded-listbox-avatar-height: var(--primary-listbox-option-avatar-height);
    --listbox-expanded-listbox-icon-size: var(--primary-listbox-option-icon-size);
    --listbox-expanded-listbox-icon-fill: var(--color-light-green);
    /* role option settings ---------------------------------------------*/
    --list-bg-color: var(--primary-bg-color);
    --list-bg-color-hover: var(--primary-bg-color-hover);
    --list-selected-icon-size: var(--size16);
    --list-selected-icon-size-hover: var(--list-selected-icon-size);
    --list-selected-icon-fill: var(--primary-icon-fill);
    --list-selected-icon-fill-hover: var(--primary-icon-fill-hover);
    --menu-size: var(--size15);
    --menu-size-hover: var(--menu-size);
    --menu-weight: var(--primary-weight);
    --menu-weigh-hover: var(--primary-weight);
    --menu-color: var(--primary-color);
    --menu-color-hover: var(--color-grey88);
    --menu-icon-size: 20px;
    --menu-icon-size-hover: var(--menu-icon-size);
    --menu-icon-fill: var(--primary-color);
    --menu-icon-fill-hover: var(--color-grey88);
    --menu-avatar-width: 50px;
    --menu-avatar-width-hover: var(--menu-avatar-width);
    --menu-avatar-height: auto;
    --menu-avatar-height-hover: var(--menu-avatar-height);
    --menu-avatar-radius: 0;
    --menu-disabled-color: var(--primary-disabled-color);
    --menu-disabled-size: var(--menu-size);
    --menu-disabled-weight: var(--primary-weight);
}
html {
    font-size: 62.5%;
    height: 100%;
}
*, *:before, *:after {
    box-sizing: border-box;
    position: relative;
}
body {
    -webkit-text-size-adjust: 100%;
    margin: 0;
    padding: 0;
    font-size: calc(var(--primary-size) + 2px);
    font-family: var(--primary-font);
    color: var(--primary-color);
    background-color: hsl( var(--primary-body-bg-color) );
    height: 100%;
    overflow: hidden;
}
img {
    width: 100%;
    height: auto;
}
.wrap {
    display: grid;
    height: 100%;
}
.container {
    overflow: hidden scroll;
    height: 100%;
}
.content {
    padding: 2% 5%;
}
.text, .icon {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 8px;
    margin-bottom: 20px;
}
.tabs {
    display: grid;
    grid-auto-flow: column;
}
.tabs span {
    width: 40px;
}
#frame {
    width: 100%;
    height: 480px;
}
.thumb i-button:first-child {
   margin-bottom: 20px;
}
nav {
    display: grid;
    gap:15px;
}
`

document.body.append(demo())