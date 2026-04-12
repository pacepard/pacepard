interface IPacepardLogo {
    src?: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    className?: string;
}

const PacepardLogo = (props: IPacepardLogo) => {
    const { src, alt, width = 190, height = 34, className } = props;

    return (
        <img
            src={src || '/pacepard.svg'}
            alt={alt || 'Pacepard Logo'}
            width={width}
            height={height}
            className={`object-contain ${className}`}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
            }}
        />
    );
};

export default PacepardLogo;
