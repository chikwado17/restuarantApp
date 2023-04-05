const express = require('express');
require('dotenv').config();
var cors = require('cors');
const admin = require('firebase-admin');

const stripe = require('stripe')(process.env.STRIPE_KEY);

const app = express();

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.PROJECT_DATABASE_URL,
});

 


app.use(cors());
app.use(express.static("public"));
app.use(express.json());



app.post("/create-checkout-session", async(req, res) => {

    //customer create
    const customer = await stripe.customers.create({
        metadata: {
            userId: req.body.data.user,
            userCart: JSON.stringify(req.body.data.userCart),
            total: req.body.data.totalPrice
        }
    })
   
    const line_items = req.body.data.userCart.map(item => {
        return {
            price_data: {
                currency: "NGN",
                product_data: {
                    name:item.title,
                    images: [item.imageURL],
                    metadata: {
                        id:item.id
                    }
                },
                unit_amount: item.TotalProductPrice * 100
            },
            quantity: item.qty,
        };
    });



    const session = await stripe.checkout.sessions.create({

        payment_method_types: ["card"],
        shipping_address_collection: { allowed_countries: ["NG"] },
        shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: { amount: 5000, currency: 'NGN' },
                    display_name: 'Next day',
                    delivery_estimate: {
                        minimum: { unit:"hour", value: 4 },
                        maximum: { unit: "business_day", value: 2 },
                    },
                },
            },
        ],

        phone_number_collection: {
            enabled: true
        },  

        line_items: line_items,
        customer:customer.id,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/checkout-success`,
        cancel_url:  `${process.env.CLIENT_URL}/`,
      });


    res.send({url: session.url});
});





let endpointSecret;

//endpointSecret = "whsec_3ea0e5a7dbe8ea5b04c1a6c68f5fa74ba0c427ca2d9b78fe08cbaafd9f1f6965";

app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];


    let eventType;
    let data;


    if(endpointSecret) {   
        let event;
    
        try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
        }
        data = event.data.object;
        eventType = event.type;
    }else {

        data = req.body.data.object;
        eventType = req.body.type;
    }


    if(eventType === "checkout.session.completed") {
        stripe.customers.retrieve(data.customer).then(customer => {
            console.log('Customer details', customer);
            console.log("Data", data);
            createOrder(customer, data, res);
        });
    }
    res.send().end();
  });


  //saving to our firestore database
  const createOrder = async (customer, data, res) => {
    try {

       

        const orderId = Date.now();

        const Order = {
            intentId: data.id,
            amount: data.amount_total,
            created:data.created,
            payment_method_types: data.payment_method_types,
            currency:data.currency,
            userId: customer.metadata.userId,
            email: customer.email,
            total: customer.metadata.total,
            shipping_details:data.shipping_details,
            items: JSON.parse(customer.metadata.userCart),
            sts: "preparing",
            status:data.payment_status,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        }

        admin.firestore().collection("orders").doc(`/${orderId}/`).set(Order);

    
         deleteCartAfterPayment(customer.metadata.userId, JSON.parse(customer.metadata.userCart));

        // return res.status(200).send({ success:true });

    }catch(err) {
        console.log(err);
    }
  }


 const deleteCartAfterPayment = (userId, items) =>  {

    items.map(async (data) => {
        await admin.firestore().collection(`cart ${userId}`)
        .doc(`/${data.id}`)
        .delete()
        .then(() => {
            console.log("deleted successfully")
        })
    })
 }



app.listen(4000, () => console.log('Listening on port 4000!'))