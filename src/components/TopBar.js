import React, { Component } from 'react';
import OriginLogo from './OriginLogo';

class TopBar extends Component {
    render() {
        const isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));

        return (
            <div style={{ width: '100%', height: isMobile ? 72 : 72+30, display: 'flex', alignItems: 'center', boxShadow: '0 0 2px rgba(0, 0, 0, 0.3)', backgroundColor: '#FFF', padding: `${isMobile ? 6 : 30+6}px 8px 6px 8px`, zIndex: 100, ...this.props.style }}>
                <OriginLogo style={{ width: 60, height: 60, position: 'absolute' }} />
                <h2 style={{ margin: 'auto' }}>Origin Grid</h2>
            </div>
        );
    }
}

TopBar.propTypes = {};

export default TopBar;
