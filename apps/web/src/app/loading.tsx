import { PacepardIconLoader } from '@/components/shared/pacepard-icon-loader';

export default function Loading() {
    return (
        <div className="flex min-h-[50dvh] w-full items-center justify-center bg-background">
            <PacepardIconLoader size={56} />
        </div>
    );
}
