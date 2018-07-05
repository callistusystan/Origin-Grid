import React, { Component } from 'react';
import OriginLogo from './OriginLogo';

class TopBar extends Component {
    render() {
        return (
            <div style={{ width: '100%', height: 72, position: 'fixed', display: 'flex', alignItems: 'center', boxShadow: '0 0 2px rgba(0, 0, 0, 0.3)', backgroundColor: '#FFF', padding: '6px 8px', zIndex: 100, ...this.props.style }}>
                <OriginLogo style={{ width: 60, height: 60, position: 'absolute' }} />
                <h2 style={{ margin: 'auto' }}>Origin Grid</h2>
            </div>
        );
    }
}

TopBar.propTypes = {};

export default TopBar;
