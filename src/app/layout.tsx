"use client"

import "./globals.css";
import StoreProvider from "@/app/StoreProvider";
import {appFont} from "@/app/font";


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    function AppHtml() {
        return (
            <html lang="en">
            <head>
                <style jsx global>{`
                    html {
                        font-family: ${appFont.style.fontFamily} !important;
                    }
                `}</style>
                <link rel="preconnect" href="//fdn.fontcdn.ir"/>
                <link rel="preconnect" href="//v1.fontapi.ir"/>
                <link href="https://v1.fontapi.ir/css/Nazanin" rel="stylesheet"/>
            </head>
            <body>{children}</body>
            </html>
        )
    }

    return <StoreProvider children={<AppHtml/>}/>;
}
