import BreadcrumbMap from '@/_data/breadcrumb-map';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@pacepard/ui/components/breadcrumb';
import { useLocation } from 'react-router-dom';

const TopNav = () => {
    const location = useLocation();
    const pathParts = location.pathname.split('/').filter(Boolean);

    const paths = pathParts.map(
        (_, idx) => '/' + pathParts.slice(0, idx + 1).join('/'),
    );

    return (
        <div>
            <Breadcrumb>
                <BreadcrumbList>
                    {paths.map((path, idx) => {
                        const isLast = idx === paths.length - 1;
                        const label = BreadcrumbMap[path] || pathParts[idx];

                        return (
                            <BreadcrumbItem key={path}>
                                {isLast ? (
                                    <BreadcrumbPage>{label}</BreadcrumbPage>
                                ) : (
                                    <>
                                        <BreadcrumbLink href={path}>
                                            {label}
                                        </BreadcrumbLink>
                                        <BreadcrumbSeparator />
                                    </>
                                )}
                            </BreadcrumbItem>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
};

export default TopNav;
