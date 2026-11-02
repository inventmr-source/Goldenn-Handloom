import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAdfLUA4N4ACeJoeVLbkksYMEctv9k9Q8o",
    authDomain: "goldenhandloom-5aa81.firebaseapp.com",
    projectId: "goldenhandloom-5aa81",
    storageBucket: "goldenhandloom-5aa81.firebasestorage.app",
    messagingSenderId: "104853637643",
    appId: "1:104853637643:web:abf09cd02d6fc689c4150e",
    measurementId: "G-BTTT43ZRXR"
};

const auth = getAuth(initializeApp(firebaseConfig));
const googleProvider = new GoogleAuthProvider();
const loginForm = document.querySelector("#login-form");
const googleSignup = document.querySelector("#google-signup");
const createAccount = document.querySelector("#create-account");
const passwordHelp = document.querySelector("#password-help");
const setupNotice = document.querySelector("#setup-notice");
const loginTitle = document.querySelector("#login-title");
const loginIntro = document.querySelector("#login-intro");
const accountPrompt = document.querySelector(".account-prompt");
const accountStatus = document.querySelector("#account-status");
const accountEmail = document.querySelector("#account-email");
const signOutButton = document.querySelector("#sign-out");
const submitButton = loginForm.querySelector(".submit-button");
const passwordInput = document.querySelector("#password");
const emailInput = document.querySelector("#email");
let isCreatingAccount = false;

function showNotice(message) {
    setupNotice.textContent = message;
}

function getErrorMessage(error) {
    const messages = {
        "auth/account-exists-with-different-credential": "An account already exists with this email using a different sign-in method.",
        "auth/cancelled-popup-request": "Another sign-in window is already open.",
        "auth/email-already-in-use": "An account already exists with this email. Sign in instead.",
        "auth/invalid-credential": "The email or password is incorrect.",
        "auth/invalid-email": "Enter a valid email address.",
        "auth/network-request-failed": "Network error. Check your connection and try again.",
        "auth/popup-blocked": "Your browser blocked the Google sign-in window. Allow pop-ups and try again.",
        "auth/popup-closed-by-user": "Google sign-in was closed before it finished.",
        "auth/too-many-requests": "Too many attempts. Please wait a while and try again.",
        "auth/unauthorized-domain": "This website domain is not authorized in Firebase Authentication settings.",
        "auth/user-disabled": "This account has been disabled. Contact the store for help.",
        "auth/user-not-found": "No account was found with this email. Create an account first.",
        "auth/weak-password": "Choose a password with at least 6 characters."
    };

    return messages[error.code] || `Authentication failed: ${error.message}`;
}

function setAccountMode(createMode) {
    isCreatingAccount = createMode;
    loginTitle.textContent = createMode ? "Create your account" : "Welcome back";
    loginIntro.textContent = createMode
        ? "Create a Golden Handloom account"
        : "Sign in to your Golden Handloom account";
    submitButton.textContent = createMode ? "Create account" : "Sign in";
    accountPrompt.innerHTML = createMode
        ? 'Already have an account? <a href="#sign-in" id="create-account">Sign in</a>'
        : 'New to Golden Handloom? <a href="#create-account" id="create-account">Create an account</a>';
    document.querySelector("#create-account").addEventListener("click", (event) => {
        event.preventDefault();
        setAccountMode(!isCreatingAccount);
        showNotice("");
    });
}

googleSignup.addEventListener("click", async () => {
    googleSignup.disabled = true;
    showNotice("Connecting to Google…");
    try {
        await signInWithPopup(auth, googleProvider);
        showNotice("");
    } catch (error) {
        showNotice(getErrorMessage(error));
    } finally {
        googleSignup.disabled = false;
    }
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    showNotice("");

    try {
        if (isCreatingAccount) {
            await createUserWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
        } else {
            await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
        }
    } catch (error) {
        showNotice(getErrorMessage(error));
    } finally {
        submitButton.disabled = false;
    }
});

document.querySelector("#create-account").addEventListener("click", (event) => {
    event.preventDefault();
    setAccountMode(true);
    showNotice("");
});

passwordHelp.addEventListener("click", async (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    if (!email) {
        showNotice("Enter your email address first, then choose Forgot password.");
        emailInput.focus();
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        showNotice("If an account exists for that email, Firebase has sent a password reset link.");
    } catch (error) {
        showNotice(getErrorMessage(error));
    }
});

signOutButton.addEventListener("click", async () => {
    signOutButton.disabled = true;
    try {
        await signOut(auth);
        showNotice("You have signed out.");
    } catch (error) {
        showNotice(getErrorMessage(error));
    } finally {
        signOutButton.disabled = false;
    }
});

onAuthStateChanged(auth, (user) => {
    const isSignedIn = Boolean(user);
    googleSignup.hidden = isSignedIn;
    document.querySelector(".divider").hidden = isSignedIn;
    loginForm.hidden = isSignedIn;
    accountPrompt.hidden = isSignedIn;
    accountStatus.hidden = !isSignedIn;

    if (user) {
        loginTitle.textContent = "You’re signed in";
        loginIntro.textContent = "Welcome to Golden Handloom";
        accountEmail.textContent = user.displayName
            ? `${user.displayName} · ${user.email}`
            : user.email || "Signed in to your account";
        showNotice("");
    } else {
        setAccountMode(false);
    }
});
