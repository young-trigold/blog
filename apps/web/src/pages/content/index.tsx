import React, { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { AppState, useAppDispatch } from '@/app/store';
import {
  ContentPageContext,
  resetContentPage,
  setCurrentHeadingId,
} from '@/app/store/pages/contentPage';
import LoadingIndicator from '@/components/LodingIndicator';
import { useGetArticle } from '@/hooks/articles/useGetArticle';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import ContentContainer from './components/ContentContainer';
import ActionBar from './components/actionBar';
import { Catalog, CatalogButton } from './components/catalog';
import CommentList from './components/comment/CommentList';
import { Editor } from './components/editor';
import {
  BoldExtension,
  CodeBlockExtension,
  CodeExtension,
  HeadingExtension,
  ItalicExtension,
  LinkExtension,
  SubExtension,
  SupExtension,
  UnderlineExtension,
} from './components/editor/extensions';
import { ImageExtension } from './components/editor/extensions/nodeExtensions/ImageExtension';
import { ListExtensions } from './components/editor/extensions/nodeExtensions/listExtensions';
import { TableExtensions } from './components/editor/extensions/nodeExtensions/tableExtensions';
import { SelectionTooltipExtension } from './components/editor/extensions/plainExtensions/SelectionTooltipExtension';
import { HandleDOMEvents } from './components/editor/store';
import findHeadingElementById from './components/editor/utils/findHeadingElementById';

export const selectionTooltipExtension = new SelectionTooltipExtension();

const StyledContentPage = styled.div`
  max-height: 100%;
  position: relative;
  white-space: pre-wrap;
  background-color: ${(props) => props.theme.backgroundColor};
  transition: ${(props) => props.theme.transition};
`;

const MainContainer = styled.main`
  position: relative;
  display: flex;
  align-items: flex-start;
`;

interface ContentPageProps {
  isChapter: boolean;
  editable: boolean;
}

const ContentPage: React.FC<ContentPageProps> = (props) => {
  const { isChapter, editable } = props;
  const { itemId } = useParams();
  const dispatch = useAppDispatch();

  const contentPageContext: ContentPageContext = useMemo(() => ({ isChapter }), []);

  const { catalog } = useSelector((state: AppState) => state.contentPage);
  const [currentHeadingIdSearchParam, setCurrentHeadingIdSearchParam] = useSearchParams();
  const isFirstRef = useRef(true);
  useEffect(() => {
    if (!isFirstRef.current) return;
    const initialHeadingIdFromURL = currentHeadingIdSearchParam.get('currentHeadingId');
    const currentHeadingElement = findHeadingElementById(initialHeadingIdFromURL ?? '');
    if (currentHeadingElement) {
      currentHeadingElement.scrollIntoView();
      isFirstRef.current = false;
      dispatch(setCurrentHeadingId(initialHeadingIdFromURL!));
    }
  });

  useEffect(() => {
    const { currentHeadingId } = catalog;
    if (!currentHeadingId) return;
    setCurrentHeadingIdSearchParam({ currentHeadingId }, { replace: true });
  }, [catalog.currentHeadingId]);

  // unmount
  useEffect(() => {
    return () => {
      dispatch(resetContentPage());
    };
  }, []);

  const extensions = useMemo(
    () => [
      new BoldExtension(),
      new ItalicExtension(),
      new UnderlineExtension(),
      new LinkExtension(),
      new SubExtension(),
      new SupExtension(),
      new CodeExtension(),
      new HeadingExtension(),
      new CodeBlockExtension(),
      new ImageExtension(),
      ...ListExtensions.map((Extension) => new Extension()),
      ...TableExtensions.map((Extension) => new Extension()),
      selectionTooltipExtension,
    ],
    [],
  );

  const onChange = (view: EditorView, tr: Transaction) => {
    view.updateState(view.state.apply(tr));
  };

  const handleDOMEvents: HandleDOMEvents = useMemo(() => ({}), []);

  const { isLoading, isError, error, data: item } = useGetArticle(itemId, isChapter);
  useDocumentTitle(`${isChapter ? '章节' : '文章'} - ${item?.title}`, [item?.title]);

  if (isLoading) return <LoadingIndicator />;
  if (isError) return <span>{(error as Error).message}</span>;

  return (
    <ContentPageContext.Provider value={contentPageContext}>
      <StyledContentPage>
        <Header />
        <ContentContainer>
          <MainContainer>
            <Catalog />
            <Editor
              extensions={extensions}
              doc={item?.content}
              editable={editable}
              autoFocus={true}
              onChange={onChange}
              handleDOMEvents={handleDOMEvents}
            />
            <CommentList />
            {editable && <ActionBar />}
            <CatalogButton />
          </MainContainer>
          <Footer />
        </ContentContainer>
      </StyledContentPage>
    </ContentPageContext.Provider>
  );
};

export default ContentPage;
