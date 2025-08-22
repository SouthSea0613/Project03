import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-background border-t border-border w-full py-6">
            <div className="container mx-auto text-center text-text-secondary">
                <p>&copy; {new Date().getFullYear()} Project03. All Rights Reserved.</p>
                <div className="flex justify-center space-x-4 mt-2">
                    <a href="/terms" className="hover:text-primary">이용약관</a>
                    <a href="/privacy" className="hover:text-primary">개인정보처리방침</a>
                    <a href="/contact" className="hover:text-primary">고객센터</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;