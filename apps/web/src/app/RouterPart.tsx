import React, { Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import LoadingPage from '../components/LoadingIndicator';
import NotFoundPage from '../components/NotFoundPage';
import HomePage from '../pages/Home';

const NotePage = React.lazy(() => import('../pages/Note'));
const ContentPage = React.lazy(() => import('../pages/Content'));
const ChapterListPage = React.lazy(() => import('../pages/ChapterList'));
const ProtectPage = React.lazy(() => import('../pages/Admin'));
const UserPage = React.lazy(() => import('../pages/User'));

const RouterPart = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<Navigate to="/articles" />} />
        <Route path="/articles" element={<HomePage />} />
        <Route
          path="/notes"
          element={
            <Suspense fallback={<LoadingPage />}>
              <NotePage />
            </Suspense>
          }
        />

        <Route
          path="/notes/:noteTitle"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ChapterListPage />
            </Suspense>
          }
        />

        <Route
          path="/articles/:itemID"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ContentPage isChapter={false} editable={false} />
            </Suspense>
          }
        />
        <Route
          path="/edit/articles/:itemID"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ContentPage isChapter={false} editable />
            </Suspense>
          }
        />

        <Route
          path="/chapters/:itemID"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ContentPage isChapter editable={false} />
            </Suspense>
          }
        />

        <Route
          path="/edit/chapters/:itemID"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ContentPage isChapter editable />
            </Suspense>
          }
        />

        <Route
          path="/admin"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ProtectPage />
            </Suspense>
          }
        />

        <Route
          path="/users/:userId"
          element={
            <Suspense fallback={<LoadingPage />}>
              <UserPage />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
}

export default RouterPart;
