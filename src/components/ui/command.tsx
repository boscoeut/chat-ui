import * as React from "react"
import * as CommandPrimitive from "cmdk"

import { cn } from "@/lib/utils"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Command>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Command>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Command
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = "Command"

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.CommandInput>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.CommandInput>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <CommandPrimitive.CommandInput
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))
CommandInput.displayName = "CommandInput"

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.CommandList>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.CommandList>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.CommandList
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))
CommandList.displayName = "CommandList"

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.CommandEmpty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.CommandEmpty>
>((props, ref) => (
  <CommandPrimitive.CommandEmpty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))
CommandEmpty.displayName = "CommandEmpty"

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.CommandGroup>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.CommandGroup>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.CommandGroup
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
))
CommandGroup.displayName = "CommandGroup"

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.CommandSeparator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.CommandSeparator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.CommandSeparator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = "CommandSeparator"

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.CommandItem>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.CommandItem>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.CommandItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
))
CommandItem.displayName = "CommandItem"

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} 