import React from 'react'
import ReactDOM from 'react-dom'
import Entry from './entry'
import EventMgr from './lib/event-mgr'

window.eventMgr = new EventMgr()

ReactDOM.render(
    <Entry />,
    document.getElementById('root')
)