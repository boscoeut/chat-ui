import { appConfig } from "@/config/app"

export function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center border border-gray-300 rounded-xl bg-white/80 w-10 h-10 overflow-hidden">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-xl" />
            </span>
            <span className="font-semibold text-nowrap text-2xl">{appConfig.name}</span>
        </div>
    )
}