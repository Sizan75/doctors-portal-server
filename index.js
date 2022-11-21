const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app=express()
require('dotenv').config();
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bahxlpw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run (){
try{
const appointmentOptionCollection = client.db('doctorsPortal').collection('appointmentOptions')
const bookingsCollection = client.db('doctorsPortal').collection('bookings')

app.get('/appointmentOptions', async(req,res)=>{
    const date= req.query.date
const query={}
const options= await appointmentOptionCollection.find(query).toArray();
const bookingQuery = { appointmentDate: date }
            const alreadyBooked = await bookingsCollection.find(bookingQuery).toArray();

            // code carefully :D
            options.forEach(option => {
                const optionBooked = alreadyBooked.filter(book => book.treatment === option.name);
                const bookedSlots = optionBooked.map(book => book.slot);
                const remainingSlots = option.slots.filter(slot => !bookedSlots.includes(slot))
                option.slots = remainingSlots;
            }) 

res.send(options)
})

app.get('/bookings', async(req,res)=>{
    const email= req.query.email
    const query= {
        email: email
    }
    const booking= await bookingsCollection.find(query).toArray()
    res.send(booking)
})

app.post('/bookings', async(req,res) => {
    const booking = req.body
    
    const query = {
        appointmentDate: booking.appointmentDate,
        email: booking.email,
        treatment: booking.treatment 
    }

    const alreadyBooked = await bookingsCollection.find(query).toArray();

    if (alreadyBooked.length){
        const message = `You already have a booking on ${booking.appointmentDate}`
        return res.send({acknowledged: false, message})
    }
    const result = await bookingsCollection.insertOne(booking)
    res.send(result);
})
}
finally{

}
}
run().catch(err=>console.log(err))



app.get('/',(req,res)=>{
    res.send('doctors portal server is running')
})

app.listen(port, ()=>{
    console.log(`doctors portal running on port ${port}`)
})