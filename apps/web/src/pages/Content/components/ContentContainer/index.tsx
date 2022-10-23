import { throttle } from 'lodash';
import { memo, PropsWithChildren, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { AppDispatch } from '@/app/store';
import { setCurrentHeadingID } from '@/app/store/contentPage';
import { HeaderHeight } from 'src/pages/components/Header';
import getCurrentHeadingID from '../editor/utils/getCurrentHeadingID';

const StyledContentContainer = styled.div`
	max-height: ${() => `calc(100vh - ${HeaderHeight}px)`};
	overflow: overlay;
	scroll-padding-top: 2em;
`;

const ContentContainer: React.FC<PropsWithChildren> = (props) => {
	const { children } = props;
	const ref = useRef<HTMLDivElement>(null);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (!ref.current) return;

		const onScroll = throttle(
			() => {
				if (!ref.current) return;
				const currentHeadingID = getCurrentHeadingID(ref.current);
				if (currentHeadingID) dispatch(setCurrentHeadingID(currentHeadingID));
			},
			60,
			{ trailing: true },
		);

		ref.current.addEventListener('scroll', onScroll);

		return () => {
			ref.current?.removeEventListener('scroll', onScroll);
		};
	}, []);

	return <StyledContentContainer ref={ref}>{children}</StyledContentContainer>;
};

export default memo(ContentContainer);
