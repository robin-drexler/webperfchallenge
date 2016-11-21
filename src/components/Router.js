import React from 'react';
import {BrowserRouter, ServerRouter} from 'react-router'

export default function Router(props) {
    if (typeof window !== 'undefined') {
        return <BrowserRouter {...props} />
    } else {
        return <ServerRouter location={'/'} {...props} />
    }
}