import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { error };
    }


    render() {
        const { children } = this.props;
        const { error } = this.state;
        return error ? error.message : children;
    }
}
