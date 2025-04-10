import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,                                  // zd4Yx8EL8iLtgTqW                                 
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useRegisterUserMutation, useLoginUserMutation } from '@/features/api/authApi';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [signupInput, setSignupInput] = useState({name:"", email:"", password:""});
    const [loginInput, setLoginInput] = useState({email:"", password:""});

    const [registerUser, {data:registerData, error:registerError, isLoading:registerIsLoading, isSuccess:registerIsSuccess,},] = useRegisterUserMutation();
    const [loginUser, {data:loginData, error:loginError, isLoading:loginIsLoading, isSuccess:loginIsSuccess,},] = useLoginUserMutation();

    const navigate = useNavigate();

    const changeInputHandler = (e,type) => {
        const {name, value} = e.target;
        if(type === "signup"){
            setSignupInput({...signupInput, [name]:value});
        } else{
            setLoginInput({...loginInput, [name]:value});
        }
    };

    const handleRegistration = async (type) => {
      const inputData = type === "signup"?signupInput:loginInput;
      const action = type === "signup" ? registerUser : loginUser;
      await action(inputData);
    };

    useEffect(()=>{
      if(registerIsSuccess && registerData){
        toast.success(registerData.message || "Signup successful");
      }
      else if(registerError){ 
        toast.error(registerError.data.message || "Signup failed");
      }
      else if(loginIsSuccess && loginData){
        toast.success(loginData.message || "Login successful");
        navigate("/");
      }
      else if(loginError){
        toast.error(loginError.data.message || "Login failed");
      }
    },[loginIsLoading, registerIsLoading, loginData, registerData, loginError, registerError]);

  return (
    <div className="flex items-center w-full justify-center mt-20">
        <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Signup</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Login with your credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input 
                name="email"
                value={loginInput.email}
                type="email" 
                placeholder="Email" 
                required={true} 
                onChange={(e) => changeInputHandler(e,"login")} 
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">password</Label>
              <Input
                name="password"
                value={loginInput.password}  
                required={true} 
                placeholder="password"
                onChange={(e) => changeInputHandler(e,"login")} 
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={loginIsLoading} onClick={() => handleRegistration("login")}>
              {
                loginIsLoading ? (
                  <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                  </>
                ) :"Login"
              }
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Signup</CardTitle>
            <CardDescription>
              Signup to create and join rooms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input 
                
                name="name"
                value={signupInput.name} 
                type="text" 
                placeholder="Name" 
                required={true}
                onChange={(e) => changeInputHandler(e,"signup")} 
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input 
                name="email"
                value={signupInput.email} 
                placeholder="xyz@gmail.com" 
                required={true} 
                onChange={(e) => changeInputHandler(e,"signup")}  
               />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Set password</Label>
              <Input 
                name="password"
                value={signupInput.password} 
                type="password"
                placeholder="password"
                required={true}
                onChange={(e) => changeInputHandler(e,"signup")}  
            />
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={registerIsLoading}  onClick={() => handleRegistration("signup")}>
              {
                registerIsLoading ? (
                  <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                  </>
                ) : "Signup"
              }
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
  )
}

export default Login;
