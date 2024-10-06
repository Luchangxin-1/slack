"use client";

import React, { useState } from "react";
import { SignInFlow } from "../type";

const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");
  return (
    <div className="h-full flex items-center justify-center bg-red">
      <div className="md:h-auto md:w-[420px]">auth screen </div>
    </div>
  );
};

export default AuthScreen;
