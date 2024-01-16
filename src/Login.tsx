import {useState} from 'react';

import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import GoogleLogin from "./GoogleLogin.tsx";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const location = useLocation()
    const auth = getAuth()

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

    return (
        <section className={"login-section"}>
            <div className={"login-container"}>
                <form>
                    <label htmlFor="email-address">
                        Email address
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Email address"
                        />
                    </label>
                    <label htmlFor="password">
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Password"
                        />
                    </label>

                    <button
                        type="submit"
                        className={"green-btn"}
                        onClick={onSubmitEmailAndPassword}
                    >
                        Login
                    </button>
                </form>
                <div className={"separator"}></div>
                <GoogleLogin/>
                <p>
                    Don't have an account?{' '}
                    <NavLink to="/signup">
                        <u>Sign up</u>
                    </NavLink>
                </p>
            </div>
        </section>
    )
}

export default Login