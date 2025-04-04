import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    const { className, ...otherProps } = props;
    return (
        <img
            src="/assets/images/sp.webp"
            alt="Logo"
            width={40}
            height={42}
            className={className}
            {...otherProps}
        />
    );
}
