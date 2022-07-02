const express = require('express');
const cors = require('cors');
const braintree = require('braintree')
const app = express();
app.use(express.json());
require('dotenv').config();
// const dotenv = require('dotenv');
// dotenv.config()
console.log(process.env.HOST);
console.log(process.env.PORT);
console.log(process.env.MERCHANT_ID);
console.log(process.env.PUBLIC_KEY);
console.log(process.env.PRIVATE_KEY);

const config = {
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.MERCHANT_ID,
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY
};

const gateway = new braintree.BraintreeGateway(config);
app.use(cors({origin: 'http://localhost:3000' }));


app.use(function(req,res, next){
  req.header("Access-Control-Allow-Origin", "*");
  req.header("Access-Control-Allow-Headers", "X-Requested-With");
//   req.header("Access-Control-Allow-Methods", "GET","POST","DELETE");

  next();
})

//token generation
app.get("/tokenGeneration" ,async(req,res)=>{
    console.log("tokenGeneration");
    try{
        gateway.clientToken.generate({},(err, resData)=> {
            if (err){
                return res.send({err:err})
            }else{
                console.log("data",resData);
                return res.status(200).json({"status":"success","token":resData.clientToken})
            }
        })
    }catch (error){
        return res.status(500).json({"status":"failed","message":error.message})
    }
})   
//sale transaction
app.post("/saleTransaction" ,async(req,res)=>{
    console.log("Sale object details")
    console.log(req.body);
    try{
        const paymentData = gateway.transaction.sale({
            amount: req.body.amount,
            paymentMethodNonce:req.body.paymentMethodNounce,
            deviceData: req.body.deviceData,
            options: {
                submitForSettlement: true
            }
        }).then(resData=>{
            console.log(resData)
            return res.status(200).json({"status":"success","resData":resData.transaction})
        }).catch(err=>{
            return res.send({"error":err.message})  
        })
    }catch (error){
        return res.status(500).json({"status":"failed","message":error.message})
    }
})
//refundWithCharge transaction
app.get("/refundWithCharge" ,async(req,res)=>{
    try{
        const data = totalAmount;
        const cancellation_fee = totalAmount - ((totalAmount/100)*10)
        const paymentData = gateway.transaction.submitForPartialSettlement(
            "Transaction_id",
            "cancellation_fee",
             (err, resData)=>{
            if (resData.success){
                return res.status(200).json({"status":"success","resData":resData.transaction})
            }else{
                return res.send({"error":err})  
            }
          }
        )
    
    }catch (error){
        return res.status(500).json({"status":"failed","message":error.message})
    }
})
//refund Without Charge transaction
app.get("/refundWithOutCharge" ,async(req,res)=>{
    try{
        const data = totalAmount;
        const cancellation_fee = totalAmount - ((totalAmount/100)*10)
        const paymentData = gateway.transaction.submitForPartialSettlement(
            "Transaction_id",
             (err, resData)=>{
            if (resData.success){
                return res.status(200).json({"status":"success","resData":resData.transaction})
            }else{
                return res.send({"error":err})  
            }
        }
      )
        
    
    }catch (error){
        return res.status(500).json({"status":"failed","message":error.message})
    }
})
// app.listen(process.env.PORT, ()=>{
//     console.log(`${process.env.HOST}${process.env.PORT}`)
// })

app.listen(3010, ()=>{
    console.log('port 3010 listening...');
})