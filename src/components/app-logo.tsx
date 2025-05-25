import { appConfig } from "@/config/app"

export function AppLogo() {
    return (
        <div className='flex items-center gap-2'>
            <img src="/logo.jpg" alt="Logo" className="size-8" />
            <span className="font-semibold text-nowrap text-2xl">{appConfig.name}</span>
        </div>
    )
}