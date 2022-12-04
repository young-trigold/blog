import { memo, PropsWithChildren, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { useAppDispatch } from '@/app/store';
import { setCurrentHeadingId } from '@/app/store/pages/contentPage';
import { HeaderHeight } from '@/components/Header';
import getCurrentHeadingId from '../editor/utils/getCurrentHeadingId';

const StyledContentContainer = styled.div`
	max-height: ${() => `calc(100vh - ${HeaderHeight}px)`};
	overflow: overlay;
	scroll-padding-top: 2em;
`;

const ContentContainer: React.FC<PropsWithChildren> = (props) => {
	const { children } = props;
	const ref = useRef<HTMLDivElement>(null);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!ref.current) return;

		const onScroll = () => {
			if (!ref.current) return;
			const currentHeadingId = getCurrentHeadingId(ref.current);
			if (currentHeadingId) dispatch(setCurrentHeadingId(currentHeadingId));
		};

		ref.current.addEventListener('scroll', onScroll);

		return () => {
			ref.current?.removeEventListener('scroll', onScroll);
		};
	}, []);

	return <StyledContentContainer ref={ref}>{children}</StyledContentContainer>;
};

export default memo(ContentContainer);
