import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import React, { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useAppDispatch } from '@/app/store';
import {
  ContentPageContext,
  resetContentPage,
  setCurrentHeadingId,
  setEditorState,
} from '@/app/store/pages/contentPage';
import { HeaderHeight } from '@/components/Header';
import LoadingIndicator from '@/components/LodingIndicator';
import { useGetArticle } from '@/hooks/articles/useGetArticle';
import useDocumentTitle from '@/hooks/useDocumentTitle';

import Footer from '../../components/Footer';
import Header from '../../components/Header';
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
import getCurrentHeadingId from './components/editor/utils/getCurrentHeadingId';

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

const StyledContentContainer = styled.div`
  max-height: ${() => `calc(100vh - ${HeaderHeight}px)`};
  overflow: overlay;
  scroll-padding-top: 2em;
`;

interface ContentPageProps {
  isChapter: boolean;
  editable: boolean;
}

const ContentPage: React.FC<ContentPageProps> = (props) => {
  const { isChapter, editable } = props;
  const { itemId } = useParams();
  const dispatch = useAppDispatch();

  const contentPageContext: ContentPageContext = useMemo(() => ({ isChapter }), [isChapter]);

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

  const onScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
    const { target } = event;
    if (!(target instanceof HTMLDivElement)) return;
    const currentHeadingId = getCurrentHeadingId(target);
    if (currentHeadingId) dispatch(setCurrentHeadingId(currentHeadingId));
  };

  const onChange = (view: EditorView, tr: Transaction) => {
    const newState = view.state.apply(tr);
    dispatch(setEditorState(newState));
    view.updateState(newState);
  };

  const handleDOMEvents: HandleDOMEvents = useMemo(() => ({}), []);

  const { isLoading, isError, error, data: item } = useGetArticle(itemId, isChapter);
  useDocumentTitle(`${isChapter ? '章节' : '文章'} - ${item?.title}`, [item?.title]);

  // unmount
  useEffect(() => {
    return () => {
      dispatch(resetContentPage());
    };
  }, []);

  if (isLoading) return <LoadingIndicator />;
  if (isError) return <span>{(error as Error).message}</span>;

  return (
    <ContentPageContext.Provider value={contentPageContext}>
      <StyledContentPage>
        <Header />
        <StyledContentContainer onScroll={onScroll}>
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
        </StyledContentContainer>
      </StyledContentPage>
    </ContentPageContext.Provider>
  );
};

export default ContentPage;
