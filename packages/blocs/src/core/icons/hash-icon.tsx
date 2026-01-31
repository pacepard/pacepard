import { memo } from "react"

type SvgProps = React.ComponentPropsWithoutRef<"svg">

export const HashIcon = memo(({ className, ...props }: SvgProps) => {
  return (
    <svg
      width="24"
      height="24"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 9H20M4 15H20M10 3L8 21M16 3L14 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
})

HashIcon.displayName = "HashIcon"
