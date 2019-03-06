const express = require('express')
const path = require('path')
const packJson = require('../package.json')
const Doorman = require('./doorman')
const bodyParser = require('body-parser')

const app = express()
app.use(express.static(path.resolve(__dirname, '../dist')))
app.use(express.static(path.resolve(__dirname, '../client/public')))
app.use(bodyParser.json())

app.get('/api/base', async (req, res) => {
    const adminExists = await app.doorman.userExists('admin')
    const userExists = await app.doorman.userExists('user1')
    const base = { adminExists, userExists }
    res.send(JSON.stringify(base))
})

app.put('/api/genadmin', async (req, res) => {
    const result = await app.doorman.enrollAdmin()
    const data = { result }
    res.send(JSON.stringify(data))
})

app.put('/api/genuser', async (req, res) => {
    const result = await app.doorman.registerUser()
    const data = { result }
    res.send(JSON.stringify(data))
})

app.get('/api/query', async (req, res) => {
    const result = await app.doorman.query()
    const data = { result }
    res.send(JSON.stringify(data))
})

app.put('/api/changeowner', async(req, res) => {
    const result = await app.doorman.changeOwner(req.body.key, req.body.newOwner)
    const data = { result }
    res.send(JSON.stringify(data))
})

app.doorman = new Doorman()
app.listen(packJson.port, console.log(`server listen on port ${packJson.port}`))
