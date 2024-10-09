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
import { SignInFlow, SignUpData, SignUpFormData } from "../type";
import { useForm } from "react-hook-form";
import { SignUpAPI } from "@/server/auth";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Spinner from "@/components/spinner";
import { useRouter } from "next/navigation";
interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

const SignUpCard = ({ setState }: SignInCardProps) => {
  //hooks
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpFormData>();
  const [signUpData, setSignUpData] = useState<SignUpData>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const [errorPassword, setErrorPassword] = useState<boolean>(false);

  //methods
  const handlePasswordMismatch = () => {
    setErrorPassword(true),
      toast({
        variant: "destructive",
        title: "Two input password not same. Please check!",
      });
    return;
  };
  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    data.confirmPassword === data.password
      ? setErrorPassword(false)
      : handlePasswordMismatch();
    const { confirmPassword, ...rest } = data;
    setSignUpData(rest);
    try {
      const resp = await SignUpAPI(signUpData as SignUpData);
      console.log(resp);
      if (resp.success === "true") {
        toast({
          title: resp.message,
        });
        setState("signIn");
        reset({ email: "", name: "", confirmPassword: "", password: "" });
      } else {
        toast({
          variant: "destructive",
          title: resp.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  return (
    <Card className="h-[500px] p-8">
      <CardHeader className="">
        <CardTitle>SignUp to continue</CardTitle>
      </CardHeader>
      <CardDescription className="mt-3">
        Use your email or another service to continue
      </CardDescription>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("email")}
          disabled={false}
          placeholder="Email"
          required
          className="mt-4"
        />
        <Input
          {...register("name")}
          disabled={false}
          placeholder="Name"
          required
          className="mt-4"
        />
        <Input
          {...register("password")}
          disabled={false}
          placeholder="Password"
          type="password"
          onClick={() => {
            setErrorPassword(false);
          }}
          onChange={() => {
            setErrorPassword(false);
          }}
          className={cn(
            errorPassword ? "border-2  border-red-500" : "",
            "focus:border-none"
          )}
          required
        />
        <Input
          {...register("confirmPassword")}
          disabled={false}
          placeholder="Confirm your Password"
          type="password"
          onClick={() => {
            setErrorPassword(false);
          }}
          className={cn(
            errorPassword ? "border-2  border-red-500" : "",
            "focus:border-none"
          )}
          required
        />
        <Button
          type="submit"
          className="w-full mt-5"
          size="lg"
          disabled={loading}
        >
          {!loading ? "Continue" : <Spinner />}
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
        Have a account?{" "}
        <span
          onClick={() => setState("signIn")}
          className="text-sky-700 hover:underline cursor-pointer"
        >
          Sign In
        </span>
      </p>
    </Card>
  );
};

export default SignUpCard;
