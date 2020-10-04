import styled from 'styled-components';

export const Centered = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: ${({ height }) => {
		return height === 'full'
			? '100vh'
			: !height
				? 'auto'
				: `${height}rem`;
	}};
`;
