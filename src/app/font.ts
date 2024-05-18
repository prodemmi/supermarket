import localFont from "next/font/local";

export const appFont = localFont({
    src: [
        {
            path: './fonts/iransans/woff2/IRANSansXFaNum-Light.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: './fonts/iransans/woff2/IRANSansXFaNum-Medium.woff2',
            weight: '500',
            style: 'normal',
        },
        {
            path: './fonts/iransans/woff2/IRANSansXFaNum-Bold.woff2',
            weight: '600',
            style: 'normal',
        },
        {
            path: './fonts/iransans/woff2/IRANSansXFaNum-Black.woff2',
            weight: '700',
            style: 'normal',
        },
    ]
})