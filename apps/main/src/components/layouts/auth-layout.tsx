// src/components/layouts/auth-layout.tsx
import React, { ReactNode } from "react";
import AuthHeader from "../shared/auth/auth-header";
import { SphereIcon } from "@phosphor-icons/react";
import PacepardIcon from "../shared/common/LogoIcon";

interface IAuthLayout {
  title: string;
  description?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export const AuthLayout = (props: IAuthLayout) => {
  const { title, description, children, maxWidth = "md", buttonLabel, onButtonClick } = props;

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }[maxWidth];  

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className={`${maxWidthClass} w-full`}>

      {/* <PacepardIcon className="h-20 w-20 text-green-500 ml-5" /> */}

        <AuthHeader title={title} description={description} buttonLabel={buttonLabel} onButtonClick={onButtonClick} />

        {children}


        <p className="text-muted-foreground text-start p-6">
          By signing up, you agree to the{" "}
          <a href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};



// // src/components/layouts/auth-layout.tsx
// import React, { ReactNode } from "react";
// import AuthHeader from "../shared/auth/auth-header";
// import { SphereIcon } from "@phosphor-icons/react";
// import PacepardIcon from "../shared/common/LogoIcon";

// interface IAuthLayout {
//   title: string;
//   description?: string;
//   children: ReactNode;
//   maxWidth?: "sm" | "md" | "lg" | "xl";
//   buttonLabel?: string;
//   onButtonClick?: () => void;
// }

// export const AuthLayout = (props: IAuthLayout) => {
//   const { title, description, children, maxWidth = "md", buttonLabel, onButtonClick } = props;

//   const maxWidthClass = {
//     sm: "max-w-sm",
//     md: "max-w-md",
//     lg: "max-w-lg",
//     xl: "max-w-xl",
//   }[maxWidth];

//   return (
//     <div className="min-h-screen w-full flex">
//       {/* Left side: small illustration panel */}
//       <div className="hidden md:flex w-1/6 bg-green-200 items-center justify-center">
        
//       </div>

//       {/* Right side: form, centered */}
//       <div className="flex flex-1 justify-center items-center p-8">
//         <div className={`w-full ${maxWidthClass}`}>
//           <AuthHeader 
//             title={title} 
//             description={description} 
//             buttonLabel={buttonLabel} 
//             onButtonClick={onButtonClick} 
//           />

//           <div className="mt-6">
//             {children}
//           </div>

//           <p className="text-muted-foreground text-start mt-6">
//             By signing up, you agree to the{" "}
//             <a href="/terms" className="underline hover:text-foreground">Terms of Service</a>{" "}
//             and{" "}
//             <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

