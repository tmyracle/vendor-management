import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLengthValid, setPasswordLengthValid] = useState(
    password.length === 0
  );
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessagePasswordMatch, setErrorMessagePasswordMatch] =
    useState("");

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
    const payload = {
      token: token,
      password: password,
    };

    try {
      const res = await axios.post("/api/v1/password/reset", payload);
      if (res.status === 200) {
        window.location.replace("/signin");
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
    setIsButtonEnabled(passwordLengthValid && passwordsMatch);
  }, [password, confirmPassword, passwordLengthValid, passwordsMatch]);

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
          Set a new password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-4 text-gray-700 text-sm">
            Enter your new password
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errorMessage ? (
              <div className="text-red-500">{errorMessage}</div>
            ) : (
              <></>
            )}
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
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
