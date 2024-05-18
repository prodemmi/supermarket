import "./Badge.css"
import {memo} from "react";

interface BadgeProps {
    title: string
    center?: boolean
    color: 'danger' | 'warning' | 'info' | string
}

const Badge = memo(function Badge(props: BadgeProps) {
    return (
        <div className={`badge badge-${props.color} ${props.center ? 'm-auto' : ''}`}>
            {props.title}
        </div>
    )
})

export default Badge