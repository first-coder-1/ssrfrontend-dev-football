import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from "../../../components/footer";

describe('Footer', () => {
    it('renders a footer', () => {
        render(<Footer />);
        const footer = screen.getByTestId('footer');
        expect(footer).toBeInTheDocument();
    });

    it('renders the footer unchanged', () => {
        const { container } = render(<Footer />);
        expect(container).toMatchSnapshot();
    });
});
