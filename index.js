const express = require('express')
const cors = require('cors')
const {readInput,write,readDhT,readMoisture}=require('./rpi');
const app = express()

app.use(cors())
const port = 3000

app.get('/set-status', (req, res) => {
      try {
        console.log('executing');
        console.log(req.query);
        write(req.query.value);
        res.status(200).send('Enabling')  
      } catch (error) {
        console.log(error)
      }  
})

app.get('/disable', (req, res) => {
  try {
    write(0);
    res.status(200).send('Disabling')  
  } catch (error) {
    console.log(error)
  }  
})

app.get('/status', (req, res) => {
  try {
    const status=readInput();
    res.status(200).send({status})  
  } catch (error) {
    console.log(error)
  }  
})
app.get('/soil-status', (req, res) => {
  try {
    const status=readMoisture();
    res.status(200).send({status})  
  } catch (error) {
    console.log(error)
  }  
})


app.get('/dht-status', async (req, res) => {
  try {
    const status=await readDhT();
    console.log("Status: ",status);
    res.status(200).send({...status})  
  } catch (error) {
    console.log(error)
  }  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
