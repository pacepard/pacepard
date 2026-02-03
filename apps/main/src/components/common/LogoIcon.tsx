

interface IPacepardIcon {
    src?: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    className?: string;
}

const PacepardIcon = (props: IPacepardIcon) => {

    const { src, alt, width = 40, height = 'auto', className } = props;

    return (
        
            <img
                src={src || "/blocks/pacepard-icon.svg"}
                alt={alt || "Pacepard"}
                width={width}
                height={height}
                className={`object-contain ${className}`}
                style={{ width: typeof width === "number" ? `${width}px` : width, height: typeof height === "number" ? `${height}px` : height }}
            />
    );
};

export default PacepardIcon;
