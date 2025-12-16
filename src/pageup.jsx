//button in which i want to add a click event to got ot top fo the page
import React from 'react';
const PageUp = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button onClick={scrollToTop} style={styles.button}>
            ↑ Top
        </button>
    );
}
const styles = {
    button: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px 15px',
        fontSize: '16px',
        borderRadius: '5px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
    }
};
export default PageUp;