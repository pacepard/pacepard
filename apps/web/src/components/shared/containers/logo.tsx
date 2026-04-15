'use client';

import Image from 'next/image';

import { clsx } from 'clsx';

import { ILogo } from '@/utils/interfaces';

const LogoContainer = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
    return <div className={clsx(className, 'h-48 w-48 pr-10')} {...props} />;
};

/* eslint-disable @typescript-eslint/no-unused-vars */
const Logo = (data: ILogo) => {
    const { large, className, ...rest } = data;

    const divProps: React.HTMLAttributes<HTMLDivElement> = {};
    if (rest.id) divProps.id = rest.id;
    if (rest.style) divProps.style = rest.style;
    if (rest.title) divProps.title = rest.title;

    return (
        <>
            {' '}
            <div
                className={clsx(className, 'pointer-events-auto')}
                {...divProps}
            >
                <Image
                    src="blocks/pacepard.svg"
                    alt="Damola Oladipo"
                    className="w-26"
                    width={100}
                    height={100}
                    priority
                />
            </div>
        </>
    );
};

export { Logo, LogoContainer };
