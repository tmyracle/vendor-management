import React, { useEffect, useState } from "react";
import axios from "axios";
import validator from "validator";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailFormatValid, setEmailFormatValid] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLengthValid, setPasswordLengthValid] = useState(
    password.length === 0
  );
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [errorMessagePasswordMatch, setErrorMessagePasswordMatch] =
    useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email);
    setEmailFormatValid(validator.isEmail(email));
  };

  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);
    setPasswordLengthValid(password.length >= 8);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const signUpPayload = {
      full_name: fullName,
      email: email,
      company_name: companyName,
      password: password,
    };

    try {
      const res = await axios.post("/api/v1/users", signUpPayload);
      if (res.status === 200) {
        const { token } = res.data;
        localStorage.setItem("token", token);
        window.location.replace("/dashboard");
      }
    } catch (err) {
      if (err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("Something went wrong.");
      }
    }
  };

  useEffect(() => {
    if (password && confirmPassword && password === confirmPassword) {
      setPasswordsMatch(true);
      setErrorMessagePasswordMatch("");
    } else if (password && confirmPassword && password !== confirmPassword) {
      setPasswordsMatch(false);
      setErrorMessagePasswordMatch("Passwords do not match.");
    } else {
      setPasswordsMatch(false);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    setIsButtonEnabled(
      passwordLengthValid && passwordsMatch && emailFormatValid
    );
  }, [
    fullName,
    email,
    companyName,
    password,
    confirmPassword,
    passwordLengthValid,
    passwordsMatch,
    emailFormatValid,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <a href="/">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-blue-600.svg"
            alt="Workflow"
          />
        </a>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errorMessage ? (
              <div className="text-red-500">{errorMessage}</div>
            ) : (
              <></>
            )}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="fullName"
                  onChange={handleFullNameChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={handleEmailChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {emailFormatValid ? null : (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  Please enter a valid email address.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700"
              >
                Company name
              </label>
              <div className="mt-1">
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  onChange={handleCompanyNameChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={handlePasswordChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {passwordLengthValid ? null : (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  Your password must be at least 8 characters.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  onChange={handleConfirmPasswordChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {errorMessagePasswordMatch ? (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {errorMessagePasswordMatch}
                </p>
              ) : (
                <></>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={!isButtonEnabled}
                id="signUpButton"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
