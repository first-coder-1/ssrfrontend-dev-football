import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from "../../../components/header";

describe('Header', () => {
    it('renders a heading', () => {
        render(<Header />);
        const heading = screen.getByTestId('header');
        expect(heading).toBeInTheDocument();
    });

    it('renders the heading unchanged', () => {
        const { container } = render(<Header />);
        expect(container).toMatchSnapshot();
    });
});
