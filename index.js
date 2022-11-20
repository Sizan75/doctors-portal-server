const express = require('express');
const cors = require('cors');

const app=express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express())

app.get('/',(req,res)=>{
    res.send('doctors portal server is running')
})

app.listen(port, ()=>{
    console.log(`doctors portal running on port ${port}`)
})