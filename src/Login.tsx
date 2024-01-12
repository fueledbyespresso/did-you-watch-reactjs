import {useState} from 'react';

import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import {getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from 'firebase/auth';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const location = useLocation()
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    const onSubmitEmailAndPassword = async (e: any) => {
        e.preventDefault()
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                if(location.key !== 'default'){
                    navigate(-1)
                }else{
                    navigate("/")
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const onSubmitGoogle = async ()=> {
        signInWithPopup(auth, provider)
            .then(() => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                console.log("Logged in!")
            }).catch((error) => {
            // Handle Errors here.
            console.log("error", error)
        });
    }

    return (
        <section>
            <div>
                <div>
                    <form>
                        <div>
                            <label htmlFor="email-address">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Email address"
                            />
                        </div>

                        <div>
                            <label htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Password"
                            />
                        </div>
                        <button
                            type="submit"
                            onClick={onSubmitEmailAndPassword}
                        >
                            Login
                        </button>
                        <button
                            type="submit"
                            onClick={onSubmitGoogle}
                        >
                            Login With Google
                        </button>
                    </form>

                    <p>
                        Don't have an account?{' '}
                        <NavLink to="/signup">
                            <u>Sign up</u>
                        </NavLink>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Login