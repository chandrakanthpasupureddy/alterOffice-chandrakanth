import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "./index.css";
import { auth ,db} from "../firebase";
import { toast } from "react-toastify";
import { setDoc,doc } from "firebase/firestore";
const SigninWithGoogle = () =>{
    const googleLogin = () =>{
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth,provider).then(async(result)=>{
            console.log(result);
            const user = result.user;
            if(result.user){
                await setDoc(doc(db,"Users",user.uid),{
                    email:user.email,
                    firstName:user.displayName,
                    photo:user.photoURL,
                });
                toast.success("User logged in Successfully",{
                    position:"top-center",
                });
                window.location.href = "./feeds";
            }
        })
    }
    return(
        <div>
            <button onClick={googleLogin} className="butn1">
                <img src = "https://res.cloudinary.com/ddw4ubmbj/image/upload/v1734024458/Group_1171276159_mizcdd.svg" alt = "google" className="google-img"/>
            </button>
        </div>
    )
}
export default SigninWithGoogle