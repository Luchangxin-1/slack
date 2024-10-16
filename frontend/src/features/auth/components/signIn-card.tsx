"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SignInData, SignInFlow } from "../type";
import { useForm } from "react-hook-form";
import { LoginAPI } from "@/server/auth";
import Spinner from "@/components/spinner";

import { useRouter } from "next/navigation";
import { signIn } from "../../../../auth";
import { handleCredentialsSignin } from "@/app/actions";
import { TriangleAlert } from "lucide-react";
import { toast } from "@/hooks/use-toast";
interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}
const SignInCard = ({ setState }: SignInCardProps) => {
  //hooks
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>();
  //method
  const onSubmit = async (data: SignInData) => {
    setLoading(true);
    setError(false);
    try {
      const fastapi_resp = await LoginAPI(data);
      console.log(fastapi_resp);

      if (fastapi_resp.success === "true") {
        const token = fastapi_resp.data.user.token;
        console.log(token, fastapi_resp.data);
        localStorage.setItem("token", token);
        toast({
          title: fastapi_resp.message,
        });
        router.push("/");
      } else {
        toast({
          variant: "destructive",
          title: fastapi_resp.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
    const res = await handleCredentialsSignin(data);
    // if (res == undefined) {
    //   toast({
    //     title: "Login Successfully!",
    //   });
    //   router.push("/");
    // } else {
    //   setError(true);
    //   toast({
    //     variant: "destructive",
    //     title: res.message,
    //   });
    // }

    setLoading(false);
  };
  return (
    <Card className="h-[500px] p-8">
      <CardHeader className="">
        <CardTitle>Login to continue</CardTitle>
      </CardHeader>
      <CardDescription className="mt-3">
        Use your email or another service to continue
      </CardDescription>
      {error && (
        <div className="bg-destructive/15 py-2 px-4 rounded-lg flex  items-center gap-x-2 text-sm text-destructive">
          <TriangleAlert className="size-4" />
          <p>Error Password</p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          disabled={false}
          {...register("email")}
          placeholder="Email"
          required
          className="mt-4"
        />
        <Input
          disabled={false}
          {...register("password")}
          placeholder="Password"
          type="password"
          required
        />
        <Button
          type="submit"
          className="w-full mt-5 gap-4"
          size="lg"
          disabled={loading}
        >
          {!loading ? "Continue" : <Spinner />}
        </Button>
      </form>
      <Separator className="mt-2" />
      <div className="flex mt-3 flex-col gap-y-2.5">
        <Button
          className="w-full relative"
          disabled={false}
          onClick={() => {}}
          variant="outline"
          size="lg"
        >
          <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
          <div>Continue with Google</div>
        </Button>
        <Button
          className="w-full relative"
          disabled={false}
          onClick={() => {}}
          variant="outline"
          size="lg"
        >
          <FaGithub className="size-5 absolute top-2.5 left-2.5" />
          <div>Continue with Github</div>
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Don't have a account?{" "}
        <span
          onClick={() => setState("signUp")}
          className="text-sky-700 hover:underline cursor-pointer"
        >
          Sign Up
        </span>
      </p>
    </Card>
  );
};

export default SignInCard;
