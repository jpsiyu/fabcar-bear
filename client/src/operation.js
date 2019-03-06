import React from 'react'
import { MacroEvent } from './macro'
import network from './network'

class Operation extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <div className='op'>
            <OperationQuery />
        </div>
    }
}

class OperationQuery extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            active: false,
            data: [],
        }
    }

    componentDidMount() {
        window.eventMgr.subscribe(MacroEvent.UpdateData, this, this.onRun.bind(this))
    }

    componentWillUnmount() {
        window.eventMgr.unsubscribe(MacroEvent.UpdateData, this)
    }

    render() {
        const items = []
        items.push(<DataItemTitle key={-1} />)
        this.state.data.forEach((d, idx) => {
            items.push(<DataItem key={idx} data={d} />)
        })

        return <div className='query'>
            <div className='face'>
                <p>Query</p>
                <button onClick={this.onRun.bind(this)}>Run</button>
            </div>
            {
                this.state.active
                    ? <div className='result'>
                        {items}
                    </div>
                    : null
            }
        </div>
    }

    onRun() {
        this.setState({ data: [] })
        const handler = (response) => {
            const data = response.data.result
            const dataParse = JSON.parse(data)
            this.setState({
                active: true,
                data: dataParse,
            })

        }
        network.get('/api/query', handler)
    }
}

class DataItemTitle extends React.Component {
    render() {
        return <div className='dataitem datatitle'>
            <p>KEY</p>
            <p>COLOR</p>
            <p>DOCTYPE</p>
            <p>MAKE</p>
            <p>MODEL</p>
            <p>OWNER</p>
        </div>
    }
}

class DataItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showModify: false
        }
    }

    render() {
        const data = this.props.data
        return <div className='dataitem-root'>
            <div className='dataitem' onClick={this.onClick.bind(this)}>
                <p>{data.Key}</p>
                <p>{data.Record.color}</p>
                <p>{data.Record.docType}</p>
                <p>{data.Record.make}</p>
                <p>{data.Record.model}</p>
                <p>{data.Record.owner}</p>
            </div>
            {this.state.showModify ? <ModifyPanel data={data} /> : null}
        </div>
    }

    onClick() {
        this.setState({
            showModify: !this.state.showModify
        })
    }
}

class ModifyPanel extends React.Component {
    constructor(props) {
        super(props)
        this.refKey = React.createRef()
        this.refCol = React.createRef()
        this.refDoc = React.createRef()
        this.refMake = React.createRef()
        this.refModel = React.createRef()
        this.refOwner = React.createRef()
    }

    componentDidMount() {
        this.refOwner.current.focus()
    }

    render() {
        const data = this.props.data
        return <div className='modify-root'>
            <div className='modify-title'>
                <p>Modify Car Owner</p>
            </div>
            <div className='modify'>
                {this.renderInput(this.refKey, data.Key)}
                {this.renderInput(this.refCol, data.Record.color)}
                {this.renderInput(this.refDoc, data.Record.docType)}
                {this.renderInput(this.refMake, data.Record.make)}
                {this.renderInput(this.refModel, data.Record.model)}
                {this.renderInput(this.refOwner, data.Record.owner, false)}
            </div>
            <div className='modify-btn'>
                <button onClick={this.onClick.bind(this)}>Submit</button>
            </div>
        </div>
    }

    renderInput(ref, value, disabled = true) {
        const c = disabled ? '' : 'can-modify'
        return <div>
            <input
                type='text'
                className={`modify-input ${c}`}
                ref={ref}
                placeholder={value}
                disabled={disabled} />
        </div>
    }

    onClick() {
        const key = this.props.data.Key
        const newOwner = this.refOwner.current.value
        if (!newOwner) return
        const handler = (response) => {
            const result = response.data.result
            if (result)
                window.eventMgr.dispatch(MacroEvent.UpdateData)
        }

        network.put('/api/changeowner', { key, newOwner }, handler)
    }
}

export default Operation