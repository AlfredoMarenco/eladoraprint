import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <div className="flex items-center justify-center w-full">
            <AppLogoIcon className="h-8 w-auto object-contain" />
        </div>
    );
}
