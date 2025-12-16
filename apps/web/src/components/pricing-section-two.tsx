



// import Link from 'next/link'

// import { Check } from 'lucide-react'

// import { pricingHeader, plans } from '@/_data/pacepard/pricing'
// import { Button } from '@/components/ui/button'
// import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'


// export default function Pricing() {
//   return (
//     <div className="relative py-16 md:py-32">
//       <div className="mx-auto max-w-5xl px-6">
//         <div className="mx-auto max-w-2xl text-center">
//           <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
//             {pricingHeader.title}
//           </h2>
//           <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-balance text-lg">
//             {pricingHeader.subtitle}
//           </p>
//         </div>

//         <div className="@container relative mt-12 md:mt-20">
//           <Card className="@4xl:max-w-full relative mx-auto max-w-sm">
//             <div className="@4xl:grid-cols-3 grid gap-6">
//               {plans.map((plan, idx) => (
//                 <div key={idx} className="ring-foreground/10 bg-background rounded-(--radius) shadow ring-1">
//                   <CardHeader className="p-8">
//                     <CardTitle className="font-medium">{plan.title}</CardTitle>
//                     <span className="mb-0.5 mt-2 block text-2xl font-semibold">{plan.price}</span>
//                     <CardDescription className="text-sm">{plan.description}</CardDescription>
//                   </CardHeader>

//                   <div className="border-y px-8 py-4">
//                     <Button asChild className="w-full" variant="default">
//                       <Link href="#">Get Started</Link>
//                     </Button>
//                   </div>

//                   <ul className="space-y-3 p-8">
//                     {plan.features.map((feature, i) => (
//                       <li key={i} className="flex items-center gap-2">
//                         <Check className="text-primary size-3" strokeWidth={3.5} />
//                         {feature}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
