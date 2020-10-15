import React, { useState } from "react";
import { useRouter } from "next/router";
import { apiRest } from "../lib/api.js";
import { useAppContext } from "../providers/AppContext.js";
import ETKTemplate from "../components/Template";
import ETKSigninButton from "../components/SignIn/Button";
import ETKRegistrationLinkConfirmation from "../components/RegistrationLink/Confirmation";

export default function RegistrationLinkPage() {
  const router = useRouter();
  const { user, setUser } = useAppContext();
  const [errorContent, setErrorContent] = useState([]);

  const onError = (error) => {
    setErrorContent([error.message]);
    setTimeout(() => {
      apiRest.auth.logout();
      setUser(null);
      router.push("/");
    }, 5000);
  };

  const onSuccess = () => {
    setTimeout(() => {
      router.push("/");
    }, 5000);
  };

  const signIn = (
    <ETKSigninButton
      open
      dialogTitle="Vous devez vous authentifier avant que l'on puisse verifier votre lien"
    />
  );

  const confirmation = (
    <ETKRegistrationLinkConfirmation
      value={router.query.value}
      content="Merci de patienter pendant que nous verifions votre lien"
      errorContent={errorContent}
      onSuccess={onSuccess}
      onError={onError}
    />
  );

  return (
    <ETKTemplate>
      {!user && !errorContent.length ? signIn : confirmation}
    </ETKTemplate>
  );
}
