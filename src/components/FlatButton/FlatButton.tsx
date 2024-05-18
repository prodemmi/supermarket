import React from "react";
import "./FlatButton.css";

interface Props {
    icon: React.ReactNode
    title: string
    color: 'danger' | 'primary' | 'gray'
}

const _colorMap: Record<Props['color'], string> = {
    'danger': 'text-red-500',
    'gray': 'text-checkout-dark-300',
    'primary': 'text-checkout-primaryTransparet-main',
}

export default function FlatButton(props: Props) {
    return (
        <button className="profile__flat__button">
            <div className="profile__flat__button--icon">{props.icon}</div>
            <div className={`profile__flat__button--label ${_colorMap[props.color]}`}>{props.title}</div>
        </button>
    );
}