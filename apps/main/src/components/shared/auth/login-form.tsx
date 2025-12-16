// src/components/shared/auth/login-form.tsx
import { Button } from "@pacepard/ui/components/button";
import { Input } from "@pacepard/ui/components/input";
import { Label } from "@pacepard/ui/components/label";
import { Link } from "react-router-dom"; 


const LoginForm = () => {
  return (
    <form className="p-6 space-y-6">
      <div>
        {/* <LogoIcon /> */}
      </div>

      {/* Social login buttons */}
      <div className="space-y-2">
        <Button type="button" variant="outline" className="w-full">
          <span>Google</span>
        </Button>
        <Button type="button" variant="outline" className="w-full">
          <span>Facebook</span>
        </Button>
        <Button type="button" variant="outline" className="w-full">
          <span>Microsoft</span>
        </Button>
      </div>

      <hr className="my-6" />

      {/* Email login */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            required
            placeholder="Your email"
            className="ring-foreground/15 border-transparent ring-1"
          />
        </div>
        <Button className="w-full">Continue</Button>
      </div>

      <p className="text-sm text-muted-foreground mt-4">
        Already have an account?
        <Button asChild variant="link" className="px-2">
          <Link to="/login">Sign In</Link>
        </Button>
      </p>
    </form>
  );
};

export default LoginForm;
