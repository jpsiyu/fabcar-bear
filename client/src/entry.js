import React from 'react'
import axios from 'axios'
import Operation from './operation'
import network from './network'

class Entry extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            receServer: false,
            adminExists: false,
            user1Exists: false,
        }
        this.getBaseInfo()
    }

    render() {
        return <div className='entry'>
            {
                !this.state.receServer ? this.renderWait()
                    : !this.state.adminExists ? this.renderAdmin()
                        : !this.state.user1Exists ? this.renderUser1()
                            : <Operation />
            }
        </div>
    }

    renderWait() {
        return null
    }

    renderAdmin() {
        return <div className='e-admin card shadow'>
            <p>Genernate <span className='highlight'>Admin</span> cetificate</p>
            <button className='card-btn' onClick={this.genAdmin.bind(this)}>Gen</button>
        </div>
    }

    renderUser1() {
        return <div className='e-user card shadow'>
            <p>Genernate <span className='highlight'>User1</span> cetificate</p>
            <button className='card-btn btn-green' onClick={this.genUser.bind(this)}>Gen</button>
        </div>
    }

    getBaseInfo() {
        const handler = (response) => {
            const data = response.data
            this.setState({
                receServer: true,
                adminExists: data.adminExists,
                user1Exists: data.user1Exists
            })
        }
        network.get('/api/base', handler)
    }

    genAdmin() {
        const handler = (response) => {
            const result = response.data.result
            this.setState({ adminExists: result })
        }
        network.put('/api/genadmin', {}, handler)
    }

    genUser() {
        const handler = (response) => {
            const result = response.data.result
            this.setState({ user1Exists: result })
        }
        network.put('/api/genuser', {}, handler)
    }
}

export default Entry