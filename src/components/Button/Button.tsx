import React from "react";
import "./Button.css";

interface Props {
    title: string
    outline?: boolean
    disable?: boolean
    color: 'primary'
    onClick?: Function
}

const _colorMap: Record<Props['color'], string> = {
    'primary': 'bg-checkout-primaryTransparet-main',
}

export default function Button(props: Props) {
    return (
        <button
            disabled={props.disable}
            onClick={() => props.onClick && props.onClick()}
            className={`profile__button ${props.outline ? 'outline' : _colorMap[props.color]}`}>{props.title}</button>
    );
}