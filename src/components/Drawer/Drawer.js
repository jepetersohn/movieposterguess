import React from 'react';

function Drawer({open, onClose, children}) {

    return(
       
        <div className={`DrawerContainer ${open ? 'open' : 'closed'}`}>
            <button onClick={onClose}>Close</button>
            {children}
        </div>
    )
}

export default Drawer;