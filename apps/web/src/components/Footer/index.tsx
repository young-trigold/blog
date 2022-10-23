import { throttle } from 'lodash';
import { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import Divider, { DividerType } from '../Divider';

const StyledFooter = styled.footer`
	min-width: 340px;
	height: 200px;
	background-color: ${(props) => props.theme.foregroundColor};
	box-shadow: 0px 0px 2px ${(props) => props.theme.shadowColor};
	padding: 1em;
	display: flex;
	align-items: flex-start;
	flex-wrap: wrap;
	justify-content: space-around;

	@media (max-width: 767px) {
		flex-direction: column;
		height: unset;
	}
`;

const StyledContact = styled.section`
	& > address {
		margin: 0.5em 0;
	}
`;

const Footer: React.FC = () => {
	const getNotWide = () => window.matchMedia('(max-width: 767px)').matches;
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
			return window.removeEventListener('resize', onResize);
		};
	}, []);

	return (
		<StyledFooter>
			<section>
				<p>
					<span>&copy;</span>
					<span>{`2022-至今 `}</span>
					<span>by Trigold. All rights reserved.</span>
				</p>
				<p>
					<a href="https://beian.miit.gov.cn/#/Integrated/index">陕ICP备2022000714号</a>
				</p>
			</section>
			<Divider type={notWide ? DividerType.Horizontal : DividerType.Vertical} />
			<StyledContact>
				<h2>联系方式</h2>
				<address>
					<span>Gmail:</span>
					<a href="mailto:cluscandlot@gmail.com">cluscandlot@gmail.com</a>
				</address>
				<address>
					<a href="https://github.com/young-trigold">我的 Github</a>
				</address>
			</StyledContact>
			<Divider type={notWide ? DividerType.Horizontal : DividerType.Vertical} />
			<nav>
				<h2>站外链接</h2>
				<li>
					<a href="https://developer.mozilla.org/zh-CN/">MDN 文档</a>
				</li>
				<li>
					<a href="https://zh-hans.reactjs.org/">React 官网</a>
				</li>
			</nav>
		</StyledFooter>
	);
};

export default memo(Footer);
