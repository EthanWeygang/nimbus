 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 
 function Verify(){
   const navigate = useNavigate()
   const [loading, setLoading] = useState(false)
   const [verificationCode, setVerificationCode] = useState("")


   async function checkVerification(e){
      e.preventDefault();
      setLoading(true)
      
      try{
         console.log("Sending verification request to:", `${process.env.REACT_APP_API_URL}/api/verify`);
         console.log("Verification code:", verificationCode);
         
         const response = await fetch(`${process.env.REACT_APP_API_URL}/api/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ verificationCode: verificationCode })
         });

         console.log("Response status:", response.status);
         console.log("Response ok:", response.ok);

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         const data = await response.json();
         console.log("Response data:", data);

         if(data.error){
            alert(data.error)
            setLoading(false)
            return
         }

         if(data.response){
            alert(data.response)
            setLoading(false)
            navigate("/login")
            return
         }

      }catch(e){
         console.error("Verification error:", e);
         alert(`Verification failed: ${e.message}`)
      }

      setLoading(false)
   }

    return(
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-mint flex items-center justify-center px-4 flex-col"> 
         <div className="max-w-md w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
               <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-charcoal mb-2">Verify</h1>
                  <p className="text-darkSage">We sent you an email with your verification code.</p>
               </div>
          
               <form onSubmit={(e) => {checkVerification(e)}} className="space-y-6">
               <input 
                  onChange={(e) => {setVerificationCode(e.target.value)}}
                  id="verificationCode"
                  className="w-full px-4 py-3 border border-sage/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition-all duration-200 bg-white/70" 
                  placeholder="Verification code"
                  required
               />

               <button 
               type="submit"
               disabled={loading}
               className="w-full bg-sage text-white font-semibold py-3 px-4 rounded-xl hover:bg-forest transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
               >Enter</button>
         
               </form>
            </div>
         </div>
      </div>
    )
 }

 export default Verify;