import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import React from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase.js';
import { useDispatch } from "react-redux";
import { logInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {

    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleGoogleClick() {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const resultFromGoogle = await signInWithPopup(auth, provider);

            const { displayName, email, photoURL } = resultFromGoogle.user;

            const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: displayName,
                    email,
                    googlePhotoUrl: photoURL
                }),
                credentials: 'include'
            })

            const data = await response.json();

            if (response.ok) {
                dispatch(logInSuccess(data));
                navigate('/');
            }

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <Button
        type="button"
        gradientDuoTone="purpleToBlue"
        onClick={handleGoogleClick}
        >
        <AiFillGoogleCircle className="h-6 w-6 me-2" /> Continue with google
        </Button>
    );
}
