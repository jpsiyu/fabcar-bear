import React from 'react'
import Operation from './operation'
import network from './network'
import { CSSTransition } from 'react-transition-group'

class Entry extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            receServer: false,
            adminExists: false,
            userExists: false,
            in: false,
        }
        this.getBaseInfo()
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ in: true })
        }, 100)
    }


    render() {
        return <div className='entry'>
            {
                !this.state.receServer ? this.renderWait()
                    : !this.state.adminExists ? this.renderAdmin()
                        : !this.state.userExists ? this.renderUser()
                            : <Operation />
            }
        </div>
    }

    renderWait() {
        return null
    }

    renderAdmin() {
        return <CardAnim in={this.state.in}>
            <div className='e-admin card shadow'>
                <p>Genernate <span className='highlight'>Admin</span> cetificate</p>
                <button className='card-btn' onClick={this.genAdmin.bind(this)}>Gen</button>
            </div>
        </CardAnim>
    }

    renderUser() {
        return <CardAnim in={this.state.in}>
            <div className='e-user card shadow'>
                <p>Genernate <span className='highlight'>User</span> cetificate</p>
                <button className='card-btn btn-green' onClick={this.genUser.bind(this)}>Gen</button>
            </div>
        </CardAnim>
    }

    getBaseInfo() {
        const handler = (response) => {
            const data = response.data
            this.setState({
                receServer: true,
                adminExists: data.adminExists,
                userExists: data.userExists
            })
        }
        network.get('/api/base', handler)
    }

    genAdmin() {
        const handler = (response) => {
            const result = response.data.result
            this.setState({ in: false })
            setTimeout(() => {
                this.setState({ adminExists: result, in: true })
            }, 1000);
        }
        network.put('/api/genadmin', {}, handler)
    }

    genUser() {
        const handler = (response) => {
            const result = response.data.result
            this.setState({ in: false })
            setTimeout(() => {
                this.setState({ userExists: result, in: true })
            }, 1000);
        }
        network.put('/api/genuser', {}, handler)
    }
}

class CardAnim extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <CSSTransition
            classNames={{
                enter: 'enter',
                enterActive: 'enter-active',
                exit: 'exit',
                exitActive: 'exit-active',
            }}
            appear={true}
            in={this.props.in}
            unmountOnExit
            timeout={1000}>
            {this.props.children}
        </CSSTransition>
    }
}

export default Entry