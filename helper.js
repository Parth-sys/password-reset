import connection from "./connection.js"


 async function saveOtp(email,ran){
   const client=await connection();
   return client.db("users").collection("otp").insertOne({email:email ,Otp:ran});
}


 
async function checkcode(client,code) {
    return await client.db("users").collection("otp").findOne({code:code});
}































export  default saveOtp