import {useState} from 'react';
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import {getAuth, signInWithCustomToken} from 'firebase/auth';
import GoogleLogin from "./GoogleLogin.tsx";

const Signup = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const location = useLocation()

    const onSubmit = async (e: any) => {
        e.preventDefault()
        const auth = getAuth();

        fetch(import.meta.env.VITE_HOST + "/account/v1/signup" , {
            method: "POST",
            body: JSON.stringify({"email": email, "password":password, "username": username, "displayname": displayName})
        })
            .then(async (res) => {
                if (res.ok) {
                    return res.json()
                } else {
                    throw new Error(await res.text())
                }
            })
            .then(
                (result) => {
                    signInWithCustomToken(auth, result)
                        .then(() => {
                            if(location.key !== 'default'){
                                navigate(-1)
                            }else{
                                navigate("/")
                            }
                        })
                        .catch(() => {
                        });

                }, (error: Error) => {
                    console.log(error.message)
                }
            )
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
                    <label htmlFor="username">
                        Username
                        <input
                            type="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Username"
                        />
                    </label>

                    <label htmlFor="displayname">
                        Display name
                        <input
                            type="displayname"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            placeholder="Display name"
                        />
                    </label>
                    <button
                        type="submit"
                        className={"blue-btn"}
                        onClick={onSubmit}
                    >
                        Sign up
                    </button>

                </form>
                <div className={"separator"}></div>
                <GoogleLogin/>
                <p>
                    Skip signing up using {' '}
                    <NavLink to="/login">
                        <u>Google Login</u>
                    </NavLink>
                </p>
            </div>
        </section>
    )
}

export default Signup