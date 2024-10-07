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
import React from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SignInFlow } from "../type";
interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}
const SignInCard = ({ setState }: SignInCardProps) => {
  return (
    <Card className="h-[500px] p-8">
      <CardHeader className="">
        <CardTitle>Login to continue</CardTitle>
      </CardHeader>
      <CardDescription className="mt-3">
        Use your email or another service to continue
      </CardDescription>
      <form className="space-y-4">
        <Input
          disabled={false}
          value=""
          onChange={() => {}}
          placeholder="Email"
          required
          className="mt-4"
        />
        <Input
          disabled={false}
          value=""
          onChange={() => {}}
          placeholder="Password"
          type="password"
          required
        />
        <Button
          type="submit"
          className="w-full mt-5"
          size="lg"
          disabled={false}
        >
          Continue
        </Button>
      </form>
      <Separator />
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
