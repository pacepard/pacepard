import Image from 'next/image';
import Link from 'next/link';

const Logo = ({ sticky }: { sticky: boolean }) => {
    return (
        <Link href="/" className="flex items-center min-w-0 flex-shrink-0">
            <div
                className="
                    relative
                    w-[110px]
                    sm:w-[140px]
                    md:w-[170px]
                    lg:w-[190px]
                    min-w-[90px]
                "
            >
                <Image
                    src="/images/logo/pacepard-logo.svg"
                    alt="Pacepard Logo"
                    width={190}
                    height={34}
                    priority
                    className={`
                        w-full h-auto object-contain
                        transition-all duration-300
                        ${sticky ? 'invert-0' : 'invert'}
                    `}
                />
            </div>
        </Link>
    );
};

export default Logo;
