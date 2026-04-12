import {
    Bell,
    ChevronDown,
    CreditCard,
    UserCircle,
    LogOut,
    Sparkles,
} from 'lucide-react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@pacepard/ui/components/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@pacepard/ui/components/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@pacepard/ui/components/sidebar';

export function NavUser({
    user,
}: {
    user: {
        firstName: string;
        lastName: string;
        email?: string;
        avatar: string;
    };
}) {
    const { isMobile } = useSidebar();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <SidebarMenuButton
                        size="lg"
                        className="pl-1 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        <Avatar className="h-4 w-6 rounded-lg">
                            <AvatarImage
                                src={user.avatar}
                                alt={`${user.firstName} ${user.lastName}`}
                            />
                            <AvatarFallback className="rounded-lg">
                                {user.firstName.charAt(0)}
                                {user.lastName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-1 items-start text-left text-sm leading-tight">
                            <div className="grid flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="truncate font-medium">
                                        {user.firstName} {user.lastName}
                                    </span>

                                    {/* caret is the only trigger */}
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            type="button"
                                            className="flex items-center justify-center"
                                        >
                                            <ChevronDown className="size-4 shrink-0" />
                                        </button>
                                    </DropdownMenuTrigger>
                                </div>

                                {user.email && (
                                    <span className="truncate text-xs">
                                        {user.email}
                                    </span>
                                )}
                            </div>
                        </div>
                    </SidebarMenuButton>

                    <DropdownMenuContent
                        side="bottom"
                        align="center"
                        sideOffset={6}
                        alignOffset={14}
                        className="min-w-46 rounded-lg translate-x-20"
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Sparkles />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <UserCircle />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuItem>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
