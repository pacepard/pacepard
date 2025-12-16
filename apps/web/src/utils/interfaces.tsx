import { ComponentPropsWithoutRef } from "react"

import Link from "next/link"

export interface ILogo extends Omit<ComponentPropsWithoutRef<typeof Link>, 'href'> {
  large?: boolean
  className?: string
}