
import cors from "cors";
import express, { response }  from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import connection  from "./connection.js";
import saveOtp  from "./helper.js";




const app=express();
dotenv.config();
const PORT=process.env.PORT;


app.use(express.json());
app.use(cors());



app.get('/',(request,response)=>{
    response.send("Hi all local");
});


//read users

app.post('/create', async(request,response)=>{
    
    const client=await connection()
    const {email}=request.body.email;
    const result=await client. db("users").collection("Managers").insertOne({email:email})
    response.send(result);
});

app.post('/reset', async(request,response)=>{

   const client=await connection();
   const {Otp}=request.body.Otp;
   const result=await client.db("users").collection("otp").findOne({Otp:Otp})
    response.send(result)
})


    
    var transporter=nodemailer.createTransport({
      
        host: 'smtp.gmail.com', //replace with your email provider
        port:465,
        secure:true,
        auth:{
           
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        }
    })
    
    transporter.verify(function(error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
        }
      });
    
    

app.post('/sendmail', async (request,response)=>{
    
    const client=await connection();
    const {email}=request.body
    
    
    //const hashpassword=  await genPassword(password);
    //console.log(username,password)
    const result= await client.db('users').collection('Managers').findOne({email:email});
    

    if(!result){
        return  response.status(403).json({
            message: "Wrong email"
        })
    }

    if(result){
        var ran = Math.random().toString(36).substring(2,7);
        console.log(ran)
        saveOtp(email,ran);
       // mailer(email,ran)

       var mailOptions={
        from:'ticketbook401@gmail.com',
        to:email,
        subject:'sending email for authentication of user',
        text:"hi ur verification link is here , ur verificaion code:"+ ran,
        html: '<p>Click <a href="http://localhost:5000/forgetpass">here</a> to reset your password .ur passcode is  </p>'+ran
    
            
        
    }

        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error);
            }else{
                console.log("email sent" + info.response);
            }
        })




        
        response.send("success,check ur email");
    }else{
        response.send("error")
    }
}
)

//get user by id

app.patch('/Resetpass', async (request,response)=>{
    
    const  { email,password} =request.body;
    const client= await connection();
    const result=await client.db("users").collection("Managers").findOneAndUpdate({ email:email},{$set:{password:password}})
   
    console.log(result);
    response.send(result);
});








app.listen(PORT,()=>{
    console.log("server connected");
})