import { AppState } from '@/app/store';
import { createContext, memo, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import LoginButton from './components/LoginOrRegisterButton';

import { throttle } from 'lodash';
import Avatar from './components/Avatar';
import Navigation from './components/Navigation';
import SearchBox from './components/SearchBox';
import ToggleThemeButton from './components/ToggleThemeButton';

export const HeaderHeight = 46;

const StyledHeader = styled.header`
	min-width: 350px;
	height: ${() => `${HeaderHeight}px`};
	padding: 0 1em;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: ${(props) => props.theme.foregroundColor};
	box-shadow: 0 0 2px ${(props) => props.theme.shadowColor};
	transition: ${(props) => props.theme.transition};
`;

const Container = styled.div`
	display: flex;
	align-items: center;
`;

export const HeaderContext = createContext({
	notWide: false,
});

const Header: React.FC = () => {
	const user = useSelector((state: AppState) => state.user);
	const getNotWide = () => window.matchMedia('(max-width: 666px)').matches;
	const [notWide, setNotWide] = useState(getNotWide);

	useEffect(() => {
		const onResize = throttle(
			() => {
				setNotWide(getNotWide());
			},
			60,
			{ trailing: true },
		);

		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
		};
	}, []);

	const initialValue = useMemo(() => ({ notWide }), [notWide]);

	return (
		<HeaderContext.Provider value={initialValue}>
			<StyledHeader>
				<Navigation />
				<SearchBox />
				<Container>
					{user.hasLogin ? <Avatar /> : <LoginButton />}
					{notWide ? null : (
						<>
							<div style={{ width: '1em' }} />
							<ToggleThemeButton />
						</>
					)}
				</Container>
			</StyledHeader>
		</HeaderContext.Provider>
	);
};

export default memo(Header);
