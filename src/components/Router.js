import React from 'react';
import {BrowserRouter, StaticRouter} from 'react-router-dom'

export default function Router(props) {
    if (typeof window !== 'undefined') {
        return <BrowserRouter {...props} />
    } else {
        return <StaticRouter location={'/'} {...props} />
    }
}